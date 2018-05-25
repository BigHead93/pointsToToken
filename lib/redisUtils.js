'use strict';

var redis = require('redis');
var kvUtils = require('./kvUtils');
var client = redis.createClient();

function setNew(user, address, amount, creationTime){
	var key = kvUtils.get_new_key(address, creationTime);
	var value = kvUtils.get_new_value(user, 
										address, 
										amount, 
										creationTime);
	client.set(key, value);
}

function getNew(address, creationTime){
	var key = kvUtils.get_new_key(address, creationTime);
	var value = client.get(key);
	var object;
	if(value !== null){
		object = JSON.parse(value);
	}
	return object;
}

function setProgress(address, creationTime, TxHash){
	// var newKey = kvUtils.get_new_key(address, creationTime);
	var newObject = getNew(address, creationTime);

	var key = kvUtils.get_progress_key(address, creationTime);
	var value = kvUtils.get_progress_value(newObject.user, 
											newObject.address, 
											newObject.amount, 
											newObject.creationTime, 
											TxHash);
	client.set(key, value);
}

function getProgress(address, creationTime){
	var key = kvUtils.get_progress_key(address, creationTime);
	var value = client.get(key);
	var object = null;
	if(value !== null){
		object = JSON.parse(value);
	}
	return object;
}

function setFinish(address, creationTime, status){
	var progressObject = getProgress(address, creationTime);

	var key = kvUtils.get_finish_key(address, creationTime);
	var value = kvUtils.get_finish_value(progressObject.user,
											progressObject.address,
											progressObject.amount,
											progressObject.creationTime,
											progressObject.TxHash,
											status);
	client.set(key, value);
}

function getFinish(address, creationTime) {
	var key = kvUtils.get_finish_key(address, creationTime);
	var value = client.get(key);
	var object = null;
	if(value !== null){
		object = JSON.parse(value);
	}
	return object;
}


