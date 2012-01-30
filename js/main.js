$(document).ready(function() {
			 resizeFooter();
});

$(window).resize(function() {
	 resizeFooter();
});

function resizeFooter(){
	var neededHeight = $(window).height() -($("footer").offset().top ) + 7;
	$("footer").height(neededHeight);
}