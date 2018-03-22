// require strSeparator. this is defined common.js
// upload path : /upload
// download path : /uploadfiles

$(document).ready(function() {
	var obj = $("#dragandrophandler");
	obj.on('dragenter', function (e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).css('border', '2px dotted #00f');
	});
	obj.on('dragover', function (e) {
		 e.stopPropagation();
		 e.preventDefault();
	});
	obj.on('drop', function (e) {
		 $(this).css('border', '1px dotted #ccc');
		 e.preventDefault();
		 var files = e.originalEvent.dataTransfer.files;
	 
		 //We need to send dropped files to Server
		 handleFileUpload(files,obj);
	});
	$(document).on('dragenter', function (e) {
		e.stopPropagation();
		e.preventDefault();
	});
	$(document).on('dragover', function (e) {
	  e.stopPropagation();
	  e.preventDefault();
	  obj.css('border', '2px dotted #00f');
	});
	$(document).on('drop', function (e) {
		e.stopPropagation();
		e.preventDefault();
	});
});

function dropFile() {
	$("input[id='file']:checked").each(function() {
		$(this).parent().remove();
	});
	
	var file_cnt = 0;
	$("input[id='file']").each(function() {
		file_cnt++;
	});
	if(file_cnt==0) {
		$("#dragtext").show();
		$('#dropfilebutton').hide();
		$('#addfilebutton').hide();
	}
}

function callbackAddedFile(strFilePath, strFileName, strFileSize, strMimeType) {
	var strFilePath = strFilePath+strSeparator+strMimeType.replace('/', '%2F');
	$("#ul_attached_files").append("<li>&nbsp; <input type='checkbox' name='file' id='file' value='"+strFilePath+strSeparator+strFileSize+strSeparator+strFileName+"'> <a href='/uploadfiles/"+strFilePath.split(strSeparator)[0]+"' target='_new'>"+strFileName+"</a> ("+ addComma(strFileSize) +" byte)</li>");
	setExistedFiles();
}

function getCountCheckedNode() {
	var intCnt = 0;
	$("input[id='file']:checked").each(function(){
		intCnt++;
	});
	return intCnt;
}

function sendFileToServer(formData,status) {
	var uploadURL ="/upload";
	var extraData ={};
	var jqXHR=$.ajax({
			xhr: function() {
			var xhrobj = $.ajaxSettings.xhr();
			if (xhrobj.upload) {
					xhrobj.upload.addEventListener('progress', function(event) {
						var percent = 0;
						var position = event.loaded || event.position;
						var total = event.total;
						if (event.lengthComputable) {
							percent = Math.ceil(position / total * 100);
							$('#progressbar').text(percent + '% uploaded.');
						}
					}, false);
				}
			return xhrobj;
		},
	url: uploadURL,
	type: "POST",
	contentType:false,
	processData: false,
		cache: false,
		data: formData,
		success: function(){
			$('#progressbar').text('');
		},
		error: function() {
			$('#progressbar').text('파일이 너무 커서 업로드할 수 없어요(Upload failed. This file is too large.)');
			$('#progressbar').delay(2000).hide(500);
		}
	}); 
}

function handleFileUpload(files,obj) {
	for (var i = 0; i < files.length; i++) {
		var fd = new FormData();
		fd.append('upfile', files[i]);
		sendFileToServer(fd,status);
	}
}

function checkAllFileFields() {
	$("input[id='file']").each(function(){
		this.checked = true;
	});
}

function setExistedFiles() {
	$('#dragtext').hide(); 
	$('#dropfilebutton').show();
	$('#addfilebutton').show();
	$("#dragandrophandler").css('border', '1px dotted #ccc');
}

////////////////////////////////////////////////////////////////////

function showUploadFormWindow() {
	$("#div_attach_file").css('top', $('#dragandrophandler').offset().top);
	$("#div_attach_file").show();
}


function hideUploadFormWindow() {
	document.frmAddFile.reset();
	$("#div_attach_file").hide();
}

function uploadFromUploadFormWindow() {
	var fd = new FormData();
	fd.append('upfile', $('input[name=uf]')[0].files[0]);
	sendFileToServer(fd,status);
	hideUploadFormWindow();
}

