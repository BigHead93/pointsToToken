//添加了动态估计gas Limit功能
//适用于server_get
var fs = require("fs");
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");
var redisUtils = require('./redisUtils');
var domain = require('./domain');
var errorDealer = require('./ErrorDealer');

var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/SHxTpLWAN5i6oolxZVjC"));


var fromAddr   = domain.fromAddr;
var fromAddrKey  = domain.fromAddrKey;
var contractAddr = domain.contractAddr;
var abi 		 = domain.abi;
var privateKey   = new Buffer.from(fromAddrKey, 'hex');
// var functionHash = web3.utils.sha3("transfer(address, uint256)").substr(0,10);
var gasPrice     = web3.utils.toHex(1000000000);
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
	console.log("-----------------------------------------------------");
	console.log("toAddress: " + _address);
	console.log("toAmount: " + _amount);
	if(_serialId && _user && _address && _amount && _creationTime){
		if(!web3.utils.isAddress(_address)){
			flag = false;
			console.log('The receiver address is invalid');
			return "invalid address";
		}
		if(isNaN(_amount)){
			flag = false;
			console.log('The transfer value is invalud');
			return "invalid amount";
		}
		if(flag){
			return "true";
		}

	}else{
		return "require user/address/amount/creationTime";
	}
}

function transfer (_body) {
	console.log('Start function transfer');
	var toAddress = _body.address;
	var toAmount = _body.amount + "000000000000";

	var data = contract.methods.transfer(toAddress, toAmount).encodeABI();
	console.log("data: " + data);

	web3.eth.getTransactionCount(fromAddr, function(err, nonce){
		if(err){
			console.log("get transaction count: " + err);
	    	redisUtils.set_new_to_finish(_body.serialId, _body.address);
	    	redisUtils.delete_new_transaction(_body.serialId, _body.address);
		}else{
			console.log('nonce: ' + nonce);
			web3.eth.estimateGas({
					from : fromAddr,
					to   : toAddress,
					nonce: nonce,
					data : data
				}).then((estimateGas) => {
					console.log("estimateGas: " + estimateGas * 2);

					var rawTx = {
						"from"		: fromAddr,    	//from是当前使用的钱包账户地址
						"nonce"		: nonce, 
						"gasPrice"	: gasPrice, 		//4 gwei
						"gasLimit"	: estimateGas * 2,
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
						        setProgress(_body.serialId, _body.address, hash);
								console.log("Send transaction success");
						    } 
						    else {
						    	console.log("serialId: " + _body.serialId);
						 		errorDealer.errorSendSignedTransaction(err);
						    }
						});
				})
		}
	});
}

function setProgress(_serialId, _address, _hash){
	//此处有雷，为什么都要执行两次？？？
	redisUtils.set_progress_transaction(_serialId, _address, _hash);
    redisUtils.get_progress_transaction(_serialId, _address, function(err, value){
    	if(err){
    		console.log('get_progress_transaction error: ' + err);
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
}
