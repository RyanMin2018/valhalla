module.exports = function(mailto, pw, req, cb) {

		var nodemailer = require("nodemailer");
		var transport = nodemailer.createTransport({
			host: global.strDomainName,
			port: 25
		});
		
		//var pw = require('querystring').escape(require('../exports/encrypt')(pw));
		var msg = "<!DOCTYPE html>";
		msg += "<html>";
		msg += "<head>";
		msg += "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
		msg += "<link rel='stylesheet' href='"+req.protocol + "://" + req.get('host')+"/css/style.css' type='text/css' media='all'>";
		msg += "<body>";
		msg += "<table id='mail'>";
		msg += "<tr><td width='100'><img src='"+req.protocol + "://" + req.get('host')+"/images/logo.png' border=0 width=80 height=80></td>";
		msg += "<td width='*'>새로운 비밀번호가 발급되었습니다.<br/>아래의 비밀번호로 로그인하시고, 계정관리에서 원하시는 비밀번호로 변경하세요.";
		msg += "	<br/>";
		msg += "	새로운 비밀번호 : <b>" + pw + "</b>";
		msg += "	<br/>";
		msg += "	<br/>";
		msg += " <a href='"+req.protocol + "://" + req.get('host')+"/login' class='btn'>로그인 바로가기</a>";
		msg += "	<br/>";
		msg += "	<br/>";
		msg += "	From <a href='"+req.protocol + "://" + req.get('host')+"'>솔로지</a>.";
		msg += "</td></tr></table>";
		msg += "</body>";
		msg += "</html>";
		
		var mailOptions = {
			from: global.strDomainUser + ' <' + global.strDomainEmail + '>',
			to: mailto,
			subject: '['+global.strDomainName+'] 요청하신 새로운 비밀번호가 발급되었습니다.',
			html: msg
		};
		
		transport.sendMail(mailOptions, function(error, info){
			if(error) { console.log(error);} 
			transport.close(); 
		});
		
		cb(true);
};