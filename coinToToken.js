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

const walletBase   = "0x34c95D243C47aC6a77E897188F019ff1AcfDABca";  //钱包账户地址
const contractAddr = "0x023C410739546ea1feBF070575Fcc9FcbB3f28fF";    //contract address
const privateKey   = new Buffer.from("37dfa140db0900966a457443ca38fa695e45a845897a4f855e36ad2dcbd37c42", 'hex');
const functionHash = web3.utils.sha3("transfer(address,uint256)").substr(0,10);
const gasPrice     = web3.utils.toHex(4 * 10^9);


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
			transfer(body);
		}
	}else{
		console.log("Please run the scripts by providing:");
		console.log(" 1. the address of the receiver");
		console.log(" 2. the amount of token");
		redisUtils.set_new_to_finish(body.address, body.creationTime);
		redisUtils.delete_new_transaction(body.address, body.creationTime);
		
	}
}

function transfer(_body) {
	console.log('Start function transfer');
	var toAddress = _body.address;
	var toAmount = _body.amount;
	var data = functionHash
				+ "000000000000000000000000" 
				+ toAddress.substr(2,40) 
				+ "00000000000000000000000000000000" 
				+ toHex32(toAmount);
	console.log("data: " + data);

	web3.eth.getTransactionCount(walletBase, function(err, value){
		if(err){
			console.log("get transaction count: " + err);
	    	redisUtils.set_new_to_finish(_body.address, _body.creationTime);
	    	redisUtils.delete_new_transaction(_body.address, _body.creationTime);
		}else{
			var nonce = value;
			console.log('nonce: ' + nonce);
			web3.eth.estimateGas({
					from : walletBase,
					to   : toAddress,
					nonce: nonce,
					data : data
				}).then((value) => {
					var estimateGas = value * 2;
					console.log("estimateGas: " + estimateGas);

					var rawTx = {
						"from"		: walletBase,    	//from是当前使用的钱包账户地址
						"nonce"		: nonce, 
						"gasPrice"	: gasPrice, 		//4 gwei
						"gasLimit"	: estimateGas,
						"to"		: contractAddr,     //to是合约地址
						"value"		: "0x00",
						"data"		: data,
						"chainId"	: 3
					}

					var tx = new Tx(rawTx);
					tx.sign(privateKey);
					var serializedTx = tx.serialize();

					web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'),
						function(err, hash) {
							// console.log('serializedTx' + serializedTx.toString('hex'));
						    if (!err) {
						        console.log("TxHash: " + hash);
						        redisUtils.set_progress_transaction(_body.address, _body.creationTime, hash);
						        redisUtils.delete_new_transaction(_body.address, _body.creationTime);
								console.log("Send transaction success");
						    } 
						    else {
						    	redisUtils.set_finish_transaction(_body.address, _body.creationTime, 'Failed');
						    	redisUtils.delete_new_transaction(_body.address, _body.creationTime);
						        console.log(err);

						    }
						});
				})
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
