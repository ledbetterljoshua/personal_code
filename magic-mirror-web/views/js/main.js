jQuery.fn.updateWithText = function(text, speed)
{
	var dummy = $('<div/>').html(text);

	if ($(this).html() != dummy.html())
	{
		$(this).fadeOut(speed/2, function() {
			$(this).html(text);
			$(this).fadeIn(speed/2, function() {
				//done
			});
		});
	}
}

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

function roundVal(temp)
{
	return Math.round(temp * 10) / 10;
}

jQuery(document).ready(function($) {

	var eventList = [];

	var lastCompliment;
	var compliment;

    moment.locale(config.lang);

	//connect do Xbee monitor
	// var socket = io.connect('http://rpi-alarm.local:8082');
	// socket.on('dishwasher', function (dishwasherReady) {
	// 	if (dishwasherReady) {
	// 		$('.dishwasher').fadeIn(2000);
	// 		$('.lower-third').fadeOut(2000);
	// 	} else {
	// 		$('.dishwasher').fadeOut(2000);
	// 		$('.lower-third').fadeIn(2000);
	// 	}
	// });

	version.init();

	time.init();

	// calendar.init();

	weather.init();

	//news.init();

	var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Lietuvių',        ['lt-LT']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenščina',     ['sl-SI']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['Ελληνικά',        ['el-GR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['Українська',      ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['हिन्दी',            ['hi-IN']],
 ['ภาษาไทย',         ['th-TH']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 7;
updateCountry();
select_dialect.selectedIndex = 6;

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}


var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var unknownAnswers = ["I don't know what you meant by that. Can you say that again?", 
"I'm sorry, can you repeat that?", 
"I seem to be having some trouble hearing you, can you say that once more please?", 
"I didn't quite catch that I'm afraid. Tell me again."];
var dinnerChoices = ["chicken and potatoes", "meatloaf", "steak"];

var vars = {
    "known": false,
    "regexp": {
        "say": /^say (.+)$/i,
        "news": /^(what is|what's)( on)? the (news|trending)/i,
        "ask": /^ask me how old I am (.+)$/i,
        "time": /^(what is|what's|whats|what)( the)? time( is it)?( now)?$/i,
        "name": /^(What( is|'s|s) your name|Who are you)$/i,
        "badword": /(fuck|shit|bitch|ass)/i,
        "hi": /^(hi|hello|what(')?s up)$/i,
        "dinner": /^(what's|whats|what)( should I have|should I eat)? for dinner( now)?$/i
    }
}

var name,
	age;

function main(speachFinal) {
    var txt = speachFinal,
        reg = vars.regexp;
    print(txt, false);
    for (var key in reg) {
        if (reg[key].test(txt) && txt != "") {
            var match = txt.match(reg[key])[1];
            switch (key) {
            case "say":
                print(match, true);
                known();
                break;
            case "news":
                print("getting you the news now..", true);
                news.init();
                known();
                break;
            case "dinner":
                print("How about "+dinnerChoice+"?", true);
                known();
                break;
            case "askName":
                print("What should I call you?", true);
                known();
                break;
            case "time":
                print("The time is " + new Date() + ".", true);
                known();
                break;
            case "name":
                print("Who me? I am Siri!", true);
                known();
                break;
            case "badword":
                print("Hey! Watch your language!", true);
                known();
                break;
            case "hi":
                print("Hi there!", true);
                known();
                break;
            }
        }
    }
    if (!vars.known) {
		var unknownAnswer = unknownAnswers[Math.floor(Math.random()*unknownAnswers.length)];
        print(unknownAnswer, true)
    }
	reset();
}


function print(txt, siri) {
    var ele = $("<li class='dialog ChatLog__entry'></li>").wrapInner("<p class='ChatLog__message'>"+txt+"</p>").appendTo("#results").css("opacity", 0).animate({
        "opacity": 1
    }, 700);
    if (siri) {
        ele.addClass("siri");
    } else {
        ele.addClass("ChatLog__entry_mine");
    }
}

function known(ask) {
    vars.known = true
}

function reset() {
    vars.txt = "";
    vars.known = false;
    $("input").attr("value", "").blur();
    $("#results").animate({ scrollTop: $('#results').prop("scrollHeight")}, 1000);
    $('canvas').hide(100);
}



if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en';

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
      } else {
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    startButton(event);
    console.log("ended, restarting")
    $('canvas').hide(100);
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    $('canvas').show(100);
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      console.log('im guessing recognition.onend = null;')
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        console.log(event.results);

        main(event.results[i][0].transcript);

      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
  };
}


var commands = function() {
	if (event.results[i][0].transcript.indexOf("play") > -1) {
        	console.log("hi there, JOSHUA")
    }
}


function upgrade() {
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}


function startButton(event) {
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = true;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  showButtons('none');
  start_timestamp = event.timeStamp;
}
startButton(event);


var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
}
$('canvas').hide();

});
