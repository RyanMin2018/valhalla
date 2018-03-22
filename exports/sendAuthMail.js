module.exports = function(mailto, nm, req, cb) {

		var nodemailer = require("nodemailer");
		var transport = nodemailer.createTransport({
			host: global.strDomainName,
			port: 25
		});
		
		var email = require('querystring').escape(require('../exports/encrypt')(mailto));
		var msg = "<!DOCTYPE html>";
		msg += "<html>";
		msg += "<head>";
		msg += "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
		msg += "<link rel='stylesheet' href='"+req.protocol + "://" + req.get('host')+"/css/style.css?1' type='text/css' media='all'>";
		msg += "<body>";
		msg += "<table id='mail'>";
		msg += "<tr><td width='100'><img src='"+req.protocol + "://" + req.get('host')+"/images/logo.png' border=0 width=80 height=80></td>";
		msg += "<td width='*'>Welcome! " + nm;
		msg += "	<br/>";
		msg += "	<br/>";
		msg += "	받으신 메일은 등록한 이메일주소가 실제 사용중인지, 사용자 본인의 계정이 맞는지 확인하기 위한 것입니다. 메일주소는 아이디로도 사용되며, 비밀번호를 잃었을 때 새로운 비밀번호를 발급받기 위해서도 사용됩니다.";
		msg += "	<br/>";
		msg += "	<a href='"+req.protocol + "://" + req.get('host')+"/account/auth/"+email+"' class='btn'>여기</a>를 클릭하시면 인증이 완료됩니다.";
		msg += "	<br/>";
		msg += "	<br/>";
		msg += "	감사합니다.<br/>";
		msg += "	From <a href='"+req.protocol + "://" + req.get('host')+"'>솔로지</a>.";
		msg += "</td></tr></table>";
		msg += "</body>";
		msg += "</html>";
		
		var mailOptions = {
			from: global.strDomainUser + ' <' + global.strDomainEmail + '>',
			to: mailto,
			subject: '['+global.strDomainName+'] 인증요청메일 : '+nm+'님, 이메일 인증을 완료해 주세요.',
			html: msg
		};
		
		transport.sendMail(mailOptions, function(error, info){
			if(error) { console.log(error);} 
			transport.close(); 
		});
		
		cb(true);
};