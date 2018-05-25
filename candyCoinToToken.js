let fs =require("fs");
var Tx = require('ethereumjs-tx');
var Web3 = require("web3");

//if(typeof web3 !== 'undefined'){
//	var web3 = new Web3(web3.currentProvider);
//}else {
	var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/SHxTpLWAN5i6oolxZVjC"));
//}

let walletbase = "0x34c95D243C47aC6a77E897188F019ff1AcfDABca";  //钱包账户地址
let contractAddr = "0x023C410739546ea1feBF070575Fcc9FcbB3f28fF";    //contract address
var privateKey = new Buffer.from("37dfa140db0900966a457443ca38fa695e45a845897a4f855e36ad2dcbd37c42", 'hex');
var functionHash = web3.utils.sha3("transfer(address,uint256)").substr(0,10);

let toAddress = process.argv.slice(2)[0];
let toAmount = process.argv.slice(2)[1];

let abi = JSON.parse(fs.readFileSync("./BTA.abi").toString("utf8"));
let contractInstance = new web3.eth.Contract(abi, contractAddr);

try{
	var flag = true;
	if(toAddress && toAmount){
		console.log("--------------------------------------------------------------------------");
		console.log("toAddress: " + toAddress);
		console.log("toAmount: " + toAmount);
		if(!web3.utils.isAddress(toAddress)){
			flag = false;
			console.log('The receiver address is invalid');
		}
		if(isNaN(toAmount)){
			flag = false;
			console.log('The transfer value is invalud');
		}
		if(flag){
			toAmount *= 1000000000000000000;
			transfer();
		}
	}else{
		console.log("Please run the scripts by providing:");
		console.log(" 1. the address of the receiver");
		console.log(" 2. the amount of token");
	}
}catch(err){
	console.error(err);
}

function transfer() {
	web3.eth.getTransactionCount(walletbase).then((value) => {

		var data =  functionHash
					+ "000000000000000000000000" 
					+ toAddress.substr(2,40) 
					+ "00000000000000000000000000000000" 
					+ toHex32(toAmount);

		var rawTx = {
			"from"		: walletbase,    	//from是当前使用的钱包账户地址
			"nonce"		: value, 
			"gasPrice"	: "0x098bca5a00",
			"gasLimit"	: "0x0493e0",
			"to"		: contractAddr,     //to是合约地址
			"value"		: "0x00",
			"data"		: data,
			"chainId"	: 3
		}

		var tx = new Tx(rawTx);
		tx.sign(privateKey);
		var serializedTx = tx.serialize();
		// console.log(serializedTx.toString('hex'));

		web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'),
			function(err, hash) {
			    if (!err) {
			        console.log("TxHash: " + hash);
					console.log("success");
			    } else {
			        console.log(err);
			    }
			});
	});
}
function toHex32(value){
	let zeros = "00000000000000000000000000000000";
	let valueHex = value.toString(16);
	let len0 = 32 - valueHex.length;
	return zeros.substr(0, len0) + valueHex;
}


