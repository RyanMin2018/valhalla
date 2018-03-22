var speakStart = function(id) {
	if ('speechSynthesis' in window) {
		msg = ('speechSynthesis' in window) ? new SpeechSynthesisUtterance() : null;
		msg.lang = "ko-KR";
		msg.text = $(id).text();
		window.speechSynthesis.speak(msg);
	}
};

var speakStop = function() {
	if ('speechSynthesis' in window) {
		window.speechSynthesis.cancel();
	}
};