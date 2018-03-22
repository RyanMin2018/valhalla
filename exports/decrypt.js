module.exports = function(pw) {
	try {
		var crypto = require('crypto');
		var decipher = crypto.createDecipher('aes192', global.strCryptoKey);
		return decipher.update(pw, 'base64', 'utf8') + decipher.final('utf8'); 
	} catch (e) {
		console.log(pw, e);
		return pw;
	}
};