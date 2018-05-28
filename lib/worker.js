var cluster = require('cluster');
var query = require('./query')
// console.log(`[worker ${cluster.worker.id}] start ...`);

process.on('message', function(msg) {
	// console.log(`[worker ${cluster.worker.id}] start to work`);
	// console.log("msg is : %s", msg);
	//for redis keys get txhash
	console.log('worker start');
	query.queryRedisTx();
});