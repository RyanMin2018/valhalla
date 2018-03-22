var ws = new WebSocket("ws://n.mp1.co.kr:5900");
// var strSeparator = '__________'; // it is defined at common.js 

ws.onopen = function(event) {
	ws.send(strSender + strSeparator + strSender + ' is connected.');
};

ws.onmessage = function(event) {
	console.log(event.data);
	event.data += strSeparator + ' ';
	var a = event.data.split(strSeparator);
	var msg = "";
	if (strSender == a[0]) {
		msg = "<div class='chat r'><div class='balloon r'><span>" + a[1] + "&nbsp;</span></div></div>";
	} else {
		msg = "<div class='chat'><div class='writer'>"+a[0]+"</div><div class='balloon l'><span>" + a[1] + "&nbsp;</span></div></div>";
	}
	$('#chats').append(msg);
};

ws.onerror = function(event) {
	$('#chat').append("<li><font color='red'>Sorry, unable to connect.</font></li>");
};
  
function sendMsg() {
	ws.send(strSender + strSeparator + $('#msg').val());
	$('#msg').val('');
}

function enter(e) {
	if (e.keyCode==13) sendMsg();
}