var isBinary = true;
 
function fixdata(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
	return o;
}
 
function getConvertDataToBin($data){
	var arraybuffer = $data;
	var data = new Uint8Array(arraybuffer);
	var arr = new Array();
	for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
	var bstr = arr.join("");
 
	return bstr;
}

function handleFile(e) {
	var files = e.target.files;
	var i,f;
	for (i = 0; i != files.length; ++i) {
		f = files[i];
		var reader = new FileReader();
		var name = f.name;
 
		reader.onload = function(e) {
			var data = e.target.result;
			var workbook = (isBinary) ? XLSX.read(data, {type: 'binary'}) : XLSX.read(btoa(fixdata(data)), {type: 'base64'});
			workbook.SheetNames.forEach(function(item, index, array) {
				// var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[item]);
				var html = XLSX.utils.sheet_to_html(workbook.Sheets[item]);
				// var json = XLSX.utils.sheet_to_json(workbook.Sheets[item]);
				// var formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[item]);
				// console.log(csv);
				//console.log(html);
				// console.log(json);
				// console.log(formulae);
				$("#output").html(html);
			});
		};

		var agent = navigator.userAgent.toLowerCase();
		if(isBinary && (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
			reader.readAsArrayBuffer(f);
			isBinary = false;
		}
		else reader.readAsArrayBuffer(f);
	}
}

$(function() {
	$('#xls_file').change(handleFile);
});