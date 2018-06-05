const NONCE_TOO_LOW = "nonce too low";
const KNOWN_TRANSACTION = "known transaction";
const UNDERPRICED = "replacement transaction underpriced";
const INSUFFICIENT_FUNDS = "insufficient funds for gas * price + value";


var ErrorDealer = {

	errorSendSignedTransaction: function(err) {
		console.log("sendSignedTransaction Error: " + err);
		
	}

}

module.exports = ErrorDealer;