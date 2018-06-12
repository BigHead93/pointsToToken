var log4js = require('log4js');
log4js.configure('./lib/log4js.json');
var logger = require('log4js').getLogger('index');

const Errors = {
	NONCE_TOO_LOW : "nonce too low",
	KNOWN_TRANSACTION : "known transaction",
	UNDERPRICED : "replacement transaction underpriced",
	INSUFFICIENT_FUNDS : "insufficient funds for gas * price + value",
	INVALID_JSON_RPC : "Invalid JSON RPC response",
	FAIL_TO_CHECK_RECEIPT : "Failed to check for transaction receipt",  //已发出
	TRANSACTION_NOT_MINED : "UnhandledPromiseRejectionWarning: Error: Transaction was not mined within750 seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!", //已发出

	getErrorMsg(index){
		if(index == 0)
			return NONCE_TOO_LOW;
		if(index == 1)
			return KNOWN_TRANSACTION;
		if(index == 2)
			return UNDERPRICED;
		if(index == 4)
			return INSUFFICIENT_FUNDS;
		if(index == 5)
			return INVALID_JSON_RPC;
	}
}



var ErrorDealer = {

	errorSendSignedTransaction: function(err) {
		console.log("sendSignedTransaction Error: " + err);

		
	},

	getErrorType: function(errInfo) {
		var result = -1;
		result = errInfo.indexOf(Errors.NONCE_TOO_LOW) >= 0 ? 0 : -1;

		result = errInfo.indexOf(Errors.KNOWN_TRANSACTION) >= 0 ? 1 : -1;
		
		result = errInfo.indexOf(Errors.UNDERPRICED) >= 0 ? 2 : -1;
		
		result = errInfo.indexOf(Errors.INSUFFICIENT_FUNDS) >= 0 ? 3 : -1;
		
		result = errInfo.indexOf(Errors.INVALID_JSON_RPC) >= 0 ? 4 : -1;
		
		if(result != -1){
			logger.info("Find ")
			
		}
	}

}

module.exports = ErrorDealer;