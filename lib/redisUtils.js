'use strict';

var redis = require('redis');
var kvUtils = require('./kvUtils');
var client = redis.createClient();
var log4js = require('log4js');
log4js.configure('./lib/log4js.json');
var logger = require('log4js').getLogger('redisUtils');

function setNew(serialId, user, address, amount, creationTime){
	var key = kvUtils.get_new_key(serialId, address);
	var value = kvUtils.get_new_value( serialId,
										user, 
										address, 
										amount, 
										creationTime);
	client.set(key, value);
	logger.info("set_new_transaction: " + serialId);
}

function getNew(serialId, address, callback){
	var key = kvUtils.get_new_key(serialId, address);
	client.get(key, function(err, value){
		if(err){
			console.log(err);
		}
		// console.log("Get new value: " + value);
		callback(err, value);
	});
}

function delNew(serialId, address) {
	getNew(serialId, address, (object) => {
		var key = kvUtils.get_new_key(serialId, address);
		client.del(key);
		logger.info("delete_new_transaction: " + serialId);
	});
}

function setProgress(serialId, address, TxHash) {
	getNew(serialId, address, (err, value) => {
		console.log('Set progress value: ' + value);
		var object = JSON.parse(value);
		var key = kvUtils.get_progress_key(serialId, address);
		var value = kvUtils.get_progress_value(	object.serialId,
												object.user, 
												object.address, 
												object.amount, 
												object.creationTime, 
												TxHash);
		client.set(key, value);
		logger.info("set_progress_transaction: " + serialId + " - TxHash: " + TxHash);
	});
}

function getProgress(serialId, address, callback) {
	var key = kvUtils.get_progress_key(serialId, address);
	client.get(key, function(err, value){
		if(err){
			console.log(err);
			logger.error("Error in get_progress_transaction: " + err);
		}
		// console.log('Get progress value: ' + value);
		callback(err, value);
	});
}

function delProgress(serialId, address) {
	getProgress(serialId, address, (err, value) => {
		// console.log('Delete progress value: ' + value);
		var key = kvUtils.get_progress_key(serialId, address);
		client.del(key);
		logger.info("delete_progress_transaction: " + serialId);
	});
}

function setFinish(serialId, address, status) {
	getProgress(serialId, address, (err, value) => {
		// console.log('Set finish value: ' + value);
		var object = JSON.parse(value);

		var key = kvUtils.get_finish_key(serialId, address);
		var value = kvUtils.get_finish_value(	object.serialId,
												object.user,
												object.address,
												object.amount,
												object.creationTime,
												object.TxHash,
												status);
		client.set(key, value);
		logger.info("set_finish_transaction: " + serialId + " - TxHash: " + object.TxHash + " - status: " + status);		
	});
}

function getFinish(serialId, address, callback) {
	var key = kvUtils.get_finish_key(serialId, address);
	client.get(key, function(err, value){
		// console.log("Get finish value: " + value);
		if(err){
			console.log(err);
			logger.error("Error in get_finish_transaction: " + err);
		}
		// console.log("Get finish value: " + value);
		callback(err, value);
	});
}

function delFinish(serialId, address) {
	getFinish(serialId, address, (err, value) => {
		var key = get_finish_key(serialId, address);
		client.del(key);
		logger.info("delete_finish_transaction: " + serialId + " - TxHash: " + TxHash + " - status: " + status);		
	});
}

function setNewToFinish(serialId, address){
	getNew(serialId, address, (err, value) => {
		// console.log('Set new to finish' + value);
		var object = JSON.parse(value);
		var key = kvUtils.get_finish_key(serialId, address);
		var value = kvUtils.get_finish_value(	object.serialId,
												object.user,
												object.address,
												object.amount,
												object.creationTime,
												null,
												'Failed');
		client.set(key, value);
		logger.info("set_new_to_finish: " + serialId + " - status: Failed");
	})
}

function setNonce(nonce){
	client.set("nonce", nonce);
	logger.info("set_nonce: " + nonce);
}

function getNonce(callback){
	client.get("nonce", function(err, value){
		if(err){
			console.log(err);
			logger.error("Error in get_nonce: " + err);
		}
		callback(err, value);
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

	set_new_to_finish: setNewToFinish,

	set_nonce: setNonce,
	get_nonce: getNonce
}


