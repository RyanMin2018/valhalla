/** drop target **/
var _target = document.getElementById('drop');
var jsonToSave; // for save

/** Spinner **/
var spinner;

var _workstart = function() { spinner = new Spinner().spin(_target); }
var _workend = function() { spinner.stop(); }

/** Alerts **/
var _badfile = function() {
	alertify.alert('올바른 엑셀 파일이 아닙니다.', function(){});
};

var _pending = function() {
	alertify.alert('현재 파일이 처리될 때까지 기다려 주십시오.', function(){});
};

var _large = function(len, cb) {
	alertify.confirm("파일의 크기가 " + len + " byte이며, 몇 분 동안 브라우저는 이 파일을 처리하느라 정신이 없을 꺼예요. 실행할까요?", cb);
};

var _failed = function(e) {
	console.log(e, e.stack);
	alertify.alert('처리하지 못했습니다. 문제가 계속되면 관리자가... 뭘 할 수 있을까요?', function(){});
};

var boldRenderer = function (instance, td, row, col, prop, value, cellProperties) {
	Handsontable.TextCell.renderer.apply(this, arguments);
	$(td).css({'font-weight': 'bold'});
};

var $container, $parent, $window, availableWidth, availableHeight;
var calculateSize = function () {
	// var offset = $container.offset();
	availableWidth = 900; // Math.max($window.width(), 600);
	availableHeight = 400; // Math.max($window.height(), 400);
};

/* make the buttons for the sheets */
var make_buttons = function(sheetnames, cb) {
	var $buttons = $('#buttons');
	$buttons.html("");
	sheetnames.forEach(function(s,idx) {
		var button= $('<button/>').attr({ type:'button', name:'btn' +idx, text:s });
		button.append(s);
		button.click(function() { cb(idx); });
		$buttons.append(button);
	});
};

var _onsheet = function(json, sheetnames, select_sheet_cb) {
	make_buttons(sheetnames, select_sheet_cb);
	if(!json) json = [];
	json.forEach(function(r) { if(json[0].length < r.length) json[0].length = r.length; });
	calculateSize(); 
	$("#sheet").handsontable({
		data: json,
		startRows: 5,
		startCols: 3,
		rowHeaders: false, 
		colHeaders: false,
		width: function () { return availableWidth; },
		height: function () { return availableHeight; },
		contextMenu: true
	});
	/* for save data */
	jsonToSave = json;
	$('#section_bottom_button').show();
};

DropSheet({
	drop: _target,
	on: {
		workstart: _workstart,
		workend: _workend,
		sheet: _onsheet
	},
	errors: {
		badfile: _badfile,
		pending: _pending,
		failed: _failed,
		large: _large
	},
	filefieldid:document.getElementById('uf') // added for <input type=file>
});

$(document).ready(function() {
	$container = $("#sheet"); 
	$parent = $container.parent();
	$window = $(window);
	$window.on('resize', calculateSize); 
	
	$('input[name=uf]').change(function() { // added for <input type=file>
		hideUploadFormWindow();
	});
});

////////////////////////////////////////////////////////////////////
//
// form
//
////////////////////////////////////////////////////////////////////
function showUploadFormWindow() {
	$("#div_attach_file").css('top', $('#articlecontent').offset().top);
	$("#div_attach_file").show();
}

function hideUploadFormWindow() {
	document.frmAddFile.reset();
	$("#div_attach_file").hide();
}

/* save current sheet */
function savedata() {
	if (jsonToSave) { 
		removeBlankRow();
		console.log(JSON.stringify(jsonToSave));
	} else {
		alertify.alert('저장할 데이터가 엄써요..', function(){});
	}
}

var removeBlankRow = function() {
	if (jsonToSave) {
		var maxcol = 0;
		var maxrow = jsonToSave.length;
		for (var i=0; i<jsonToSave.length; i++) {
			var nullcnt = 0;
			for (var j=0; j<jsonToSave[i].length; j++) {
				if (jsonToSave[i][j]!='null' && jsonToSave[i][j]!='') {
					maxcol=j;
				} else nullcnt++;
			}
			// console.log(nullcnt,jsonToSave[i].length, i );
			if (nullcnt==jsonToSave[i].length) {
				maxrow =i;
				break;
			}
		}
		var jsonResult = new Array(maxrow);
		for (var i=0; i<maxrow; i++) {
			jsonResult[i] = new Array(maxcol+1);
			for (var j=0; j<maxcol+1; j++) {
				jsonResult[i][j] = jsonToSave[i][j];
			}
		}
		jsonToSave = jsonResult;
	}
}

