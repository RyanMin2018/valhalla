module.exports = function(req, res, cb) {
	
	// block access from external domains
	try {
		if (req.get('referrer').indexOf(req.get('host'))<0) {
			res.redirect('/login/d');
			return;
		}
	} catch (e) {
		res.redirect('/login/d');
		return;		
	}
	
	var strLoginId = global.comjs.trim(req.body.user_id);
	var strLoginPw = 	require('../exports/encrypt')(req.body.user_pw); // encrypt password
	var strName = '';
	var user = require('../models/Users');
	var isLogin = false;
	
	if (strLoginId.length<1) {
		res.redirect('/login/');
		return;
	}
	
	user.find({$and:[{'USER_ID':strLoginId, 'USER_PW':strLoginPw,'CONFIRM_YN':'Y'}]}, function(err, data) {
		if (err) { 
			res.render('500', {page:req.url}); 
			console.log(req.url, err);
			return; 
		}
		if (!data || data.length===0) {
			cb(false, '');
			return;
		}
		cb(true, data[0].USER_NM);
	});
};