/* router : login and registration */
module.exports = function(app) {

	var loc = require('./location.js');
	var Users = require('../models/Users');
	
	/* load login page */
	app.get(loc.strRouterLogin, function(req, res){
		res.render('account/accountLogon');
	});
	
	/* load login page with error message or redirection page url, registration */
	app.get(loc.strRouterLogin+'/:c', function(req, res){
		var url = 'account/accountLogon';
		if (req.params.c==='e') { res.render(url, {e:'Oops! 로그인하지 못했습니다. 기억을 짜내어 시도해보세요.'}); } // login failed error
		else if (req.params.c==='d') { res.render(url, {e:'잘못된 접속입니다.'}); } // wrong connection error
		else if (req.params.c==='x') { res.render(url, {e:'인증이 필요합니다. 보내드린 인증메일로 인증받으세요.'}); } // authentication failed error
		else if (req.params.c==='f') { res.render(url, {e:'등록된 이메일이 아닙니다. 잘못 쓰셨거나, 가입하지 않으셨을 겁니다.'}); } // unregistered email error
		else { res.render(url, {i:'로그인이 필요한 페이지로 접속하셨습니다. 로그인하세요.', r:req.params.c}); } // required login information
	});	
	
	/* login action */
	app.post(loc.strRouterLogin,  function(req, res) {
		require('../exports/loginProc')(req, res, function(isLogin, nm){
			if (isLogin) { // is login, then set cookie and redirect to return page or product list page
				res.cookie('log_id', req.body.user_id, {maxAge: 1000*60*60*24, httpOnly:true, signed:true});
				res.cookie('log_nm', nm,{maxAge: 1000*60*60*24, httpOnly:true, signed:true});
				// redirection 
				if (req.body.r.length>1) { res.redirect(req.body.r); }
				else { res.redirect('/'); }
			} else {
				res.redirect(loc.strRouterLogin + '/e'); // go to login page with login failed error
			}
		});
	});

	/* logout action */
	app.get('/logout', function(req, res){
		res.clearCookie('log_id'); 
		res.clearCookie('log_nm');
		res.redirect('/');
	});

	/* load join page */
	app.get(loc.strRouterAccount, function(req, res) {
		res.render('account/accountReg');
	});
	
	/* registration action */
	app.post(loc.strRouterAccount, function(req, res) {
		require('../exports/userRegistProc')(req, res, function(isOkay, intCode) {
			if (isOkay) {
				// send authentication mail 
				require('../exports/sendAuthMail')(req.body.user_id, req.body.user_nm, req, function(isSent) {
					if (isSent) { res.render('account/accountWelcome', {wuserid:req.body.user_id, wusernm:req.body.user_nm}); } // is sent, then go to welcome page
					else { res.render('500', {page:'Failed to send verification request.'}); } // failed, then go to 500 error page
				});
			} else {
				res.redirect(loc.strRouterAccount + '/'+intCode); // registration failed, then go to join page with error code
			}
		});
	});
	

	app.get(loc.strRouterAccount+'/check/:e', function(req, res) {
		Users.findOne({'USER_ID':req.params.e}, function(err, data) {
			if (err) {
				console.log('/exports/userRegistProc.js', err);
				throw err; 
			}
			res.setHeader('content-type', 'text/javascript');	
			var out = '';
			if (!data || data.length===0) {
				out = '1';
			} else {
				out = '0';
			}
			res.write(out);
		    res.end();
		});
	});
	
	
	
	/* load registration page with error message. */
	app.get(loc.strRouterAccount + '/:e', function(req, res){
		if (req.params.e === 'edit') { // is edit parameter, then go to edit page
			if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) {
				res.render('account/accountMod', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm});
			}
		} else { // is other parameter? go to registration page with error code
			var strErrorMsg = '';
			if (req.params.e === '1') { strErrorMsg = 'Sorry, Database Error!'; }
			else { strErrorMsg = '이미 등록된 이메일주소입니다. 로그인하시거나 다른 이메일계정을 사용하세요.'; }
			res.render('account/accountReg', {e:strErrorMsg});
		}
	});

	/* authentication edit or withdrawal */
	app.get(loc.strRouterAccount + '/edit/:e', function(req, res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) {
			if (req.params.e==='optout') { // withdrawal
				// chage confirm_yn column to 'X', and add DROP_DT
				Users.updateOne({USER_ID:req.signedCookies.log_id},{$set:{CONFIRM_YN:'X', DROP_DT:new Date()}}, function(err, data){
					if (err || !data || data.nModified === 0) { // not updated? 
						res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
						console.log(req.url, err);
						return; 				
					}
					if (data.nModified>0) { // updated? clear cookie and go to good-bye page
						var nm = req.signedCookies.log_nm;
						console.log(nm, 'is opt out');
						res.clearCookie('log_id');
						res.clearCookie('log_nm');
						res.render('account/accountGoodbye', {wusernm:nm});
						return;
					}
					res.redirect('/');
				});
			} else { // not match password error
				res.render('account/accountMod', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm, e:'현재 사용하고 계신 비밀번호가 필요합니다.'});
			}
		}			
	});
	
	/* authentication edit proc */
	app.post(loc.strRouterAccount + '/edit/', function(req, res){
		var oldPw = require('../exports/encrypt')(req.body.old_pw); // encrypt old password
		var newPw = require('../exports/encrypt')(req.body.user_pw); // encrypt new password
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) {
			// update
			Users.updateOne({USER_ID:req.signedCookies.log_id, USER_PW:oldPw}, {$set:{USER_NM:req.body.user_nm, USER_PW:newPw}}, function(err, data) {
				console.log(data);
				if (err || !data || data.nModified === 0) { // not update?
					res.redirect(loc.strRouterAccount + '/edit/e');
					console.log(req.url, err);
					return; 				
				}
				if (data.nModified>0) { // update? clear cookie and go to login page
					var email = req.signedCookies.log_id;
					res.clearCookie('log_id');
					res.clearCookie('log_nm');
					res.render('account/accountLogon', {wuserid:email, i:'계정정보가 수정되었습니다. 번거롭겠지만, 다시 한번 로그인을 요청드립니다!'}); 
				} else { res.redirect('/'); }
			});
		}		
	});
	
	/* authentication from email */
	app.get(loc.strRouterAccount + '/auth/:k', function(req, res) {
		var email = require('../exports/decrypt')(require('querystring').unescape(req.params.k));
		Users.updateOne({USER_ID:email}, {$set:{CONFIRM_YN:'Y'}}, function(err, data) {
			if (err || !data || data.nModified === 0) {
				res.redirect(loc.strRouterLogin + '/x');
				console.log(req.url, err);
				return; 				
			}
			if (data.nModified>0) { res.render('account/accountLogon', {i:'Wow! 이제 진짜 사용할 준비가 완료되었습니다. 바로 로그인하십시오.',userid:email}); }
			else { res.redirect('/'); }
		});
	});
	
	/* forgot password */
	app.get(loc.strRouterAccount + '/forgot/:email', function(req, res) {
		var rand = 'n' + (Math.floor(Math.random() * (999999 - 111111)) + 111111); // make random
		var enc = require('../exports/encrypt')(rand); // encrypt random
		// update password column to encrypt random
		Users.updateOne({USER_ID:req.params.email, CONFIRM_YN:'Y'}, {$set:{USER_PW:enc}}, function(err, data) {
			if (err || !data || data.nModified===0) { // not update?
				res.redirect(loc.strRouterLogin + '/f');
				console.log(req.url, err);
				return; 
			}
			if (data.nModified>0) { // updated?
				require('../exports/sendForgotPasswordMail')(req.params.email, rand, req, function(isSent) {
					if (isSent) { 
						res.render('account/accountLogon', {i:'새로운 비밀번호를 등록된 이메일주소로 보내드렸습니다. 저희가 임의로 발급한 새로운 비밀번호로 로그인하십시오.', userid:req.params.email});
					} else { res.render('500', {page:'시스템이 말썽이군요. 메일을 보내지 못했습니다. 잠시 기다리시거나, 다음기회에 ^^'}); }
				});
			} else { res.render('account/accountLogon', {e:'등록된 이메일주소가 아니군요. 메일주소를 다시 확인하여 주십시오.', userid:req.params.email}); } // unregistered email address error
		});
	});
	
	/* captcha */
	app.all(loc.strRouterAccount + '/captcha/image', function(req, res){
		  var captcha = require('simple-captcha').create({width: 100, height: 40});
		  console.log(captcha.text());
		  captcha.generate();
		  res.write(captcha.buffer('image/png'));
		  res.end();
	});
	
}; // end of membership.js
