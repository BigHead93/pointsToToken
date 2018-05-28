'use strict';

var redis = require('redis');
var kvUtils = require('./kvUtils');
var client = redis.createClient();

function setNew(user, address, amount, creationTime){
	var key = kvUtils.get_new_key(address, creationTime);
	var value = kvUtils.get_new_value(	user, 
										address, 
										amount, 
										creationTime);
	client.set(key, value);
}

function getNew(address, creationTime, callback){
	var key = kvUtils.get_new_key(address, creationTime);
	client.get(key, function(err, value){
		if(err){
			console.log(err);
		}else{
			callback(value);
		}
	});
}

function delNew(address, creationTime) {
	getNew(address, creationTime, (object) => {
		var key = kvUtils.get_new_key(address, creationTime);
		client.del(key);
	});
}

function setProgress(address, creationTime, TxHash) {
	getNew(address, creationTime, (value) => {
		var object = JSON.parse(value);
		var key = kvUtils.get_progress_key(address, creationTime);
		var value = kvUtils.get_progress_value(	object.user, 
												object.address, 
												object.amount, 
												object.creationTime, 
												TxHash);
		client.set(key, value);
	});
}

function getProgress(address, creationTime, callback) {
	var key = kvUtils.get_progress_key(address, creationTime);
	client.get(key, function(err, value){
		if(err){
			console.log(err);
		}else{
			callback(value);
		}
	});
}

function delProgress(address, creationTime) {
	getProgress(address, creationTime, (object) => {
		var key = kvUtils.get_progress_key(address, creationTime);
		client.del(key);
	});
}

function setFinish(address, creationTime, status) {
	getProgress(address, creationTime, (value) => {
		console.log('finish value: ' + value);
		var object = JSON.parse(value);

		var key = kvUtils.get_finish_key(address, creationTime);
		var value = kvUtils.get_finish_value(object.user,
												object.address,
												object.amount,
												object.creationTime,
												object.TxHash,
												status);
		client.set(key, value);
	});
}

function getFinish(address, creationTime, callback) {
	var key = kvUtils.get_finish_key(address, creationTime);
	client.get(key, function(err, value){
		console.log("get finish transaction: " + value);
		if(err){
			console.log(err);
		}else{
			callback(value);
		}
	});
}

function delFinish(address, creationTime) {
	getFinish(address, creationTime, (value) => {
		var key = get_finish_key(address, creationTime);
		client.del(key);
	});
}

function setNewToFinish(address, creationTime){
	getNew(address, creationTime, (value) => {
		console.log('set new to finish');
		var object = JSON.parse(value);
		var key = kvUtils.get_finish_key(address, creationTime);
		var value = kvUtils.get_finish_value(object.user,
												object.address,
												object.creationTime,
												null,
												'Failed');
		client.set(key, value);
	})
}

module.exports = {
	set_new_transaction : setNew,
	get_new_transaction : getNew,
	delete_new_transaction : delNew,

	set_progress_transaction : setProgress,
	get_progress_transaction : getProgress,
	delete_progress_transaction : delProgress,

	set_finish_transaction : setFinish,
	get_finish_transaction : getFinish,
	delete_finish_transaction : delFinish,

	set_new_to_finish: setNewToFinish
}


