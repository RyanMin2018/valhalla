module.exports = function(strRouterLogin, req, res) {
	if (!req.signedCookies.log_id || req.signedCookies.log_id.length<1) {
		var qs = require('querystring');
		res.redirect(strRouterLogin + '/' + qs.escape(req.url));
		return false;
	} 
	return true;
};