var Web3 = require('web3');
var redisUtils = require('./redisUtils');
var redis = require('redis');
var client = redis.createClient();
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/SHxTpLWAN5i6oolxZVjC"));


var query = {

	queryRedisTx: function(){
		console.log('queryRedisTx start')
		client.KEYS('Txn_*', function(err, replies){
			if(replies == ""){
				console.log("No transaction in progress");
				return;
			}
			console.log('replies: ' + replies);
			replies.forEach(function(reply){
				console.log('reply: ' + reply);
				var address = reply.substr(4, 42);
				var serialId = reply.substr(47);
				console.log('address: ' + address);
				console.log('serialId: ' + serialId);
				redisUtils.get_progress_transaction(serialId, address, (err, value) => {
					console.log("value: " + value);
					if(value !== null){
						var object = JSON.parse(value);
						var TxHash = object.TxHash;
						console.log('TxHash: ' + TxHash);
						web3.eth.getTransactionReceipt(TxHash, function(err, result){
							if(!err && result !== null){
								var status = result.status == true ? 'Completed': 'Failed';
								console.log('Find new status: %s %s %s', serialId, address, status);
								redisUtils.set_finish_transaction(serialId, address, status);
								redisUtils.delete_progress_transaction(serialId, address);
							}else{
								console.log('Reslt: ' + result + '\nErr: ' + err);
							}
						})
					}
					
				})
				
			})
		})
	},

	queryStatus: function(serialId, address, callback){
		console.log('querystatus: ' + serialId);
		redisUtils.get_finish_transaction(serialId, address, (err, value) => {
			// if(err){
			// 	callback(err);
			// }
			console.log('query finish status value: ' + value);
			if(value !== null){
				var object = JSON.parse(value);
				callback(object);
			}else{
				redisUtils.get_progress_transaction(serialId, address, (err, value) => {
					console.log('query progress status value: ' + value);
					if(value !== null){
						var object = JSON.parse(value);
						callback(object);
					}else{
						callback("new or not exist");
					}
				})
			}
		})
	}
};

module.exports = query;

















