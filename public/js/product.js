function regist() {
	if (!checkInapposite($('#prd_nm'))) {
		showAlert('Item Name : Special characters can not be used.');
		$('#prd_nm').css('background-color' ,'#faa');
		$('#prd_nm').focus();
		return;
	} else $('#prd_nm').css('background-color' ,'#fff');

	if (!checkLength($('#prd_nm'), 2, 50)) {
		showAlert('Item Name : Enter 2 to 50 characters.');
		$('#prd_nm').css('background-color' ,'#faa');
		$('#prd_nm').focus();
		return;
	} else $('#prd_nm').css('background-color' ,'#fff');
	
	checkAllFileFields();
	
	$('#frmEnt').submit();
}


