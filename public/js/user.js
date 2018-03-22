function regist() {
	if (!checkEmail($('#user_id'))) {
		showAlert('잘못된 이메일주소입니다.');
		$('#user_id').css('background-color' ,'#faa');
		$('#user_id').focus();
		return false;
	} else $('#user_id').css('background-color' ,'#fff');
	
	if (!checkInapposite($('#user_pw'))) {
		showAlert('괴상한 문자가 입력되었습니다.');
		$('#user_pw').css('background-color' ,'#faa');
		$('#user_pw').focus();
		$('#user_pw_check').val('');
		return false;
	} else $('#user_pw').css('background-color' ,'#fff');

	if (!checkLength($('#user_pw'), 4, 16)) {
		showAlert('비밀번호는 4~16글자로 설정하세요.');
		$('#user_pw').css('background-color' ,'#faa');
		$('#user_pw').focus();
		$('#user_pw_check').val('');
		return false;
	} else $('#user_pw').css('background-color' ,'#fff');
	
	if ($('#user_pw').val()!=$('#user_pw_check').val()) {
		showAlert('하!하! 비밀번호를 벌써 까먹으신건가요? 두개의 비밀번호를 똑같이 입력하세요.');
		$('#user_pw_check').css('background-color' ,'#faa');
		$('#user_pw_check').focus();
		$('#user_pw_check').val('');
		return false;
	} else $('#user_pw_check').css('background-color' ,'#fff');
	
	if (!checkInapposite($('#user_nm'))) {
		showAlert('이렇게 괴상한 문자를 가진 이름은 처음이군요. 부를 수 있는 이름을 입력해 주세요.');
		$('#user_nm').css('background-color' ,'#faa');
		$('#user_nm').focus();
		return false;
	} else $('#user_nm').css('background-color' ,'#fff');

	if (!checkLength($('#user_nm'), 1, 30)) {
		showAlert('이름을 꼭 넣어주세요.');
		$('#user_nm').css('background-color' ,'#faa');
		$('#user_nm').focus();
		return false;
	} else $('#user_nm').css('background-color' ,'#fff');	
	
	if ($('#old_pw').length) {
		if (!checkLength($('#old_pw'), 4, 16)) {
			showAlert('비밀번호는 4~16글자로 설정하세요.');
			$('#old_pw').css('background-color' ,'#faa');
			$('#old_pw').focus();
			return false;
		} else $('#old_pw').css('background-color' ,'#fff');
	}
	
	
	return true;
}


function checkDuplication() {
	$.ajax({
		url:'/account/check/' + $('#user_id').val().trim(),
		success:function(r) {
			if (r==0) {
				showAlert('이미 등록된 이메일입니다. 즐겨 사용하지 않는 사이트는 가입한 적이 있는지 까먹기 마련입니다. 당황하지 마시고  로그인하시거나 다른 이메일주소를 이용하세요.');
				$('#user_id').focus();
			}
		}
	}); 
}

function optout() {
	if (confirm('탈퇴를 선택하셨습니다. 모든 활동기록을 너무 늦지 않게 모두 삭제할 예정이고, 같은 이메일계정으로는 다시 등록하실 수 없으니, 신중하게 결정하시길 바래요. 정말 탈퇴하시겠습니까?')) {
		location.href = '/account/edit/optout';
	}
}