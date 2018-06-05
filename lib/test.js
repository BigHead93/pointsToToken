let fs =require("fs");
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");

//if(typeof web3 !== 'undefined'){
//	var web3 = new Web3(web3.currentProvider);
//}else {
	var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/SHxTpLWAN5i6oolxZVjC"));
//}

// var address = "0x859d502b61837ec8d50d584292e2ba25a0a1802c"
// console.log(web3.utils.isAddress(address))
// var TxHash = "0xa7e10865d700d2ea94546f950a18ce0b38f742d7f13d2918d89cfde2b5abd77e";
// web3.eth.getTransactionReceipt(TxHash, function(err, result){
// 	if(!err){
// 		console.log(result);
// 	}else{
// 		console.error(err);
// 	}
// });

// })
// let walletbase = "0x34c95D243C47aC6a77E897188F019ff1AcfDABca";  //钱包账户地址

// web3.eth.getTransactionCount(walletbase).then(console.log);

// web3.eth.estimateGas({
// 	from: "0x34c95D243C47aC6a77E897188F019ff1AcfDABca",
// 	to: "0xb5119151d96eFdD847A7CDD5945d9E76Ee57EA0D",
// 	nonce: 5545,
// 	data: "0xa9059cbb000000000000000000000000b5119151d96eFdD847A7CDD5945d9E76Ee57EA0D0000000000000000000000000000000000000000000000000000000000010000"
// }).then(console.log);

web3.eth.getTransactionCount("0x34c95D243C47aC6a77E897188F019ff1AcfDABca").then(console.log);