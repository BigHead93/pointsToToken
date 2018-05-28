//添加了动态估计gas Limit功能
//适用于server_get
let fs =require("fs");
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");
var redisUtils = require('./lib/redisUtils');
// var domain = require('domain');

//if(typeof web3 !== 'undefined'){
//	var web3 = new Web3(web3.currentProvider);
//}else {
	var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/SHxTpLWAN5i6oolxZVjC"));
//}

let walletbase = "0x34c95D243C47aC6a77E897188F019ff1AcfDABca";  //钱包账户地址
let contractAddr = "0x023C410739546ea1feBF070575Fcc9FcbB3f28fF";    //contract address
var privateKey = new Buffer.from("37dfa140db0900966a457443ca38fa695e45a845897a4f855e36ad2dcbd37c42", 'hex');
var functionHash = web3.utils.sha3("transfer(address,uint256)").substr(0,10);



function coinToToken(body){
	var toAddress = body.address;
	var toAmount = body.amount;
	var flag = true;
	if(toAddress && toAmount){
		console.log("-----------------------------------------------------");
		console.log("toAddress: " + toAddress);
		console.log("toAmount: " + toAmount);
		if(!web3.utils.isAddress(toAddress)){
			flag = false;
			console.log('The receiver address is invalid');
			redisUtils.set_new_to_finish(body.address, body.creationTime);
			redisUtils.delete_new_transaction(body.address, body.creationTime);
			// throw new Error('The receiver address is invalid');
		}
		if(isNaN(toAmount)){
			flag = false;
			console.log('The transfer value is invalud');
			redisUtils.set_new_to_finish(body.address, body.creationTime);
			redisUtils.delete_new_transaction(body.address, body.creationTime);
			// throw new Error('The transfer value is invalud');
		}
		if(flag){
			toAmount *= 1000000000000000000;

			var data =  functionHash
					+ "000000000000000000000000" 
					+ toAddress.substr(2,40) 
					+ "00000000000000000000000000000000" 
					+ toHex32(toAmount);
			console.log("data: " + data);
			web3.eth.estimateGas({
					// nonce: 
					to  : toAddress,
					data: data
				}).then((value) => {
					var estimate = 0x493e0; //value * 2;
					console.log('estimate gas limit: ' + estimate);		
					transfer(estimate, data, body);
				});

			// transfer(toAddress, toAmount);
		}
	}else{
		console.log("Please run the scripts by providing:");
		console.log(" 1. the address of the receiver");
		console.log(" 2. the amount of token");
		redisUtils.set_new_to_finish(body.address, body.creationTime);
		redisUtils.delete_new_transaction(body.address, body.creationTime);
		
	}
}

function transfer(estimateGas, data, body) {
	console.log('start function transfer');
	// web3.eth.getTransactionCount(walletbase).then((value) => {
	web3.eth.getTransactionCount(walletbase, function(err, value){
		if(err){
	    	redisUtils.set_new_to_finish(body.address, body.creationTime);
	    	redisUtils.delete_new_transaction(body.address, body.creationTime);

		}else{
			console.log('nonce: ' + value);

			var rawTx = {
				"from"		: walletbase,    	//from是当前使用的钱包账户地址
				"nonce"		: value, 
				"gasPrice"	: web3.utils.toHex(2000000000), //2 gwei
				"gasLimit"	: estimateGas,
				"to"		: contractAddr,     //to是合约地址
				"value"		: "0x00",
				"data"		: data
				// "chainId"	: 3
			}

			var tx = new Tx(rawTx);
			tx.sign(privateKey);
			var serializedTx = tx.serialize();

			web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'),
				function(err, hash) {
					console.log('serializedTx' + serializedTx.toString('hex'));
				    if (!err) {
				        console.log("TxHash: " + hash);
				        redisUtils.set_progress_transaction(body.address, body.creationTime, hash);
				        redisUtils.delete_new_transaction(body.address, body.creationTime);
						console.log("Send transaction success");
				    } 
				    else {
				    	redisUtils.set_finish_transaction(body.address, body.creationTime, 'Failed');
				    	redisUtils.delete_new_transaction(body.address, body.creationTime);
				        console.log(err);

				    }
				});
		}
	});
}

function toHex32(value){
	let zeros = "00000000000000000000000000000000";
	let valueHex = value.toString(16);
	let len0 = 32 - valueHex.length;
	return zeros.substr(0, len0) + valueHex;
}


module.exports = {
	coinToToken
}
