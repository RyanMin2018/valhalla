$(document).ready(function(){

	$(function(){ 
		$('img.lazyload').lazyload({effect:'fadeIn',effectTime:1000,load:function(){
				$(this).css('min-height',0);
			}
		});
	});
	
	$('.question').click(function() {
		$(this).parent().children('.answer').slideToggle();
	
	});

});

var msg;
var speakStart = function() {
	if ('speechSynthesis' in window) {
		msg = ('speechSynthesis' in window) ? new SpeechSynthesisUtterance() : null;
		msg.lang = "ko-KR";
		msg.text = $("#articlecontent").text();
		window.speechSynthesis.speak(msg);
	}
};

var speakStop = function() {
	if ('speechSynthesis' in window) {
		window.speechSynthesis.cancel();
	}
};


function getMenu() {

document.write("	<ul>																	");
document.write("		<li><a href='/ojt/01.htm'>운영체제와 응용프로그램 </a></li>			");
document.write("		<li><a href='/ojt/02.htm'>네트워크 </a></li>						");
document.write("		<li><a href='/ojt/03.htm'>도메인 </a></li> 							");
document.write("		<li><a href='/ojt/04.htm'>서버 </a></li>							");
document.write("		<li><a href='/ojt/05.htm'>웹기획에서 자주 쓰이는 용어들 </a></li>	");
document.write("		<li><a href='/ojt/06.htm'>프로그래밍 언어 </a></li>					");
document.write("		<li><a href='/ojt/07.htm'>데이터베이스 </a></li>					");
document.write("		<li><a href='/ojt/08.htm'>개발프로세스와 개발조직 </a></li>			");
document.write("		<li><a href='/ojt/09.htm'>모바일 </a></li>							");
document.write("		<li><a href='/ojt/10.htm'>빅데이터 </a></li>						");
document.write("		<li><a href='/ojt/11.htm'>블록체인 </a></li>						");
document.write("	</ul>																	");


}