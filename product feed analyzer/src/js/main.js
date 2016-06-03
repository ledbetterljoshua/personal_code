(function(){
	$('button').click(function(){
		event.preventDefault();
	//move code from textarea into the dom so it can be manipulated and analyzed
	$('#code').html($('textarea').val());

		var parent = $('#parent').val();
		var child = $('#child').val();

		var product = $(parent).length;
		for( i=0; i<product; i++ ) {
			var thisProduct = $(parent)[i];
			if($(thisProduct).find(child).length === 0) {
				console.log(thisProduct);
				$('.length').html(product)
			}
		}

	});
}())