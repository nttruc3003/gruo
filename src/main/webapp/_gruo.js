/* Copyright (c) 2024 Aviado Inc. All rights reserved. */

$(document).ready(function() {
	$('title').html(TITLE);
	
	var html = '<div id="moeco" class="mopos main screen" style="display:none"></div>';
	$('body>div').html(html);
	
	$.ajaxSetup({ cache: false });

	resize();
	$(window).resize(resize);
	
	moeco.load(function() {
		go('moeco');
	});
});

var go = function(name, options) {
	$('.main').hide();
	$('#'+name).show();
	window[name].render(options);
};

var resize = function() {
	var w = $(window).width();
	var h = $(window).height();
	if (h > w)
		h = w;
	$('body>div').css('height', h+'px');
	document.body.style.fontSize = '1.2vw';
};

/*
 * utils
 */

var VERSION = '1.0.0-022024';
var TITLE = 'G R U O';
var COPY = '&copy; 2024 Aviado Inc. All rights reserved.';

var eventtype = function(type) { // 'click', 'start', 'move', 'end'
	return {'click':'click', 'start':'mousedown touchstart', 'move':'mousemove touchmove', 'end':'mouseup touchend'}[type];
};

/*
 * clouch
 */

var clouch = function(selector, handler) {
	$(document).on(eventtype('click'), selector, function(e) {
		handler(e.currentTarget, e);
	});
};

var clouchex = function(selector, start, move, end) {
	var getxy = function(e) {
		var e0 = e.originalEvent || e;
	    if (e0.touches) {
		    clouchex.x = e0.touches[0].pageX;
		    clouchex.y = e0.touches[0].pageY;
	    }
	    else {
		    clouchex.x = e0.pageX;
		    clouchex.y = e0.pageY;
	    }    	
	};
	
	$(document).on(eventtype('start'), selector, function(e) {
	    e.preventDefault();
	    getxy(e);
	    start(e.currentTarget, clouchex.x, clouchex.y);
	    $(document).on(eventtype('move'), function(e) {
	        e.preventDefault();
		    getxy(e);
	        move(e.currentTarget, clouchex.x, clouchex.y);
	    });
		$(document).on(eventtype('end'), function(e) {
		    e.preventDefault();
		    $(document).off(eventtype('move'));
		    //$(document).on(eventtype('move'), function(e) { e.preventDefault(); });
		    $(document).off(eventtype('end'));
		    end(e.currentTarget, clouchex.x, clouchex.y);
		});
	});
};

var getat = function(clasz, x, y) {
	var elem = document.elementFromPoint(x, y);
	if ($(elem).hasClass(clasz))
		return $(elem);
	elem = $('.'+clasz).has(elem);
	return elem.hasClass(clasz) ? elem : undefined;
};

var coin = function(x, y) {
	var coin = $('#coin');
	if (x == undefined || y == undefined) {
		coin.css({top:-coin.height(), left:-coin.width()});
		coin.hide();		
	}
	else {
		coin.css({top:y-coin.height()/2, left:x-coin.width()/2});
		coin.show();
	}
};
