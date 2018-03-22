/* router : item management */
module.exports = function(app) {

	var loc = require('./location.js'); // load major location information
	
	/* main page */
	app.get('/', function(req, res) {
		res.render('hello', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm,useragent:req.headers['user-agent']});
	});
	
	app.get('/vue', function(req, res){
		res.render('vue', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm});
	});

	app.get('/sheet', function(req, res){
		res.render('sheet', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm});
	});

	app.get('/sheet2', function(req, res){
		res.render('sheet2', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm});
	});
	
	app.get('/test', function(req, res){
		var request = require("request");

		var options = { method: 'POST',
			url: 'https://m.cardsales.or.kr/authentication',
			headers: {
				'cache-control': 'no-cache',
				'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' 
			},
			formData: { j_username: 'g1891200567', j_password: 'gl00567!' } 
		};
		res.setHeader('content-type', 'text/javascript');
		request(options, function (err, response, body) {
			if (err) {
				console.log(err);
				throw err;
			}
			res.write(body);
			res.end();
		});
	});
	
}; // end of index.js
