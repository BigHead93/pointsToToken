var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ETH = require('./lib/ETH.js');
var redisUtils = require('./lib/redisUtils'); 
var query = require('./lib/query');
var AESEncrypt = require('./lib/encrypt');

var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var logger = require('log4js').getLogger("server");

const cluster = require('cluster');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

app.post('/coinToToken', function (req, res) {
	var aesEncrypt = new AESEncrypt();
	var candy = req.header("candy")
	var body = req.body
	var result = {
		code: 0,
		message: null
	};
	try{
		var decryptBody = aesEncrypt.decrypt(candy,body)	
	}catch(err){
		result.code = 0;
		result.message = "verify failed";
		logger.error('coinToToken: verify failed');
		res.send(result);
	}

	var body = JSON.parse(decryptBody);
	console.log(body);

	if(candy !== body.serialId){
		result.code = 0;
		result.message = "verify failed";
		logger.error('coinToToken: verify failed');
		res.send(result);
	}
	
	logger.info('Get new transaction %s %s %s %s %s', 
						body.serialId, body.user, body.address, body.amount, body.creationTime);
	var verifyResult = ETH.verifyTransferInfo(body);
	if(verifyResult == false){
		result.code = 0;
		result.message = verifyResult;
		res.send(result);
	}else{
		redisUtils.set_new_transaction(body.serialId,
									body.user, 
									body.address, 
									body.amount, 
									body.creationTime);
		// redisUtils.get_new_transaction(body.address, body.creationTime);
		ETH.transfer(body.serialId, body.address, body.amount);
		result.code = 1;
		result.message = "Get request successs, start transfer.";
		logger.info("coinToToken: " + body.serialId + " - " + result.message);
		res.send(result);
	}
})

app.post('/verifyIfAddressValid', function (req, res) {
	var body = JSON.parse(req.body);
	console.log(body);
	var result = {
		code: 0,
		message: null
	};
	var verifyResult = ETH.verifyIfAddressValid(body.address);
	// console.log(verifyResult);
	result.code = verifyResult == true ? 1 : 0;
	result.message = verifyResult;
	// console.log(result.message);
	logger.info("verifyIfAddressValid: " + body.address + " - " + verifyResult);
	res.send(result);
})

app.post('/queryTransactionStatus', function(req, res) {
	var body = JSON.parse(req.body);
	// console.log(body);
	logger.info('queryTransactionStatus: %s - %s', body.serialId, body.address);
	query.queryStatus(body.serialId, body.address, (value) => {
		logger.info("queryTransactionStatus: serialId: " + body.serialId + " is: " + JSON.stringify(value));
		if(typeof value == 'object'){
			res.send(value);
		}else{
			res.send("null");
		}
	})
})

app.post('/decrypt',function(req,res){
	var aesEncrypt = new AESEncrypt();
	var candy = req.header("candy")
	console.log(req);
	var body = req.body
	var ret = aesEncrypt.decrypt(candy,body)
	res.send(ret)
})

app.post('/encrypt',function(req,res){
	var aesEncrypt = new AESEncrypt();
	var key = req.header("candy")
	var text = req.body;
	var ret = aesEncrypt.encrypt(key, text)
	res.send(ret)
})

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Listening start");
})


cluster.setupMaster({
	exec: 'lib/worker.js',
	slient: true
});

var worker = cluster.fork();
worker.on('fork', function(worker) {
	console.log(`[master] : fork worker ${worker.id}`);
});

worker.on('exit', function(worker, code, signal) {
	console.log(`[master] : worker ${worker.id} died`);
});


worker.send('start');
setInterval(() => {
	worker.send('start');
}, 1 * 1000 * 60)






