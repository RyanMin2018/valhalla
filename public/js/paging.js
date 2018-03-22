function getPaging(intCurrentPage, intTotalRowNum, intRowCntPerPage, intPageBlockSize, strSearchOptions) {
	var strReturn           = "";
	var strReplace          = "";
	var intVirtualStartPage = 0;
	var intVirtualEndPage   = 0;
	var intVirtualPrevPage  = 0;
	var intVirtualNextPage  = 0;
	var intFinalPage        = parseInt(intTotalRowNum/intRowCntPerPage);
	var intRest             = intTotalRowNum%intRowCntPerPage;

	if (intRest==0) { }
	else { intFinalPage = intFinalPage+1; }

	// for mobile version
	if ($(window).width()<700) {
		intPageBlockSize = 3;
	}
	
	if (intCurrentPage>intPageBlockSize) {
		intVirtualStartPage = parseInt(((intCurrentPage-1)/intPageBlockSize))*intPageBlockSize+1;
		intVirtualPrevPage  = intVirtualStartPage-1;
	}
	else { intVirtualStartPage = 1; }

	intVirtualEndPage = intVirtualStartPage + intPageBlockSize - 1;
	if (intVirtualEndPage>=intFinalPage) { intVirtualEndPage = intFinalPage; }
	else { intVirtualNextPage = intVirtualEndPage+1; }

	strReturn = "<div id='paging'>\n";

	if (intVirtualPrevPage>0) {
		strReturn += "<a href='?page="+intVirtualPrevPage +strSearchOptions+"' title='이전목록'><img src='/images/btnPrev.png' border=0 align='absmiddle' title='이전목록' alter='이전목록'></a>&nbsp;";
	}

	strReturn += "<span>";

	for (var i=intVirtualStartPage; i<intVirtualEndPage+1; i++) {
		strReturn += (i==intCurrentPage) ? "<a href='?page="+i+strSearchOptions+"' class='btn on' title='현재 페이지'>"+i+"</a>" : "<a href='?page="+i+strSearchOptions+"' title='"+i+"번째 페이지로 이동' class='btn off'>"+i+"</a>";
	}

	strReturn += "</span>";

	if (intVirtualNextPage>0) {
		strReturn += "<a href='?page="+intVirtualNextPage+strSearchOptions+"' title='다음목록'><img src='/images/btnNext.png' border='0' align='absmiddle' title='다음목록' alter='다음목록'></a>\n";
	}


	strReturn += "</div>";
	document.write(strReturn);
}