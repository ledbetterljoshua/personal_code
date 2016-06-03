//medium.com style toolTip 

//$(function(){

	//initial variables
	var toolBarCreated = false,
		selection = window.getSelection(),    
		sel = window.getSelection && window.getSelection(),
		panel = {};
		panel.visible = false;
		panel.hovered = false;
	var starterId = 0;
	var acceptedNodes = [
		'#text', 
		'P', 
		'SPAN', 
		'PRE'
	]

	function getSelectionText() {
	    var text = "";
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	}
	var ID = function() {
		starterId++
		return starterId;
	}

	function getNode(){
		var ranges = [];
		sel = window.getSelection();
		for(var i = 0; i < sel.rangeCount; i++) {
		 ranges[i] = sel.getRangeAt(i);
		}
    return ranges[0].commonAncestorContainer.nodeName
	}


	var highLight = function() {       
	    var selection = window.getSelection().getRangeAt(0);
	    var selectedText = selection.extractContents();
	    var span = document.createElement("span");
	    span.style.backgroundColor = "yellow";
	    span.id = "__highlight__" + ID();
	    span.appendChild(selectedText);
	    selection.insertNode(span);
    }

	var createPanel = function() {
		var input 			= document.createElement('input');
			input.id 		= "highlight"; 
			input.type 		= "button";
		var div 			= document.createElement('div'); 
		var hover 			= document.createElement('div'); 
		hover.className 	=  "__bottom_panel_hover__"
		div.className 		= "__bottom_panel__"; 
		$(div)
		.wrapInner('<div class="__bottom_panel_actions__"></div>')
		.wrapInner('<div class="__bottom_panel_content__ __row__"></div>')
		.wrapInner('<div class="__bottom_panel_container__"></div>');
		document.body.appendChild(hover); 
		document.body.appendChild(input);
		document.body.appendChild(div);  

		$('.__bottom_panel_actions__')
		.append('<button type="submit" class="btn btn-success hidden" id="highlight-id"><i id="highlightG" class="fa fa-underline" value="highLight"></i></button>');         
 
		$('input#highlight').attr('onclick', 'highLight()');
		$('input#highlight').wrap('<form id="submit_this">');
		panelCreated = true;
	} 
	createPanel();

	var showHighlight = function() {
		if (acceptedNodes.indexOf(getNode()) > -1) {
			$('#highlight-id').removeClass('hidden');
		} else if (acceptedNodes.indexOf(getNode()) == -1) {
			$('#highlight-id').addClass('hidden');
		} else {
			console.log("showHighlight doing nothing")
		}
		console.log(window.location.href);
		console.log(getSelectionText())
	}

	/*ACTIVATE TOOLTIP - BEGIN*/
	var showToolbar = function(fn) {
	    if (sel && sel.toString().length > 1) {
		    show();
			fn();
	    } else if (panel.hovered) {
	  //   	show();
			// console.log('show hovered');
			// fn();
			$('.__bottom_panel__').attr('style', 'height:52px;');
	    } else {
	    	hide();
	    }
	}

	if (panel.visible || panel.hovered) {
		$('.__bottom_panel__').attr('style', 'height:52px;');
	} else {
		$('.__bottom_panel__').attr('style', '');
	}

	var show = function() {
		panel.visible = true;
	}
	var hide = function() {
		panel.visible = false;
	}

	$('.__bottom_panel_hover__').mouseenter(function(){
		panel.hovered = true;
		show();
		event()
	});
	$('.__bottom_panel_hover__').mouseleave(function(){
		panel.hovered = false;
		hide();
	});
	$('.__bottom_panel_actions__').mouseenter(function(){
		show();
	});
	$('.__bottom_panel_actions__').mouseleave(function(){
		hide();
	});
	$('#highlight-id').click(function(event){
		highLight()
    	return false;
	});

	var lastScrollTop = 0;
	$(window).scroll(function(event){
	   var st = $(this).scrollTop();
	   if (st > (lastScrollTop)){
	       $('.__bottom_panel__').attr('style', '');
	   } 
	   lastScrollTop = st + 20;
	});




	//if the tooltip is active, and the body is clicked, we hide the tool tip
    var nofire = document.getElementsByClassName("__bottom_panel__");
    for (var i = 0; i < nofire.length; ++i) {
        nofire[i].addEventListener("mousedown", function(e) {
            e.stopPropagation();
        }, true);
    }

	function event() {
		//if (sel && sel.toString().length > 1) {
			showToolbar(showHighlight)
			if (panel.visible) {
				$('.__bottom_panel__').attr('style', 'height:52px;');
			} else {
				$('.__bottom_panel__').attr('style', '');
			}
		//}
	}
	//.nodeType === 3

	document.onmouseup = event;
	document.onkeyup = event;



	var plus = document.createElement('div'); 
	plus.className = "plus";
	document.body.appendChild(plus);  
	var pTag;
	$('.plus').hide();

	$('.plus').hover(function(){
		$(this).css({"display": "block"});
	}, function(){
		$(this).css({"display": "none"});
	});

	$("p").each(function () {
		$(this).hover(function(){
			pTag = $(this);
			var pos = $(this).position();  
			var width = $(this).width();
			var height = $(this).height();
			var marginTop = parseInt($(this).css('margin-top'));

			plus = $('.plus');
			plus.show(); 
			plus.css({"height": height, "left": (pos.left + width + 20) + "px","top":(pos.top + 20) + "px", "margin": $(this).css('margin'), "margin-top": $(this).css('margin-top'),"margin-left": $(this).css('margin-left'),"margin-right": $(this).css('margin-right'),"margin-bottom": $(this).css('margin-bottom'), "padding": $(this).css('padding'), "padding-top": $(this).css('padding-top'),"padding-left": $(this).css('padding-left'),"padding-right": $(this).css('padding-right'),"padding-bottom": $(this).css('padding-bottom') 
			});

		}, function() {
			plus.hide(); 
		});

	});
	$('.plus').click(function(){
		$(pTag).css({"margin-right":"150px"});
	});



//}());