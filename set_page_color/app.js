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
			div.className 		= "highlightMenu";    
			div.style.position 	= 'absolute';               	
			div.style.width 	= 97 + 'px';
			$(div)
			.wrapInner('<div class="highlightMenu-inner"></div>')
			.wrapInner('<div class="buttonSet buttonSet--highlightMenu"></div>')
			.append('<div class="highlightMenu-arrowClip"><span class="highlightMenu-arrow"></span></div>')
			$(div).find('.highlightMenu-inner')
			.append('<button class="button button--chromeless button--withIcon button--highlightMenu js-highlightMenuQuoteButton" data-toggle="modal" data-target="#myModal"><span class="fa fa-pencil"></span></button>')
			.append('<button class="button button--chromeless button--withIcon button--highlightMenu twitter" data-toggle="modal" data-target="#myModal"><span class=" fa fa-twitter"></span></button>')
			.append('<button class="button button--chromeless button--withIcon button--highlightMenu button--highlightMenuNotes" data-toggle="modal" data-target="#myModal"><span class=" fa fa-facebook"></span></button>');
			$(div).attr('id', 'highlightMenu');
			document.body.appendChild(div);           
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

		    /*WRITE CODE*/
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

		    // set coordinates for the tooltip and add the active class
			$(div).addClass('highlightMenu--active');
			$(div).css('top', top + 'px');       		
			$(div).css('left', left + 'px');
			$(div).css('opacity', 1);

			$('.modal-body input').val(selectedText)
	    }
	}
	/*ACTIVATE TOOLTIP - END*/

	//function to remove/hide the tooltip when needed
	function removeToolTip() {
			$('.highlightMenu.highlightMenu--active').css('opacity', 0);
			console.log('removed');
	}

	//when the winow size changes, we need to re-run 
	//the code to find the location of the selected text
	$(window).resize(function(){
		activateToolTip()
	});

		//if the tooltip is active, and the body is clicked, we hide the tool tip
        var nofire = document.getElementsByClassName("button--highlightMenu");
        for (var i = 0; i < nofire.length; ++i) {
            nofire[i].addEventListener("mousedown", function(e) {
                e.stopPropagation();
            }, true);
        }
        //if the buttons within the tooltip are clicked, we do nothing
        document.body.addEventListener("mousedown", function(e) {
	 		if (sel && sel.toString().length > 0) {
				removeToolTip()
			}
        }, false);

	function event() {
		if (sel && sel.toString().length > 0) {
			removeToolTip()
			activateToolTip()
		}
	}

	document.onmouseup = event;
	document.onkeyup = event;
}());



/*To get the selected HTML as a string, you can use the following function:
USE TO GET THE SRC FOR AN IMAGE
function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}*/

