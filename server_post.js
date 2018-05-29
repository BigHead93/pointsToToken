var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ETH = require('./coinToToken.js');
var redisUtils = require('./lib/redisUtils'); 
var query = require('./lib/query');

const cluster = require('cluster');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/coinToToken', function (req, res) {
	var body = req.body;
	// console.log(body);
	console.log('Get new transaction %s %s %s %s', body.user, body.address, body.amount, body.creationTime);
	redisUtils.set_new_transaction(body.user, 
									body.address, 
									body.amount, 
									body.creationTime);
	// redisUtils.get_new_transaction(body.address, body.creationTime);
	ETH.coinToToken(body);
	var result = {
		return_code: 'OK'
	}
	res.send(result);
})

app.post('/transactionStatus', function(req, res) {
	var body = req.body;
	// console.log(body);
	console.log('Query transaction status: %s %s', body.address, body.creationTime);
	query.queryStatus(body.address, body.creationTime, (value) => {
		if(typeof value == 'object'){
			res.send(value);
		}else{
			res.send("new or not exist");
		}
	})
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
}, 0.5 * 1000 * 60)






