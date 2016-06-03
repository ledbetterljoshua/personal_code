//start code for slider
(function(){
	$('.ui-slider-handle').each(function(){
		$(this).css('opacity', '0')
	});

	$('.ui-slider').click(function(){
		$(this).find('.ui-slider-handle').css('opacity', '1')
	});

	$('.ui-slider-handle').click(function(){
		$(this).css('opacity', '1')

		var val = $(this).parent('div').parent('div').find('input.BVSliderInput').val();
		var valElem = $(this).parent('div').parent('div').find('input.BVSliderInput');
		if(val === "") {
			$(valElem).attr('value', '3')
			$(this).css('opacity', '1')

			var text = $(this).parent('div').parent('div').find('.BVSliderValueLabelContainer3').find('span').text();
			$(this).parent('div').parent('div').find('.BVSliderLegend').find('.BVFieldLegend').text(text);
		}
	});
}());