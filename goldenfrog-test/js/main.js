$(function(){
	var menuItems = $('li');

	for (i = 0; i < menuItems.length; i++) {
		$(menuItems[i]).clone().appendTo('.ul-dropdown');
	}

	$('.button').click(function(){
		$('.dropDown').toggleClass('open');
	});
});