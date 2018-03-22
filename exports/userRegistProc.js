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
	
	var User = require('../models/Users');
	var p = new User();
	p.USER_ID = global.comjs.trim(req.body.user_id);
	p.USER_PW = require('../exports/encrypt')(global.comjs.trim(req.body.user_pw)); // encrypt password
	p.USER_NM = global.comjs.trim(req.body.user_nm);
	p.CONFIRM_YN = 'N';
	
	if (p.USER_ID.length<1 || p.USER_NM.length<1) {
		res.redirect('/account/');
		return;
	}
	
	/* check duplication */
	User.find({$and:[{'USER_ID':p.USER_ID}]}, function(err, data) {
		if (err) {
			console.log('/exports/userRegistProc.js', err);
			throw err; 
		}
		if (!data || data.length===0) {
			p.save(function(err){
				if (err) {
					console.error('/exports/userRegistProc.js', err);
					cb(false, 1); // save error
				} else { cb(true, 0); } // success
			});
		} else { cb(false, 2); } // duplication error
	});

};