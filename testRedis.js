var redis = require('redis'),
	client = redis.createClient();
// //var client = redis.createClient(端口号-port, id);
// // client.auth(密码);
// // client.select(选择第几个数据库，回调函数)；

client.on('error', function(err){
	console.log('error: ' + err);
})

client.set("string key", "string val", redis.print);
client.get("string keys", redis.print);


// var redisUtils = require('./lib/redisUtils');

// console.log(util.get_new_key('key', 'value'));



