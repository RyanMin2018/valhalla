function regist() {

	if (!checkLength($('#title'), 2, 100)) {
		showAlert('제목은 넣어주세요. 꼬끼요.');
		$('#title').css('background-color' ,'#faa');
		$('#title').focus();
		return false;
	}

	checkAllFileFields();
	return true;
}



