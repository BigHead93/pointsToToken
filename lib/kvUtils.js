'use strict';

function getNewKey(address, creationTime){
	var newKey = {
		address      : address,
		creationTime : creationTime
	}
	return "New_" + newKey.address + "_" + newKey.creationTime;
}

function getNewValue(user, address, amount, creationTime) {
	var value = {
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime
	}
	return JSON.stringify(value);
}

function getProgressKey(address, creationTime){
	var progressKey = {
		address      : address,
		creationTime : creationTime
	}
	return "Txn_" + progressKey.address + "_" + progressKey.creationTime;
}

function getProgressValue(user, address, amount, creationTime, TxHash){
	var value = {
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime,
		TxHash 		: TxHash,
		status		: 'In progress'
	}
	return JSON.stringify(value);
}

function getFinishKey(address, creationTime){
	var finishKey = {
		address      : address,
		creationTime : creationTime
	}
	return "Fin_" + finishKey.address + "_" + finishKey.creationTime;
}

function getFinishValue(user, address, amount, creationTime, TxHash, status){
	var value = {
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime,
		TxHash 		: TxHash,
		status		: status
	}
	return JSON.stringify(value);
}

module.exports ={
	get_new_key : getNewKey,
	get_new_value: getNewValue,
	get_progress_key: getProgressKey,
	get_progress_value: getProgressValue,
	get_finish_key: getFinishKey,
	get_finish_value: getFinishValue

};