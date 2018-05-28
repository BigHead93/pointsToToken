var redis = require('redis'),
	client = redis.createClient();
// // //var client = redis.createClient(端口号-port, id);
// // // client.auth(密码);
// // // client.select(选择第几个数据库，回调函数)；

// client.on('error', function(err){
// 	console.log('error: ' + err);
// })

// client.set("string key", "string val", redis.print);
// client.get("string keys", redis.print);

client.KEYS('Txn*', function)
// // var redisUtils = require('./lib/redisUtils');

// // console.log(util.get_new_key('key', 'value'));



// var redisUtils = require('./lib/redisUtils');
// var address = '0xb5119151d96eFdD847A7CDD5945d9E76Ee57D';
// var creationTime = '1527216125000';
// var amount = 2;
// var user = 'emma';

// // redisUtils.set_new_transaction(user, address, amount, creationTime);
// console.log(redisUtils.get_new_transaction(address, creationTime, function(value){
// 	console.log(value);
// }));