$('.pencil').click(function(){

	$('body').css({
		"margin-right": "30%"
	});       
	$('.notes').removeClass('hidden');

});

	var div 			= document.createElement('div'); 
	div.className 		= "new-note notes notes-list hidden";    
	div.style.position 	= 'absolute';
	div.style.top		= $('body').scrollTop() + 10 + 'px';
	div.style.right		= '20%';
	$(div)
	.wrapInner('<div class="notes-heading"><h3 class="heading">NOTES</h3></div>')
	.wrapInner('<div class="reating-notes"></div>');
	$(div).find('.reating-notes')
	.append('<div id="notes-all"></div>');
	$('#notes-all').after('<button>leave a new note</button');
	document.body.appendChild(div);    