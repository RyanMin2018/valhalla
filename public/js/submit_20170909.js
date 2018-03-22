$('#frmEnt').submit(function(e) {
	var data = $(this).serializeArray();
	var strUrl = $(this).attr('action');
	$.ajax({
		url: strUrl,
		type: 'post',
		dataType: "json",
		data: data,
		contentType: "application/json; charset=utf-8",
		success: function(){
 			// 
		},
		error: function() {
			alert('error');
		}
	});
	e.preventDefault();
	e.unbind();
});

function drop(strUrl) {
	if (confirm('Are you sure?')) {
		$('#frmEnt').attr('action', strUrl + '?_method=delete');
		$('#frmEnt').submit();
	}
}

$(document).ready(function() {
	$('#frmEnt input').keydown(function(e) {
	    if (e.keyCode == 13) {
	        regist();
	    }
	});
});
