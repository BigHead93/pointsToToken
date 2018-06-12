//添加了动态估计gas Limit功能
//适用于server_get
var fs = require("fs");
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");
var redisUtils = require('./redisUtils');
var domain = require('./domain');
var errorDealer = require('./ErrorDealer');
// var nonceDealer = require('./nonceDealer');
var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var logger = require('log4js').getLogger("ETH");

var web3 = new Web3(new Web3.providers.HttpProvider(domain.HttpProvider));


var fromAddr     = domain.fromAddr;
var fromAddrKey  = domain.fromAddrKey;
var contractAddr = domain.contractAddr;
var abi 		 = domain.abi;
var gasLimit  	 = domain.gasLimit;
var gasPrice     = web3.utils.toHex(domain.gasPrice);
var privateKey   = new Buffer.from(fromAddrKey, 'hex');
var contract     = new web3.eth.Contract(abi, contractAddr, {
	from: fromAddr
});

function verifyTransferInfo(_body){
	var _serialId = _body.serialId;
	var _user = _body.user;
	var _address = _body.address;
	var _amount = _body.amount;
	var _creationTime = _body.creationTime;
	var flag = true;

	if(_serialId && _user && _address && _amount && _creationTime){
		if(!web3.utils.isAddress(_address)){
			flag = false;
			// console.log('The receiver address is invalid: ' + body);
			logger.error('verifyTransferInfo: address invalid - ' + address);
			return "Invalid address";
		}
		if(isNaN(_amount)){
			flag = false;
			// console.log('The transfer value is invalud: ' + body);
			logger.error('verifyTransferInfo: amount invalid - ' + amount);
			return "Invalid amount";
		}
		if(flag){
			return true;
		}
	}else{
		logger.error('info missing: ' + body);
		return "require serialId/user/address/amount/creationTime";
	}
}

function verifyIfAddressValid(_address) {	
	if(web3.utils.isAddress(_address)){
		return true;
	}else{
		return false;
	}
}

function transfer (_serialId, _address, _amount) {
	// if(_times == 5){
	// 	logger.error("retry 5 times error: " + _serialId);
	// 	return;
	// }
	var toAddress = _address;
	var toAmount = parseFloat(_amount) * 1000000000000;  //10^12
	logger.info('Start transfer - %s - %s - %s', _serialId, _address, toAmount);

	var data = contract.methods.transfer(toAddress, toAmount).encodeABI();
	// console.log("data: " + data);

	web3.eth.getTransactionCount(fromAddr, function(err, nonce){
	// nonceDealer.getNonce(function(err, nonce){
		if(err){
			// console.log("get transaction count: " + err);
			logger.error("getTransactionCount err when %s - %s", _serialId, err);
	    	redisUtils.set_new_to_finish(_serialId, _address);
	    	redisUtils.delete_new_transaction(_serialId, _address);
		}else{
			logger.debug("Get nonce: %s when %s", nonce, _serialId);
			// console.log('nonce: ' + nonce);
			// web3.eth.estimateGas({
			// 		from : fromAddr,
			// 		to   : toAddress,
			// 		nonce: nonce,
			// 		data : data
			// 	}).then((estimateGas) => {
					// console.log("estimateGas: " + estimateGas);

					var rawTx = {
						"from"		: fromAddr,    	     //from是当前使用的钱包账户地址
						"nonce"		: nonce, 
						"gasPrice"	: gasPrice, 		
						"gasLimit"	: gasLimit,
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
					        console.log("TxHash: " + hash);
						    if (!err) {
						        setProgress(_serialId, _address, hash);
								logger.info("Send transaction success - %s - %s - %s", _serialId, _address, hash);
						    } 
						    else {
						    	// console.log("serialId: " + _serialId);
						    	// console.log("hash: " + hash);
						    	if(hash == null){
							    	logger.error('Error in sendSignedTransaction: - %s - %s - %s', _serialId, _address, err);
							    	transfer(_serialId, _address, _amount);
						    	}else{
							    	logger.error('Error in sendSignedTransaction: - %s - %s - %s - %s', _serialId, _address, hash, err);
						    	}
						 		// errorDealer.errorSendSignedTransaction(err);
						    }
						}
					).on('receipt', function (receipt) {
						logger.info(receipt);
					});
				// })
		}
	});
}

function getNonce(){
	web3.eth.getTransactionCount(fromAddr, function(err, nonce){
		if(err || nonce == 0){
			getNonce();
		}
		return nonce;
	})
}

function setProgress(_serialId, _address, _hash){
	redisUtils.set_progress_transaction(_serialId, _address, _hash);
    redisUtils.get_progress_transaction(_serialId, _address, function(err, value){
    	if(err){
    		logger.error('get_progress_transaction in setProgress error: - %s - %s - %s', _serialId, _address, _hash, err);
    	}else{
    		if(value == null){
    			setProgress(_serialId, _address, _hash);
    		}else{
			    redisUtils.delete_new_transaction(_serialId, _address);
    		}
    	}
    })
}

module.exports = {
	verifyTransferInfo,
	transfer,
	verifyIfAddressValid
}
