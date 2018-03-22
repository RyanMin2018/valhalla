module.exports =  {
		
	addComma : function(n) {
		return Number(n).toLocaleString('en');
	},

	addZero : function(i) {
		return (i<10) ? '0' + i : i;
	},
	
	getToday : function() {
		var d = new Date();
		var mm = this.addZero(d.getMonth());
		var dd = (d.getDate()<10) ? '0' + d.getDate() : d.getDate();
		return d.getFullYear() + '.' + mm + '.' + dd;
	},

	getFormatDate : function(datefromdb) {
		var d = new Date(datefromdb);
		var mm = (d.getMonth()<9) ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
		var dd = this.addZero(d.getDate());
		var h = this.addZero(d.getHours());
		var m = this.addZero(d.getMinutes());
		var s = this.addZero(d.getSeconds());
		return d.getFullYear() + '.' + mm + '.' + dd + ' ' + h + ':' + m + ':' + s;
	},
	
	trim : function(str) {
		   return (str) ? str.replace(/^\s+|\s+$/g,"") : "";
	}
};