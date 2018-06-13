'use strict'

/**
   * CipherOption, 加密的一些选项:
   *   mode: 加密模式, 可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB), 都在 CryptoJS.mode 对象下
   *   padding: 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding), 都在 CryptoJS.pad 对象下
   *   iv: 偏移量, mode === ECB 时, 不需要 iv
   * 返回的是一个加密对象
   */

module.exports = AESEncrypt

var CryptoJS = require("crypto-js")
var crypto = require("crypto")

function AESEncrypt(){

	this.toHexString = function(buffer) {
		var DIGITS_LOWER = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')
		var hexBuffer = new Buffer.alloc(32)
		var retStr = ""
		for(var i=0,j=0;i<buffer.length;i++){
			hexBuffer[j++] = (0xF0 & buffer[i]) >> 4 
			hexBuffer[j++] = (0x0F & buffer[i]) 
		}
		for(var i=0;i<hexBuffer.length;i++){
			retStr += DIGITS_LOWER[hexBuffer.readInt8(i)]
		}	
		// return Buffer.from(retStr)
		return retStr
	}

	this.encrypt = function(key,text){

		const hash = crypto.createHash('MD5');
		hash.update(this.getKeySignature(key));
		const keyBytes = hash.digest();
		var genKeys = this.toHexString(keyBytes);
		const aesKey = CryptoJS.enc.Utf8.parse(Buffer.from(genKeys.slice(0,16)));  
		const aesIv = CryptoJS.enc.Utf8.parse(Buffer.from(genKeys.slice(16,32)));	

	    var cipher = CryptoJS.AES.encrypt(text, aesKey, {
		    mode: CryptoJS.mode.CFB,
		    padding: CryptoJS.pad.NoPadding,
		    iv: aesIv,
		  });
	    const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
	    return base64Cipher;
	}

	this.decrypt = function(key,text){

		const hash = crypto.createHash('MD5');  
		hash.update(this.getKeySignature(key));  
		const keyBytes = hash.digest();  
		var genKeys = this.toHexString(keyBytes);  

		const aesKey = CryptoJS.enc.Utf8.parse(Buffer.from(genKeys.slice(0,16)));
		const aesIv = CryptoJS.enc.Utf8.parse(Buffer.from(genKeys.slice(16,32)));		

	    var decipher = CryptoJS.AES.decrypt(text,aesKey,{
	        iv:aesIv,
	        mode:CryptoJS.mode.CFB,
	        padding:CryptoJS.pad.NoPadding
	    })
		const resultDecipher = CryptoJS.enc.Utf8.stringify(decipher);
	  	return resultDecipher;    
	}

	this.getKeySignature = function(key){
		var signature = 'data-candy';
		return key+signature;
	}
}



