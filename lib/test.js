let fs =require("fs");
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");

//if(typeof web3 !== 'undefined'){
//	var web3 = new Web3(web3.currentProvider);
//}else {
	var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/SHxTpLWAN5i6oolxZVjC"));
//}


var TxHash = "0xd90a6e0f7266ad53adfc570446a2846e2ea7c174f57d4eb4d92af89e8917d4dd";
web3.eth.getTransactionReceipt(TxHash, function(err, result){
	if(!err){
		console.log("result: " + result.status);
	}else{
		console.error(err);
	}

})