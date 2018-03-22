// check email 
function checkEmail(fieldid) {
	var regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	if (!fieldid.val()) return false;
	return regEmail.test(fieldid.val());
}

// check phone number
function checkPhone(fieldid) {
	var regPhone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
	if (!fieldid.val()) return false;
	return regPhone.test(fieldid.val());
}

// check string length
function checkLength(fieldid, intMin, intMax) {
	fieldid.val(fieldid.val().trim());
	return (fieldid.val().length < intMin || fieldid.val().length > intMax) ? false : true;
}

// check wrong character
function checkInapposite(fieldid) {
	var pattern = /[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ,~!@#\?\|\\\<\>\$\%\^\&\:\;\\/*\.\-\_\=\+\(\)\{\}\[\]\'\")]/gi;
	return !pattern.test(fieldid.val());
}

// only permit number
// it's for key-up event
function numberOnly(obj) { 
	 $(obj).keyup(function(){
         $(this).val($(this).val().replace(/[^0-9]/g,""));
    });
}
