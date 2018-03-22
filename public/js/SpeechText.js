var SpeechText = function(bid, langCd, idToSpeak) {

	this.msg = ('speechSynthesis' in window) ? new SpeechSynthesisUtterance() : null;
	this.intDivide = (localStorage.getItem(bid)) ? localStorage.getItem(bid)-2 : 0;
	this.msg.lang =  (langCd)? langCd : "en-US";
	document.getElementById(idToSpeak).innerText += ".";
	this.arrText = (document.getElementById(idToSpeak).innerText.replace(/\n\n/gi, '        ').replace(/ \n/gi, '').replace(/\n/gi, '').replace(/\./gi, '\. ').replace(/,/gi, ', ')).split(". ");
	this.boardid = bid;

	this.divideText = function() {
		var t = "";
		if (this.intDivide<this.arrText.length-1) t = this.arrText[this.intDivide++] + ". ";
		localStorage.setItem(this.boardid, this.intDivide);
		return t;
	};

	this.start = function() {
		this.intDivide = 0;
		this.speak();
	};

	this.keepon = function() {
		this.speak();
	};

	/* speak */
	this.speak = function() {
		if ('speechSynthesis' in window) { // ie11 x, chrome o, safari o
			this.msg.text = this.divideText();
			if (this.msg.text!="") window.speechSynthesis.speak(this.msg);
		}
	};

	this.stop = function() {
		if ('speechSynthesis' in window) {
			localStorage.setItem(this.boardid, this.intDivide);
			window.speechSynthesis.cancel();
		}
	};
}
