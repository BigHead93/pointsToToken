'use strict';

function getNewKey(address, creationTime){
	var newKey = {
		address      : address,
		creationTime : creationTime
	}
	return "New_" + newKey.address + "_" + newKey.creationTime;
}

function getNewValue(user, address, amount, creationTime) {
	var newValue = {
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime
	}
	return '{'
			+ '\"user\":' 		 + newValue.user 		+ ','
			+ '\"address\":' 	 + newValue.address 	+ ','
			+ '\"amount\":' 	 + newValue.amount 		+ ','
			+ '\"creationTime\":'+ newValue.creationTime
			+ '}';
}

function getProgressKey(address, creationTime){
	var progressKey = {
		address      : address,
		creationTime : creationTime
	}
	return "Tx_" + progressKey.address + "_" + progressKey.creationTime;
}

function getProgressValue(user, address, amount, creationTime, TxHash){
	var progressValue = {
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime,
		TxHash 		: TxHash
	}
	return '{'
			+ '\"user\":'		 	+ progressValue.user 		+ ','
			+ '\"address\":' 		+ progressValue.address 	+ ','
			+ '\"amount\":' 		+ progressValue.amount 		+ ','
			+ '\"creationTime\":' 	+ progressValue.creationTime+ ','
			+ '\"TxHash\":' 		+ progressValue.TxHash
			+ '}';
}

function getFinishKey(address, creationTime){
	var finishKey = {
		address      : address,
		creationTime : creationTime
	}
	return "Fin_" + finishKey.address + "_" + finishKey.creationTime;
}

function getFinishValue(address, amount, creationTime, TxHash, status){
	var finishValue = {
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime,
		TxHash 		: TxHash,
		status		: status
	}
	return '{'
			+ '\"user\":' 			+ finishValue.user 			+ ','
			+ '\"address\":' 		+ finishValue.address 		+ ','
			+ '\"amount\":' 		+ finishValue.amount 		+ ','
			+ '\"creationTime\":' 	+ finishValue.creationTime 	+ ','
			+ '\"TxHash\":' 		+ finishValue.TxHash 		+ ','
			+ '\"status\":' 		+ finishValue.status
			+ '}';
}

module.exports ={
	get_new_key : getNewKey,
	get_new_value: getNewValue,
	get_progress_key: getProgressKey,
	get_progress_value: getProgressValue,
	get_finish_key: getFinishKey,
	get_finish_value: getFinishValue

};