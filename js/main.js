$(document).ready(function() {
			 resizeFooter();
});

$(window).resize(function() {
	 resizeFooter();
});

function resizeFooter(){
	var neededHeight = $(window).height() -($("footer").offset().top ) + 7;
	if(neededHeight < 50) neededHeight=50;
	$("footer").height(neededHeight);
}