$(document).ready(function() {
	var filter = window.location.href.indexOf("/elements/") + 
				 window.location.href.indexOf("/concepts/") + 
				 window.location.href.indexOf("/definitions/")
	if(filter < 0 ){
		resizeFooter();
	} 
	


});

$(window).resize(function() {
	 resizeFooter();
});

function resizeFooter(){
	var origheight = $("footer").height();
	var neededHeight = $(window).height() -($("footer").offset().top );
	if(neededHeight < origheight) neededHeight=origheight;
	$("footer").height(neededHeight);
}