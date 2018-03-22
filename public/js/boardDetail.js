
$(document).ready(function(){
	/* enter to register comment */
	$('#comment').keydown(function() {
		registComment();	
	});

	setAutolink('articlecontent');
	if ($('#filecnt').text() == 0) {
		$('div.attached').css('border', '0px');
		$('div.attached').css('padding', '3px');
	}
	$('img.lazyload').lazyload({effect:'fadeIn',effectTime:1000,load:function(){
			$(this).css('min-height',0);
		}
	});
	$('body').scrollTop(1);

});




/* override for regist() in board.js. prevent enter to submit at input box for comment. */
function regist() {
	if ($('#frmEnt').attr('action').indexOf('delete')<0) {
		return false;
	}
	// for other actions. i.e. delete
	return true;
}

/* comment registration. Use 'ajax' to enable you to write or delete comments without switching pages. */
function registComment() {
	if (event.keyCode==13 && $('#frmEnt').attr('action').indexOf('delete')<0) {
		if (!checkInapposite($('#comment'))) {
			alert('특수문자는 사양합니다.');
			$('#comment').css('background-color' ,'#faa');
			$('#comment').focus();
			return;
		} else $('#comment').css('background-color' ,'#fff');
	
		if (!checkLength($('#comment'), 2, 200)) {
			alert('내용을 입력하세요.');
			$('#comment').css('background-color' ,'#faa');
			$('#comment').focus();
			return;
		}
		var data = {comment:$('#comment').val()};
		$.ajax({
			url:$('#frmEnt').attr('action'),
			type:'post',
			contentType:'application/json',
			data:JSON.stringify(data),
			success:function(r) {
				$('#comment').val('');
				var row_cont   = '<tr class="'+r.cid+'"><td colspan="2">'+r.comment+'</td></tr>';
				var row_writer = '<tr class="'+r.cid+'"><td class="writer">'+r.usernm.toUpperCase()+'<span>&nbsp;('+r.regdt+')</td>';
				row_writer += '<td class="n writer"><img src=\'/images/btnDrop.png\' onclick="dropComment(\''+r.bid+'\', \''+r.cid+'\');"></td></tr>';
				if ($('.comment tr').length==0) { // if it is first comment?
					$('.comment').append(row_writer);
					$('.comment').append(row_cont);					
				} else {
					$('.comment tr:first').before(row_cont);
					$('.comment tr:first').before(row_writer);
				}
			}
		});
	}
}

/* drop comment */
function dropComment(bid, cid) {
	var data = {commentid:cid};
	$.ajax({
		url:'/board/'+bid+'/comment?_method=delete',
		type:'post',
		contentType:'application/json',
		data:JSON.stringify(data),
		success:function(r) {
			$('.'+cid).remove();
		}
	});
}