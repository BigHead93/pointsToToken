'use strict';

function getNewKey(serialId, address){
	var newKey = {
		serialId : serialId,
		address	 : address
	}
	return "New_" + newKey.address + "_" + newKey.serialId;
}

function getNewValue(serialId, user, address, amount, creationTime) {
	var value = {
		serialId    : serialId,
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime
	}
	return JSON.stringify(value);
}

function getProgressKey(serialId, address){
	var progressKey = {
		serialId : serialId,
		address	 : address
	}
	return "Txn_" + progressKey.address + "_" + progressKey.serialId;
}

function getProgressValue(serialId, user, address, amount, creationTime, TxHash){
	var value = {
		serialId	: serialId,
		user		: user,
		address 	: address,
		amount		: amount,
		creationTime: creationTime,
		TxHash 		: TxHash,
		status		: 'In progress'
	}
	return JSON.stringify(value);
}

function getFinishKey(serialId, address){
	var finishKey = {
		serialId : serialId,
		address  : address
	}
	return "Fin_" + finishKey.address + "_" + finishKey.serialId;
}

function getFinishValue(serialId, user, address, amount, creationTime, TxHash, status){
	var value = {
		serialId    : serialId,
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