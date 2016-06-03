//medium.com style toolTip 

$(function(){
	// get the get the selected text
	var selection = window.getSelection();      
	var sel = window.getSelection && window.getSelection();

	//generate the HTML for the tooltip and append it to the body
	function createToolTip() {
		var selectedText = selection;
		if (selectedText) {
			// make box
			var div 			= document.createElement('div'); 
			div.className 		= "highlightMenu fade";    
			div.style.position 	= 'absolute';
			$(div)
			.wrapInner('<div class="highlightMenu-inner"></div>')
			.wrapInner('<div class="buttonSet buttonSet--highlightMenu"></div>')
			.append('<div class="highlightMenu-arrowClip"><span class="highlightMenu-arrow"></span></div>')
			$(div).find('.highlightMenu-inner')
			.append('<button class="button button--chromeless button--withIcon button--highlightMenu js-highlightMenuQuoteButton pencil"><span class="fa fa-pencil"></span></button><button class="button button--chromeless button--withIcon button--highlightMenu twitter" data-toggle="modal" data-target="#myModal"><span class=" fa fa-twitter"></span></button><button class="button button--chromeless button--withIcon button--highlightMenu button--highlightMenuNotes facebook" data-toggle="modal" data-target="#myModal"><span class=" fa fa-facebook"></span></button>');
			$(div).attr('id', 'highlightMenu');
			document.body.appendChild(div);           

			$('.highlightMenu').wrap('<div id="theAwesomeToolBarThatIsWayCoolYo"></div>');
		}
	} createToolTip()

	/*ACTIVATE TOOLTIP - BEGIN*/
	function activateToolTip() {
	    var selectedText = selection;
	    var div = $('.highlightMenu');
	    if (selectedText) {

		    var range 			= selection.getRangeAt(0),         // the range at first selection group
		    rect 				= range.getBoundingClientRect(); 		// and convert this to useful data

		    //get the top location for the tool tip. 
		    var top 			= (rect.top + window.scrollY) - 45;
		    //get the left location for the tool tip. 
		    var left 			= rect.left + window.scrollX  - 48.5 + (rect.width / 2);

			/*IF TOOLTIP TOP VALUE < 0, MAKE THE TOOLTIP 
			SHOW BELOW THE TEXT AND CHANGE THE LOCATION OF THE POINTER*/

			if(top < 0) {
				if(rect.height > 80) {
					console.log("geater")
					var top = (rect.top + window.scrollY) + (rect.height - 45);
				} else {
					var top = (rect.top + window.scrollY) - (rect.height - 45);
				}
				
				$('.highlightMenu .highlightMenu-arrowClip')
				.attr('style', 'top: -10px;clip: rect(0px 18px 10.8px 1);');
			} else {
				$('.highlightMenu .highlightMenu-arrowClip')
				.attr('style', '');
			}

			/*if the toolbar is showing *above the visible window, move it into view*/

			/*if the toolbar is showing *below the visible window, move it into view*/

		    // set coordinates for the tooltip and add the active class
			$(div).addClass('highlightMenu--active in');
			$(div).css({
				"top": top + 'px', 
				"left":  left + 'px', 
				"opacity": 1
			});
			$('.pencil').click(function(){
				$('.modal-title').text('Write something about this');
			});
			$('.twitter').click(function(){
				//$('.modal-content').html("<iframe src=\"https://twitter.com/intent/tweet?text="+selection+"</iframe>");
			});


			$('.facebook').click(function(){
				$('.modal-title').text('Share it on facebook')
			});
            if ($('.modal-backdrop.fade.in').length < 1) {
			    $('.modal-body .text-field').text(selectedText);
                $('.modal-body .grey')
                .text(window.location.hostname)
                .attr('href', window.location.href);
            }
	    }
	}
	/*ACTIVATE TOOLTIP - END*/

	//when the winow size changes, we need to re-run 
	//the code to find the location of the selected text
	$(window).resize(function(){
		if (sel && sel.toString().length > 1) {
			activateToolTip()
		}
	});

		//if the tooltip is active, and the body is clicked, we hide the tool tip
        var nofire = document.getElementsByClassName("button--highlightMenu");
        for (var i = 0; i < nofire.length; ++i) {
            nofire[i].addEventListener("mousedown", function(e) {
                e.stopPropagation();
            }, true);
        }

	function event() {
		if (sel && sel.toString().length > 1) {
			//removeToolTip()
			activateToolTip()
		}
	}
	//.nodeType === 3

	document.onmouseup = event;
	document.onkeyup = event;
//}());

//plugin to check to see if an element has a specific style
(function ($) {
    $.fn.inlineStyle = function (prop) {
        return this.prop("style")[$.camelCase(prop)];
    };
}(jQuery));

//Returns value of "opacity" property or `undefined`
var opacity = $(".highlightMenu").inlineStyle("opacity");
document.body.addEventListener("mousedown", function(e) {
	opacity = $(".highlightMenu").inlineStyle("opacity");
	if (opacity == 1) {
		$('.highlightMenu').css('opacity', 0);
        setTimeout(function(){
			$('.highlightMenu').removeClass('highlightMenu--active');
		}, 200);
		console.log('removed from plugin');
	}
}, false);
// END - style check

//$(window).on('DOMContentLoaded load resize scroll', isElementVisible(el)); 
}());

