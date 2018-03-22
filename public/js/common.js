var strSeparator = '__________';

/* common functions */

// replaceAll
function replaceAll(str, searchStr, replaceStr) {
  while (str.indexOf(searchStr) !== -1) {
    str = str.replace(searchStr, replaceStr);
  }
  return str;
}

// add comma
function addComma(n) {
	return Number(n).toLocaleString('en');
}

function getFileSize(n) {
	var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
	var e = Math.floor(Math.log(n) / Math.log(1024));
	return addComma((n / Math.pow(1024, e)).toFixed(2)) + " " + s[e];
}

// trim
String.prototype.trim = function() {
   return this.replace(/^\s+|\s+$/g,"");
};


function setLogonStatusSection(strid, strnm) {
	if (strid.length>0) {
		document.write("<span><a href='/account/edit/' title='Account Management'>"+ strnm.toUpperCase() +"</a></span>");
		document.write("<a href='/logout' class='btn' title='logout'>LOGOUT</a>");
	} else {
		document.write("<a href='/login' class='btn' title='login'>LOGIN</a><a href='/account' class='btn logon' title='create account'>CREATE ACCOUNT</a>");
	}
};

function addZero(i) {
	return (i<10) ? '0' + i : i;
}

function getToday() {
	var d = new Date();
	var mm = addZero(d.getMonth());
	var dd = (d.getDate()<10) ? '0' + d.getDate() : d.getDate();
	return d.getFullYear() + '.' + mm + '.' + dd;
}


function getFormatDate(datefromdb) {
	var d = new Date(datefromdb);
	var mm = (d.getMonth()<9) ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
	var dd = addZero(d.getDate());
	var h = addZero(d.getHours());
	var m = addZero(d.getMinutes());
	var s = addZero(d.getSeconds());
	return d.getFullYear() + '.' + mm + '.' + dd + ' ' + h + ':' + m + ':' + s;
}

/* http://linuxism.tistory.com/1553 */
function setAutolink(id) {
	var container = document.getElementById(id);
	var doc = container.innerHTML;
	var regURL = new RegExp("(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9가-힣_~#%$?&=:200-9999()]+)","gi");
	var regEmail = new RegExp("([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+\.[a-z0-9-]+)","gi");
	container.innerHTML = doc.replace(regURL,"<a href='$1://$2' target='_blank'>$1://$2</a>").replace(regEmail,"<a href='mailto:$1'>$1</a>");
}










