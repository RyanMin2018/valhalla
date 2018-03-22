module.exports = function(pw) {
	try {
		var crypto = require('crypto');
		var cipher = crypto.createCipher('aes192', global.strCryptoKey);
		return cipher.update(pw, 'utf8', 'base64') + cipher.final('base64');
	} catch (e) {
		console.log(pw, e);
		return pw;
	}
};