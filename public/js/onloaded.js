/* UI Controller. This should be added to the back of the page. */

//goto page top
function goTop() {
  try {
    $('body, html').animate({ scrollTop: $("#section_pop_menu").offset().top }, 400);
  } catch(e) {}
}

// goto page bottom
function goBottom() {
	try {
		$('body, html').animate({ scrollTop: $("#bottom").offset().top }, 100);
	} catch (e) {}
}

/////////////////////////////////////////////////////////////////
//
// POPUP MENU CONTROL
//
/////////////////////////////////////////////////////////////////


// show pop menu
function controlPopMenu() {
	if ($("#section_pop_menu").position().left < 0) {
		$("#section_pop_menu").animate({left:'0px'}, 200);
		goTop();
		$('body').css('overflow-y', 'hidden');
	} else hidePopMenu();
}

// hide pop menu
function hidePopMenu() {
	$("#section_pop_menu").animate({left:-$("#section_pop_menu").outerWidth()}, 500);
	$('body').css('overflow-y', 'auto');
}

// mouse leave?
$("#section_pop_menu").mouseleave(function() {
	hidePopMenu();
});

// click at another section?
$("body:not(#section_pop_menu)").click(function(){
	 if ($("#section_pop_menu").position().left > -100) hidePopMenu();
});


/////////////////////////////////////////////////////////////////
//
// ALERT OR NOTICE CONTROL
//
/////////////////////////////////////////////////////////////////

// custom alert
function showAlert(msg) {
	if (msg!=undefined && msg.length>0) {
		$('#alert').css('background-color', '#fee');
		$('#alert').css('color', '#f00');
		$('#alert').html(msg);
		$('#alert').show();
		$('#alert').delay(3000).slideUp(500);
	}
}

// custom notice
function showNotice(msg) {
	if (msg!=undefined && msg.length>0) {
		$('#alert').css('background-color', '#eee');
		$('#alert').css('color', '#000');
		$('#alert').html(msg);
		$('#alert').show();
	}
}

// get bulletin categories and change the layout of elements on the screen to suit your environment.
$(document).ready(function(){
	/* get bulletin board categories */
	$.ajax({
		url:'/boardgroup',
		success:function(r) {
			$.each(r, function(k,v){
				$('#section_pop_menu').append('<li onclick="location.href=\'/board/?c='+v.GRP_CD+'\';"><a href="/board/?c='+v.GRP_CD+'">'+v.GRP_NM+' ('+addComma(v.ARTICLE_CNT)+')</li>');
				if ($('#categorycd').length>0 && $('#category').length>0) {
					if (v.GRP_CD==$('#categorycd').text()) {
						$('#category').html(v.GRP_NM.toUpperCase());
						$('#section_location').append(" / <a href='/board/?c="+v.GRP_CD+"' title='"+v.GRP_NM+"'>"+v.GRP_NM.toUpperCase()+"</a>");
					}
				}
				if ($('#categorycd').length>0 && $('#grpcd').length>0) {
					var strSelected = (v.GRP_CD==$('#categorycd').text()) ? " selected" : "";
					$('#grpcd').append('<option value="'+v.GRP_CD+'"'+strSelected+'>'+v.GRP_NM+'</option>');
				}
			});
		}
	});

	/* show go top/prev/next button */
	$(window).scroll(function(e){
		e.stopPropagation();
		e.preventDefault();
		if ($(window).scrollTop()>80) {
			$('#gotop').show();
			if ($('#gonextarticle').attr('onclick')) $('#gonextarticle').show();
			if ($('#goprevarticle').attr('onclick')) $('#goprevarticle').show();
		} else {
			$('#gotop, #gonextarticle, #goprevarticle, #gonexttext, #goprevtext').hide();
		}
	});
	
	/* set header and footer */
	function setHeaderFooterPosition() {
		var baseoffset = $('#article').offset();
		var left = 28;
		var right = 24;
		if ($(window).width()<701) { // mobile
			left = 18;
			right = 10;
		}
		$('#menu').css('left', baseoffset.left+left);
		$('#domain').css('left', baseoffset.left+left+20);
		$('#section_logon_status').css('right', ($(window).width()-(baseoffset.left+$('#article').outerWidth())+right));
		$('#section_logon_status').show();
		$('#alert').css('padding-left', baseoffset.left+left);
		$('#copyright').css('left', baseoffset.left);
	}
	
	// load
	setHeaderFooterPosition();

	// resize
	$(window).resize(function(e){
		e.stopPropagation();
		e.preventDefault();
		setHeaderFooterPosition();
	});
	
	/* show or not button for speak */
	('speechSynthesis' in window) ? $('#speak').show() : $('#speak').hide();
});

$(window).on('beforeunload', function() {
	if ('speechSynthesis' in window) {
		window.speechSynthesis.cancel();
	}
});