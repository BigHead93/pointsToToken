var Web3 = require('web3');
var redisUtils = require('./redisUtils');
var redis = require('redis');
var client = redis.createClient();
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/SHxTpLWAN5i6oolxZVjC"));


var query = {

	queryRedisTx: function(){
		console.log('queryRedisTx start')
		client.KEYS('Txn_*', function(err, replies){
			console.log('replies' + replies);
			replies.forEach(function(reply){
				console.log('reply: ' + reply);
				var address = reply.substr(4, 42);
				var creationTime = reply.substr(47);
				console.log('address: ' + address);
				console.log('creationTime: ' + creationTime);
				redisUtils.get_progress_transaction(address, creationTime, (value) => {
					console.log("value: " + value);
					if(value !== null){
						var object = JSON.parse(value);
						var TxHash = object.TxHash;
						console.log('TxHash: ' + TxHash);
						web3.eth.getTransactionReceipt(TxHash, function(err, result){
							if(!err && result !== null){
								var status = result.status == true ? 'Completed': 'Failed';
								console.log('Find new status: %s %s %s', address, creationTime, status);
								redisUtils.set_finish_transaction(address, creationTime, status);
								redisUtils.delete_progress_transaction(address, creationTime);
							}else{
								console.log('Reslt: ' + result + '\n Err: ' + err);
							}
						})
					}
					
				})
				
			})
		})
	},

	queryStatus: function(address, creationTime, callback){
		console.log('querystatus: ' + address);
		redisUtils.get_finish_transaction(address, creationTime, (value) => {
			console.log('query finish status value: ' + value);
			if(value !== null){
				var object = JSON.parse(value);
				callback(object);
			}else{
				redisUtils.get_progress_transaction(address, creationTime, (value) => {
					console.log('query progress status value: ' + value);
					if(value !== null){
						var object = JSON.parse(value);
						callback(object);
					}else{
						callback("exist");
					}
				})
			}
		})
	}
};

module.exports = query;