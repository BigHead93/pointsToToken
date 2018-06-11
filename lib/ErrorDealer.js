var log4js = require('log4js');
log4js.configure('./lib/log4js.json');
var logger = require('log4js').getLogger('index');

const NONCE_TOO_LOW = "nonce too low";
const KNOWN_TRANSACTION = "known transaction";
const UNDERPRICED = "replacement transaction underpriced";
const INSUFFICIENT_FUNDS = "insufficient funds for gas * price + value";
const INVALID_JSON_RPC = "Invalid JSON RPC response";
const FAIL_TO_CHECK_RECEIPT = "Failed to check for transaction receipt";  //已发出
const TRANSACTION_NOT_MINED = "UnhandledPromiseRejectionWarning: Error: Transaction was not mined within750 seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!";


var ErrorDealer = {

	errorSendSignedTransaction: function(err) {
		console.log("sendSignedTransaction Error: " + err);

		
	}

}

module.exports = ErrorDealer;