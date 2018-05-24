var http = require('http');
var url = require('url');
var domain = require('domain');
var coinToToken = require('./candyCoinToToken05');

// function fetch(callback){


http.createServer(function(request, response){
	response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
	try{
		var pathname = url.parse(request.url).pathname.substr(1);
		if(pathname !== 'favicon.ico'){
			console.log('request for ' + pathname + ' received');
		}

		var params = url.parse(request.url, true).query;
		response.write('address: ' + params.address);
		response.write('\n');
		response.write('amount : ' + params.amount);
		response.write('\n');
		if(params.address && params.amount){
			coinToToken(params.address, params.amount);
		}
	}catch(err){
		console.error(err);
	}

	response.end();
}).listen(8888);

// }
console.log('server has started');
console.log('******************');

// fetch().then(result => {
// 	console.log('请求处理', result);
// }).catch(error => {
// 	console.log('请求处理异常', error);
// })




