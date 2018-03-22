var socket = io();

function sendMsg() {
	socket.emit('msg', {'usr':$('#strSender').val(),'room':$('#room').val(),'msg':$('#msg').val()});
	$('#msg').val('');
}

function enter(e) {
	if (e.keyCode==13) sendMsg();
}

socket.on('msg', function(message) {
	var usr = message.usr;
	var msg = message.msg + '&nbsp;';
	if ($('#strSender').val() == usr) {
		msg = "<div class='chat r'><div class='balloon r'><span>" + msg + "</span></div></div>";
	} else {
		if (usr==null) { msg = "<div class='chat'><div class='writer'>"+msg+"</div></div>"; }
		else { msg = "<div class='chat'><div class='writer'>"+usr+"</div><div class='balloon l'><span>" + msg + "&nbsp;</span></div></div>"; }
	}
	$('#chats').append(msg);
	goBottom();
});

socket.on('user', function(message) {
	if (message.indexOf($('#strSender').val())<0) message += ' | ' + $('#strSender').val();
	$('#chatgroup').html('<b>Current participants</b> ' + message);
});

$(document).ready(function() {
	$('#footer').hide();
	socket.emit('joinroom', {'room':$('#room').val(),'usr':$('#strSender').val()});
});

//window.onbeforeunload = function() {
//	socket.emit('user', {'ctrl':'out', 'user':$('#strSender').val()});
//}; 
