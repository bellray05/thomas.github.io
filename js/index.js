

jQuery(document).ready(function(){
  $(window).scroll(function(e){
  	parallaxScroll();
	});
	 
	function parallaxScroll(){
		var scrolled = $(window).scrollTop();
		$('#parallax-bg-1').css('top',(0-(scrolled*.35))+'px');
		$('#parallax-bg-2').css('top',(0-(scrolled*.4))+'px');
		$('#parallax-bg-3').css('top',(0-(scrolled*.35))+'px');
	}
 
 });
/*
something else
*/
jQuery(document).ready(function ($) {

  $('#checkbox').change(function(){
    setInterval(function () {
        moveRight();
    }, 3000);
  });
  
	var slideCount = $('#slider ul li').length;
	var slideWidth = $('#slider ul li').width();
	var slideHeight = $('#slider ul li').height();
	var sliderUlWidth = slideCount * slideWidth;
	
	$('#slider').css({ width: slideWidth, height: slideHeight });
	
	$('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	
    $('#slider ul li:last-child').prependTo('#slider ul');

    function moveLeft() {
        $('#slider ul').animate({
            left: + slideWidth
        }, 200, function () {
            $('#slider ul li:last-child').prependTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    function moveRight() {
        $('#slider ul').animate({
            left: - slideWidth
        }, 200, function () {
            $('#slider ul li:first-child').appendTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };

    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });

});  


var rafId = null;
var delay = 400;
var lTime = 0;

function scroll() {
  var scrollTop = $(window).scrollTop();
  var height = $(window).height()
  var visibleTop = scrollTop + height;
  $('.reveal').each(function() {
    var $t = $(this);
    if ($t.hasClass('reveal_visible')) { return; }
    var top = $t.offset().top;
    if (top <= visibleTop) {
      if (top + $t.height() < scrollTop) {
        $t.removeClass('reveal_pending').addClass('reveal_visible');
      } else {
        $t.addClass('reveal_pending');
        if (!rafId) requestAnimationFrame(reveal);  
      }
    }
  });
}
function reveal() {
  rafId = null;
  var now = performance.now();
  
  if (now - lTime > delay) {
    lTime = now;
    var $ts = $('.reveal_pending');
    $($ts.get(0)).removeClass('reveal_pending').addClass('reveal_visible');  
  }
  
  
  if ($('.reveal_pending').length >= 1) rafId = requestAnimationFrame(reveal);
}

$(scroll);
$(window).scroll(scroll);
$(window).click(function() {
  $('.reveal').removeClass('reveal_visible').removeClass('reveal_pending');
  lTime = performance.now() + 500;
  var top = $(window).scrollTop();
  $(window).scrollTop(top === 0 ? 1 : top-1);
});

// Debounce
function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}

// Get siblings
var getSiblings = function (elem) {
  var siblings = [];
  var sibling = elem.parentNode.firstChild;
  for ( ; sibling; sibling = sibling.nextSibling ) {
      if ( sibling.nodeType === 1 && sibling !== elem ) {
          siblings.push( sibling );
      }
  }
  return siblings;
};

var Slideshow = function() {
  
  var 
    slideshow,
    slideList,
    slides,
    totalSlides,
    navNext,
    navPrev,
    clickCount,
    slideWidth,
    dots;
  
  var _init = function() {
    slideshow       = document.querySelector('.slideshow');
    slideList       = document.querySelector('.slideshow__list');
    navNext         = document.querySelector('.slideshow__nav--next');
    navPrev         = document.querySelector('.slideshow__nav--prev');
    slides          = document.querySelectorAll('.slideshow__item');
    slides          = Array.prototype.slice.call(slides);
    totalSlides     = slides.length;
    clickCount      = 0;
    
    _resize();
    _addEventHandlers();
    _setActiveNav();    
    _dotNav();
    _thumbNav();
    _setActiveDot(clickCount);    
    _setActivePagination(clickCount)
  }
  
  var _addEventHandlers = function() {
    navNext.addEventListener('click', _slideNext, false);
    navPrev.addEventListener('click', _slidePrev, false);
    window.addEventListener('resize', _resize, false);
  }
  
  var _dotNav = function() {
    var dotNav = document.createElement('ul');
    dotNav.classList.add('dotNav');
    slideshow.appendChild(dotNav);    
    slides.forEach(function(element, index) {
      _createDots(dotNav);
    });    
    _clickDots();
  }  
  
  var _createDots = function(dotNav) {
    var dot = document.createElement("li");
    dot.classList.add('dotNav__item');
    dotNav.appendChild(dot)
  }
  
  var _clickDots = function() {
    var dots = document.querySelectorAll('.dotNav__item');
    dots = Array.prototype.slice.call(dots);
    dots.forEach(function(element,index) {      
      element.addEventListener('click', _clickPagination.bind(null,element, index), false); 
    });
  }
  
  var _clickPagination = function(element, index) {  
    var siblings = getSiblings(element);
    siblings = Array.prototype.slice.call(siblings);    
    siblings.forEach(function(element) {
      element.classList.remove('is-active');      
    })  
    _setTransform(slideWidth, index);
    clickCount = index;
    if(clickCount === index) {
      element.classList.add('is-active');
    }
    _setActiveNav();
    _setActiveDot(index);
    _setActivePagination(index);
  }
  
  var _getDots = function() {
    var dots = document.querySelectorAll('.dotNav__item');
    dots = Array.prototype.slice.call(dots);    
    return dots;
  }
  
  var _setActiveDot = function(count) {
    var dots = _getDots();
    dots.forEach(function(element, index) {
      element.classList.remove('is-active');
      if(index === count) {
        element.classList.add('is-active');
      }
    })
  }
  
  var _setActiveNav = function() {
    if(clickCount === 0) {      
      navPrev.classList.add('is-inactive');
      navPrev.classList.remove('is-active');
      navNext.classList.add('is-active');
    } else {
      navPrev.classList.add('is-active');
    }
  }
  
  var _slideNext = function() {    
    clickCount++;    
    if(clickCount >= totalSlides) {
      clickCount = 0;
    }
    _setTransform(slideWidth, clickCount);
    _setActiveNav();
    _setActiveDot(clickCount);    
    _setActivePagination(clickCount);
  }
  
  var _slidePrev = function() {
    if(clickCount > 0 ) {
      clickCount--;      
      _setTransform(slideWidth, clickCount);
    }
    _setActiveNav();
    _setActiveDot(clickCount);
    _setActivePagination(clickCount);
  }
  
  var _thumbNav = function() {
    var thumbWrap = document.createElement('ul');
    thumbWrap.classList.add('slideshow__thumbs');
    slideshow.appendChild(thumbWrap);
    slides.forEach(function(element, index) {
      _createThumbs(element, thumbWrap);
    })
    _clickThumbs();
  }
  
  var _createThumbs = function(element, thumbWrap) {
    var thumbSrc = element.getAttribute('data-src');
    var thumb = document.createElement('li');
    thumb.classList.add('slideshow__thumbsItem')
    thumb.style.backgroundImage = 'url('+thumbSrc+')';
    thumbWrap.appendChild(thumb);      
  }
  
  var _clickThumbs = function() {
    var thumbs = document.querySelectorAll('.slideshow__thumbsItem');
    thumbs = Array.prototype.slice.call(thumbs);
    thumbs.forEach(function(element, index) {      
      element.addEventListener('click', _clickPagination.bind(null,element, index), false); 
    })
  }
  
  var _setActivePagination = function(count) {
    var thumbs = document.querySelectorAll('.slideshow__thumbsItem');
    thumbs = Array.prototype.slice.call(thumbs);
    thumbs.forEach(function(element, index) {
      element.classList.remove('is-active');
      if(index === count) {
        element.classList.add('is-active');
      }
    })    
  }
  
  var _setTransform = function(value, multiplier) {   
    var transformValue = value * multiplier;
    slideList.style['-webkit-transform'] = 'translateX(-'+transformValue+'px)';
		slideList.style['-moz-transform'] = 'translateX(-'+transformValue+'px)';
		slideList.style['-ms-transform'] = 'translateX(-'+transformValue+'px)';
		slideList.style['-o-transform'] = 'translateX(-'+transformValue+'px)';
		slideList.style['transform'] = 'translateX(-'+transformValue+'px)';
  }
  
  var _resize = debounce(function() {    
    slideWidth = slideshow.offsetWidth;
    _setTransform(slideWidth, clickCount);
  }, 50);
  
  return {
    init: _init
  }
}();

Slideshow.init();