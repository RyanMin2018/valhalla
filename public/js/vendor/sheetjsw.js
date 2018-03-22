importScripts('xlsx.full.min.js');
postMessage({t:'ready'});
onmessage = function(evt) {
		var et;
		var ed;
		try { 
			et = evt.data.t;
			ed = JSON.stringify(XLSX.read(evt.data.d, evt.data.b)); 
		} catch(e) { 
			et ="e";
			ed = e.stack; 
		}
		postMessage({t:et, d:ed});
}
