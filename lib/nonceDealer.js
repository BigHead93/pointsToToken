var redisUtils = require('./redisUtils');
var nonceFilePath = "./nonce";
var domain = require('./domain');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(domain.HttpProvider));
var depth = 0;
var fromAddr = domain.fromAddr;

var nonceDealer = {
	
	getTxCount: function(callback){
	// function getTxCount(callback){
		web3.eth.getTransactionCount(fromAddr, function(err, value){
			if(err || value == 0){
				getTxCount(function(value){
					callback(value);
				})
			}else{
				callback(value);
			}
		})
	},

	getNonce: function(callback){
	// function getNonce(callback){
		getTxCount(function(txNonce){
			redisUtils.get_nonce(function(err, redisNonce){
				var nonce = 0;
				if(!err){
					if(txNonce > redisNonce || redisNonce == null){
						redisUtils.set_nonce(txNonce);
						nonce = txNonce;
					}else{
						nonce = redisNonce;
					}
				}
				callback(err, nonce);
			})
		})
	}
}


module.exports = nonceDealer;