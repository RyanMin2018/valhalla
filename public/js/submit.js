


/**
 * modify action
 * 
 * @param strUrl
 */
function modify(strUrl) {
	$('#frmEnt').attr('action', strUrl + '?_method=put');
	$('#frmEnt').submit();
}

/**
 * drop action
 * 
 * @param strUrl
 */
function drop(strUrl) {
	if (confirm('정말요??')) {
		$('#frmEnt').attr('action', strUrl + '?_method=delete');
		$('#frmEnt').submit();
	}
}