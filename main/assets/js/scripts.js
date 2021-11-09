// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_accordion
// Usage: codyhouse.co/license
(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
		this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
		this.showClass = 'accordion'+this.version+'__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init accordion
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
			Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
			Util.addClass(button, 'js-accordion__trigger');
			Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
		}

		//listen for Accordion events
		this.initAccordionEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool, false);

		if(!bool && this.deepLinkOn) {
			history.replaceState(null, '', '#'+trigger.getAttribute('aria-controls'));
		}
	};

	Accordion.prototype.animateAccordion = function(trigger, bool, deepLink) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) Util.addClass(item, this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);
		self.resetContentVisibility(item, content, bool);

		if( !this.multiItems && !bool || deepLink) this.closeSiblings(item);
	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		Util.toggleClass(item, this.showClass, !bool);
		content.removeAttribute("style");
		if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport 
			this.moveContent();
		}
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Util.getIndexInArray(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(Util.hasClass(this.items[i], this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true, false);
				return false;
			}
		}
	};

	Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
		var openAccordion = this.element.getElementsByClassName(this.showClass);
		if(openAccordion.length == 0) return;
		var boundingRect = openAccordion[0].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
	};

	Accordion.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		if(!hash || hash == '') return;
		var trigger = this.element.querySelector('.js-accordion__trigger[aria-controls="'+hash+'"]');
		if(trigger && trigger.getAttribute('aria-expanded') !== 'true') {
			this.animateAccordion(trigger, false, true);
			setTimeout(function(){trigger.scrollIntoView(true);});
		}
	};

	window.Accordion = Accordion;
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());
// File#: _1_adaptive-navigation
// Usage: codyhouse.co/license
(function() {
  var AdaptNav = function(element) {
    this.element = element;
    this.list = this.element.getElementsByClassName('js-adapt-nav__list')[0];
    this.items = this.element.getElementsByClassName('js-adapt-nav__item');
    this.moreBtn = this.element.getElementsByClassName('js-adapt-nav__item--more')[0];
    this.dropdown = this.moreBtn.getElementsByTagName('ul')[0];
    this.dropdownItems = this.dropdown.getElementsByTagName('a');
    this.dropdownClass = 'adapt-nav__dropdown--is-visible';
    this.resizing = false;
    // check if items already outrun nav
    this.outrunIndex = this.items.length;
    // reset alignment
    this.resetAlignment = Util.hasClass(this.list, 'justify-end');
    initAdaptNav(this);
  };

  function initAdaptNav(nav) {
    nav.resizing = true;
    resetOutrun(nav, '', true); // initially hide all elements
    resetAdaptNav.bind(nav)(); // reset navigation based on available space

    // listen to resize
    window.addEventListener('resize', function(event){
      if(nav.resizing) return;
      nav.resizing = true;
      window.requestAnimationFrame(resetAdaptNav.bind(nav));
    });

    // wait for font to be loaded
    if(document.fonts) {
      document.fonts.ready.then(function() {
        if(nav.resizing) return;
        nav.resizing = true;
        window.requestAnimationFrame(resetAdaptNav.bind(nav));
      });
    }

    /* dropdown behaviour */
    // init aria-labels
		Util.setAttributes(nav.moreBtn, {'aria-expanded': 'false', 'aria-haspopup': 'true', 'aria-controls': nav.dropdown.getAttribute('id')});
    
    // toggle dropdown on click
    nav.moreBtn.addEventListener('click', function(event){
      if( nav.dropdown.contains(event.target) ) return;
			event.preventDefault();
			toggleMoreDropdown(nav, !Util.hasClass(nav.dropdown, nav.dropdownClass), true);
    });

    // keyboard events 
		nav.dropdown.addEventListener('keydown', function(event) {
			// use up/down arrow to navigate list of menu items
			if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
				navigateItems(nav, event, 'next');
			} else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
				navigateItems(nav, event, 'prev');
			}
    });

		window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) { //close dropdown if focus is outside dropdown element
				if (!nav.moreBtn.contains(document.activeElement)) toggleMoreDropdown(nav, false, false);
			} else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {// close menu on 'Esc'
        toggleMoreDropdown(nav, false, false);
			} 
		});
    
    // close menu when clicking outside it
		window.addEventListener('click', function(event){
			if( !nav.moreBtn.contains(event.target)) toggleMoreDropdown(nav, false);
		});
  };

  function resetAdaptNav() { // reset nav appearance
    var totalWidth = getListWidth(this.list),
      moreWidth = getFullWidth(this.moreBtn),
      maxPosition = totalWidth - moreWidth,
      cloneList = '',
      hideAll = false;

    // take care of possible right alignment
    if(this.resetAlignment) Util.removeClass(this.list, 'justify-end');

    cloneList = resetOutrun(this, cloneList, false);
    // loop through items -> create clone (if required) and append to dropdown
    for(var i = 0; i < this.outrunIndex; i++) {
      if( Util.hasClass(this.items[i], 'is-hidden')) {
        Util.addClass(this.items[i], 'adapt-nav__item--hidden');
        Util.removeClass(this.items[i], 'is-hidden');
      }
      var right = this.items[i].offsetWidth + this.items[i].offsetLeft + parseFloat(window.getComputedStyle(this.items[i]).getPropertyValue("margin-right"));
      if(right >= maxPosition || hideAll) {
        var clone = this.items[i].cloneNode(true);
        cloneList = cloneList + modifyClone(clone);
        Util.addClass(this.items[i], 'is-hidden');
        hideAll = true;
      } else {
        Util.removeClass(this.items[i], 'is-hidden');
      }
      Util.removeClass(this.items[i], 'adapt-nav__item--hidden');
    }

    if(this.resetAlignment) Util.addClass(this.list, 'justify-end');

    Util.toggleClass(this.moreBtn, 'adapt-nav__item--hidden', (cloneList == ''));
    this.dropdown.innerHTML = cloneList;
    Util.addClass(this.element, 'adapt-nav--is-visible');
    this.outrunIndex = this.items.length;
    this.resizing = false;
  };

  function resetOutrun(nav, cloneList, bool) {
    if(nav.items[0].offsetLeft < 0 || (bool && nav.outrunIndex > 1)) {
      nav.outrunIndex = nav.outrunIndex - 1;
      var clone = nav.items[nav.outrunIndex].cloneNode(true);
      Util.addClass(nav.items[nav.outrunIndex], 'is-hidden');
      cloneList = modifyClone(clone) + cloneList;
      return resetOutrun(nav, cloneList, bool);
    } else {
      if(bool) nav.outrunIndex = nav.items.length;
      return cloneList;
    }
  };

  function getListWidth(list) { // get total width of container minus right padding
    var style = window.getComputedStyle(list);
    return parseFloat(list.getBoundingClientRect().width) - parseFloat(style.getPropertyValue("padding-right"));
  };

  function getFullWidth(item) { // get width of 'More Links' button
    return parseFloat(window.getComputedStyle(item).getPropertyValue("width"));
  };

  function toggleMoreDropdown(nav, bool, moveFocus) { // toggle menu visibility
    Util.toggleClass(nav.dropdown, nav.dropdownClass, bool);
		if(bool) {
			nav.moreBtn.setAttribute('aria-expanded', 'true');
			Util.moveFocus(nav.dropdownItems[0]);
      nav.dropdown.addEventListener("transitionend", function(event) {Util.moveFocus(nav.dropdownItems[0]);}, {once: true});
      placeDropdown(nav);
		} else {
			nav.moreBtn.setAttribute('aria-expanded', 'false');
      if(moveFocus) Util.moveFocus(nav.moreBtn.getElementsByTagName('button')[0]);
      nav.dropdown.style.right = '';
		}
  };

  function placeDropdown(nav) { // make sure dropdown is visible the viewport
    var dropdownLeft = nav.dropdown.getBoundingClientRect().left;
    if(dropdownLeft < 0) nav.dropdown.style.right = (dropdownLeft - 4)+'px';
  };

  function navigateItems(nav, event, direction) { // navigate through dropdown items
    event.preventDefault();
		var index = Util.getIndexInArray(nav.dropdownItems, event.target),
			nextIndex = direction == 'next' ? index + 1 : index - 1;
		if(nextIndex < 0) nextIndex = nav.dropdownItems.length - 1;
		if(nextIndex > nav.dropdownItems.length - 1) nextIndex = 0;
		Util.moveFocus(nav.dropdownItems[nextIndex]);
  };
  
  function modifyClone(clone) { // assign new classes to cloned elements inside the dropdown
    Util.addClass(clone, 'adapt-nav__dropdown-item');
    Util.removeClass(clone, 'js-adapt-nav__item is-hidden adapt-nav__item--hidden adapt-nav__item');
    var link = clone.getElementsByClassName('adapt-nav__link');
    if(link.length > 0) {
      Util.addClass(link[0], 'adapt-nav__dropdown-link js-tab-focus');
      link[0].style.outline = 'none';
      Util.removeClass(link[0], 'adapt-nav__link');
    }
    return clone.outerHTML;
  };

  //initialize the AdaptNav objects
  var adaptNavs = document.getElementsByClassName('js-adapt-nav'),
    flexSupported = Util.cssSupports('align-items', 'stretch');
	if( adaptNavs.length > 0) {
		for( var i = 0; i < adaptNavs.length; i++) {(function(i){
      if(flexSupported) new AdaptNav(adaptNavs[i]);
      else Util.addClass(adaptNavs[i], 'adapt-nav--is-visible');
    })(i);}
	}
}());
// File#: _1_alert
// Usage: codyhouse.co/license
(function() {
	var alertClose = document.getElementsByClassName('js-alert__close-btn');
	if( alertClose.length > 0 ) {
		for( var i = 0; i < alertClose.length; i++) {
			(function(i){initAlertEvent(alertClose[i]);})(i);
		}
	};
}());

function initAlertEvent(element) {
	element.addEventListener('click', function(event){
		event.preventDefault();
		Util.removeClass(element.closest('.js-alert'), 'alert--is-visible');
	});
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
	var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
	if( menuBtns.length > 0 ) {
		for(var i = 0; i < menuBtns.length; i++) {(function(i){
			initMenuBtn(menuBtns[i]);
		})(i);}

		function initMenuBtn(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
				Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
				// emit custom event
				var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_animated-headline
// Usage: codyhouse.co/license
(function() {
  var TextAnim = function(element) {
    this.element = element;
    this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
    this.words = this.element.getElementsByClassName('js-text-anim__word');
    this.selectedWord = 0;
    // interval between two animations
    this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
    // duration of single animation (e.g., time for a single word to rotate)
    this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
    // keep animating after first loop was completed
    this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
    this.wordInClass = 'text-anim__word--in';
    this.wordOutClass = 'text-anim__word--out';
    // check for specific animations
    this.isClipAnim = Util.hasClass(this.element, 'text-anim--clip');
    if(this.isClipAnim) {
      this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
      this.animPulseClass = 'text-anim__wrapper--pulse';
    }
    initTextAnim(this);
  };

  function initTextAnim(element) {
    // make sure there's a word with the wordInClass
    setSelectedWord(element);
    // if clip animation -> add pulse class
    if(element.isClipAnim) {
      Util.addClass(element.wordsWrapper[0], element.animPulseClass);
    }
    // init loop
    loopWords(element);
  };

  function setSelectedWord(element) {
    var selectedWord = element.element.getElementsByClassName(element.wordInClass);
    if(selectedWord.length == 0) {
      Util.addClass(element.words[0], element.wordInClass);
    } else {
      element.selectedWord = Util.getIndexInArray(element.words, selectedWord[0]);
    }
  };

  function loopWords(element) {
    // stop animation after first loop was completed
    if(!element.loop && element.selectedWord == element.words.length - 1) {
      return;
    }
    var newWordIndex = getNewWordIndex(element);
    setTimeout(function() {
      if(element.isClipAnim) { // clip animation only
        switchClipWords(element, newWordIndex);
      } else {
        switchWords(element, newWordIndex);
      }
    }, element.loopInterval);
  };

  function switchWords(element, newWordIndex) {
    // switch words
    Util.removeClass(element.words[element.selectedWord], element.wordInClass);
    Util.addClass(element.words[element.selectedWord], element.wordOutClass);
    Util.addClass(element.words[newWordIndex], element.wordInClass);
    // reset loop
    resetLoop(element, newWordIndex);
  };

  function resetLoop(element, newIndex) {
    setTimeout(function() { 
      // set new selected word
      Util.removeClass(element.words[element.selectedWord], element.wordOutClass);
      element.selectedWord = newIndex;
      loopWords(element); // restart loop
    }, element.transitionDuration);
  };

  function switchClipWords(element, newWordIndex) {
    // clip animation only
    var startWidth =  element.words[element.selectedWord].offsetWidth,
      endWidth = element.words[newWordIndex].offsetWidth;
    
    // remove pulsing animation
    Util.removeClass(element.wordsWrapper[0], element.animPulseClass);
    // close word
    animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
      // switch words
      Util.removeClass(element.words[element.selectedWord], element.wordInClass);
      Util.addClass(element.words[newWordIndex], element.wordInClass);
      element.selectedWord = newWordIndex;

      // open word
      animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
        // add pulsing class
        Util.addClass(element.wordsWrapper[0], element.animPulseClass);
        loopWords(element);
      });
    });
  };

  function getNewWordIndex(element) {
    // get index of new word to be shown
    var index = element.selectedWord + 1;
    if(index >= element.words.length) index = 0;
    return index;
  };

  function animateWidth(start, to, element, duration, cb) {
    // animate width of a word for the clip animation
    var currentTime = null;

    var animateProperty = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      
      var val = Math.easeInOutQuart(progress, start, to - start, duration);
      element.style.width = val+"px";
      if(progress < duration) {
          window.requestAnimationFrame(animateProperty);
      } else {
        cb();
      }
    };
  
    //set the width of the element before starting animation -> fix bug on Safari
    element.style.width = start+"px";
    window.requestAnimationFrame(animateProperty);
  };

  window.TextAnim = TextAnim;

  // init TextAnim objects
  var textAnim = document.getElementsByClassName('js-text-anim'),
    reducedMotion = Util.osHasReducedMotion();
  if( textAnim ) {
    if(reducedMotion) return;
    for( var i = 0; i < textAnim.length; i++) {
      (function(i){ new TextAnim(textAnim[i]);})(i);
    }
  }
}());
// File#: _1_back-to-top
// Usage: codyhouse.co/license
(function() {
  var backTop = document.getElementsByClassName('js-back-to-top')[0];
  if( backTop ) {
    var dataElement = backTop.getAttribute('data-element');
    var scrollElement = dataElement ? document.querySelector(dataElement) : window;
    var scrollDuration = parseInt(backTop.getAttribute('data-duration')) || 300, //scroll to top duration
      scrollOffsetInit = parseInt(backTop.getAttribute('data-offset-in')) || parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
      scrollOffsetOutInit = parseInt(backTop.getAttribute('data-offset-out')) || 0, 
      scrollOffset = 0,
      scrollOffsetOut = 0,
      scrolling = false;

    // check if target-in/target-out have been set
    var targetIn = backTop.getAttribute('data-target-in') ? document.querySelector(backTop.getAttribute('data-target-in')) : false,
      targetOut = backTop.getAttribute('data-target-out') ? document.querySelector(backTop.getAttribute('data-target-out')) : false;

    updateOffsets();
    
    //detect click on back-to-top link
    backTop.addEventListener('click', function(event) {
      event.preventDefault();
      if(!window.requestAnimationFrame) {
        scrollElement.scrollTo(0, 0);
      } else {
        dataElement ? Util.scrollTo(0, scrollDuration, false, scrollElement) : Util.scrollTo(0, scrollDuration);
      } 
      //move the focus to the #top-element - don't break keyboard navigation
      Util.moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
    });
    
    //listen to the window scroll and update back-to-top visibility
    checkBackToTop();
    if (scrollOffset > 0 || scrollOffsetOut > 0) {
      scrollElement.addEventListener("scroll", function(event) {
        if( !scrolling ) {
          scrolling = true;
          (!window.requestAnimationFrame) ? setTimeout(function(){checkBackToTop();}, 250) : window.requestAnimationFrame(checkBackToTop);
        }
      });
    }

    function checkBackToTop() {
      updateOffsets();
      var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
      if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
      var condition =  windowTop >= scrollOffset;
      if(scrollOffsetOut > 0) {
        condition = (windowTop >= scrollOffset) && (window.innerHeight + windowTop < scrollOffsetOut);
      }
      Util.toggleClass(backTop, 'back-to-top--is-visible', condition);
      scrolling = false;
    }

    function updateOffsets() {
      scrollOffset = getOffset(targetIn, scrollOffsetInit, true);
      scrollOffsetOut = getOffset(targetOut, scrollOffsetOutInit);
    }

    function getOffset(target, startOffset, bool) {
      var offset = 0;
      if(target) {
        var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
        if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
        var boundingClientRect = target.getBoundingClientRect();
        offset = bool ? boundingClientRect.bottom : boundingClientRect.top;
        offset = offset + windowTop;
      }
      if(startOffset && startOffset) {
        offset = offset + parseInt(startOffset);
      }
      return offset;
    }
  }
}());
// File#: _1_btn-slide-fx
// Usage: codyhouse.co/license
(function() {
  var BtnSlideFx = function(element) {
		this.element = element;
    this.hover = false; 
		btnSlideFxEvents(this);
	};

  function btnSlideFxEvents(btn) {
    btn.element.addEventListener('mouseenter', function(event){ // detect mouse hover
      btn.hover = true;
      triggerBtnSlideFxAnimation(btn.element, 'from');
    });
    btn.element.addEventListener('mouseleave', function(event){ // detect mouse leave
      btn.hover = false;
      triggerBtnSlideFxAnimation(btn.element, 'to');
    });
    btn.element.addEventListener('transitionend', function(event){ // reset btn classes at the end of enter/leave animation
      resetBtnSlideFxAnimation(btn.element);
    });
  };

  function getEnterDirection(element, event) { // return mouse movement direction
    var deltaLeft = Math.abs(element.getBoundingClientRect().left - event.clientX),
      deltaRight = Math.abs(element.getBoundingClientRect().right - event.clientX),
      deltaTop = Math.abs(element.getBoundingClientRect().top - event.clientY),
      deltaBottom = Math.abs(element.getBoundingClientRect().bottom - event.clientY);
    var deltaXDir = (deltaLeft < deltaRight) ? 'left' : 'right',
      deltaX = (deltaLeft < deltaRight) ? deltaLeft : deltaRight,
      deltaYDir = (deltaTop < deltaBottom) ? 'top' : 'bottom',
      deltaY = (deltaTop < deltaBottom) ? deltaTop : deltaBottom;
    return (deltaX < deltaY) ? deltaXDir : deltaYDir;
  };
  
  function triggerBtnSlideFxAnimation(element, direction) { // trigger animation -> apply in/out and direction classes
    var inStep = (direction == 'from') ? '-out' : '',
      outStep = (direction == 'from') ? '' : '-out';
    Util.removeClass(element, 'btn-slide-fx-hover'+inStep);
    resetBtnSlideFxAnimation(element);
    Util.addClass(element, 'btn--slide-fx-'+direction+'-'+getEnterDirection(element, event)); // set direction 
    setTimeout(function(){Util.addClass(element, 'btn-slide-fx-animate');}, 5); // add transition
    setTimeout(function(){Util.addClass(element, 'btn-slide-fx-hover'+outStep);}, 10); // trigger transition
  };

  function resetBtnSlideFxAnimation(element) { // remove animation classes
    Util.removeClass(element, 'btn--slide-fx-from-left btn--slide-fx-from-right btn--slide-fx-from-bottom btn--slide-fx-from-top btn--slide-fx-to-left btn--slide-fx-to-right btn--slide-fx-to-bottom btn--slide-fx-to-top btn-slide-fx-animate');
  };

	//initialize the BtnSlideFx objects
	var btnSlideFx = document.getElementsByClassName('js-btn--slide-fx');
	if( btnSlideFx.length > 0 ) {
		for( var i = 0; i < btnSlideFx.length; i++) {
      (function(i){new BtnSlideFx(btnSlideFx[i]);})(i);
		}
  }
}());
// File#: _1_choice-tags
// Usage: codyhouse.co/license
(function() {
  var ChoiceTags = function(element) {
    this.element = element;
    this.labels = this.element.getElementsByClassName('js-choice-tag');
    this.inputs = getChoiceInput(this);
    this.isRadio = this.inputs[0].type.toString() == 'radio';
    this.checkedClass = 'choice-tag--checked';
    initChoiceTags(this);
    initChoiceTagEvent(this);
  }

  function getChoiceInput(element) {
    var inputs = [];
    for(var i = 0; i < element.labels.length; i++) {
      inputs.push(element.labels[i].getElementsByTagName('input')[0]);
    }
    return inputs;
  };

  function initChoiceTags(element) {
    // if tag is selected by default - add checkedClass to the label element
    for(var i = 0; i < element.inputs.length; i++) {
      Util.toggleClass(element.labels[i], element.checkedClass, element.inputs[i].checked);
    }
  };

  function initChoiceTagEvent(element) {
    element.element.addEventListener('change', function(event) {
      var inputIndex = Util.getIndexInArray(element.inputs, event.target);
      if(inputIndex < 0) return;
      Util.toggleClass(element.labels[inputIndex], element.checkedClass, event.target.checked);
      if(element.isRadio && event.target.checked) resetRadioTags(element, inputIndex);
    });
  };

  function resetRadioTags(element, index) {
    // when a radio input is checked - reset all the others
    for(var i = 0; i < element.labels.length; i++) {
      if(i != index) Util.removeClass(element.labels[i], element.checkedClass);
    }
  };

  //initialize the ChoiceTags objects
	var choiceTags = document.getElementsByClassName('js-choice-tags');
	if( choiceTags.length > 0 ) {
		for( var i = 0; i < choiceTags.length; i++) {
			(function(i){new ChoiceTags(choiceTags[i]);})(i);
		}
	};
}());
// File#: _1_collapse
// Usage: codyhouse.co/license
(function() {
  var Collapse = function(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.animate = this.element.getAttribute('data-collapse-animate') == 'on';
    this.animating = false;
    initCollapse(this);
  };

  function initCollapse(element) {
    if ( element.triggers ) {
      // set initial 'aria-expanded' attribute for trigger elements
      updateTriggers(element, !Util.hasClass(element.element, 'is-hidden'));

      // detect click on trigger elements
			for(var i = 0; i < element.triggers.length; i++) {
				element.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					toggleVisibility(element);
				});
			}
    }
    
    // custom event
    element.element.addEventListener('collapseToggle', function(event){
      toggleVisibility(element);
    });
  };

  function toggleVisibility(element) {
    var bool = Util.hasClass(element.element, 'is-hidden');
    if(element.animating) return;
    element.animating = true;
    animateElement(element, bool);
    updateTriggers(element, bool);
  };

  function animateElement(element, bool) {
    // bool === true -> show content
    if(!element.animate || !window.requestAnimationFrame) {
      Util.toggleClass(element.element, 'is-hidden', !bool);
      element.animating = false;
      return;
    }

    // animate content height
    Util.removeClass(element.element, 'is-hidden');
    var initHeight = !bool ? element.element.offsetHeight: 0,
      finalHeight = !bool ? 0 : element.element.offsetHeight;

    Util.addClass(element.element, 'overflow-hidden');
    
    Util.setHeight(initHeight, finalHeight, element.element, 200, function(){
      if(!bool) Util.addClass(element.element, 'is-hidden');
      element.element.removeAttribute("style");
      Util.removeClass(element.element, 'overflow-hidden');
      element.animating = false;
    }, 'easeInOutQuad');
  };

  function updateTriggers(element, bool) {
    for(var i = 0; i < element.triggers.length; i++) {
      bool ? element.triggers[i].setAttribute('aria-expanded', 'true') : element.triggers[i].removeAttribute('aria-expanded');
    };
  };

  window.Collapse = Collapse;

  //initialize the Collapse objects
	var collapses = document.getElementsByClassName('js-collapse');
	if( collapses.length > 0 ) {
    for( var i = 0; i < collapses.length; i++) {
      new Collapse(collapses[i]);
    }
  }
}());
// File#: _1_confetti-button
// Usage: codyhouse.co/license
(function() {
  var ConfettiBtn = function(element) {
    this.element = element;
    this.btn = this.element.getElementsByClassName('js-confetti-btn__btn');
    this.icon = this.element.getElementsByClassName('js-confetti-btn__icon');
    this.animating = false;
    this.animationClass = 'confetti-btn--animate';
    this.positionVariables = '--conf-btn-click-';
    initConfettiBtn(this);
	};

  function initConfettiBtn(element) {
    if(element.btn.length < 1 || element.icon.length < 1) return;
    element.btn[0].addEventListener('click', function(event){
      if(element.animating) return;
      element.animating = true;
      setAnimationPosition(element, event);
      Util.addClass(element.element, element.animationClass);
      resetAnimation(element);
    });
  };

  function setAnimationPosition(element, event) { // change icon position based on click position
    
    var btnBoundingRect = element.btn[0].getBoundingClientRect();
    document.documentElement.style.setProperty(element.positionVariables+'x', (event.clientX - btnBoundingRect.left)+'px');
    document.documentElement.style.setProperty(element.positionVariables+'y', (event.clientY - btnBoundingRect.top)+'px');
  };

  function resetAnimation(element) { // reset the button at the end of the icon animation
    
    element.icon[0].addEventListener('animationend', function cb(){
      element.icon[0].removeEventListener('animationend', cb);
      Util.removeClass(element.element, element.animationClass);
      element.animating = false;
    });
  };

  var confettiBtn = document.getElementsByClassName('js-confetti-btn');
  if(confettiBtn.length > 0) {
    for(var i = 0; i < confettiBtn.length; i++) {
      (function(i){new ConfettiBtn(confettiBtn[i]);})(i);
    }
  }
}());
// File#: _1_countup
// Usage: codyhouse.co/license
(function() {	
  var CountUp = function(opts) {
    this.options = Util.extend(CountUp.defaults , opts);
    this.element = this.options.element;
    this.initialValue = parseFloat(this.options.initial);
    this.finalValue = parseFloat(this.element.textContent);
    this.deltaValue = parseFloat(this.options.delta);
    this.intervalId;
    this.animationTriggered = false;
    // animation will run only on browsers supporting IntersectionObserver
    this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    initCountUp(this);
  };

  CountUp.prototype.reset = function() { // reset element to its initial value
    if(!this.canAnimate) return;
    window.cancelAnimationFrame(this.intervalId);
    this.element.textContent = this.initialValue;
  };  

  CountUp.prototype.restart = function() { // restart element animation
    countUpAnimate(this);
  };

  function initCountUp(countup) {
    // reset initial value
    countup.initialValue = getCountupStart(countup);
    if(!countup.canAnimate) { // IntersectionObserver not supported
      countUpShow(countup);
      return;
    }

    // reset countUp for SR
    initCountUpSr(countup);

    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(countupObserve.bind(countup), { threshold: [0, 0.1] });
    observer.observe(countup.element);

    // listen to events
    countup.element.addEventListener('countUpReset', function(){countup.reset();});
    countup.element.addEventListener('countUpRestart', function(){countup.restart();});
  };

  function countUpShow(countup) { // reveal countup after it has been initialized
    Util.addClass(countup.element.closest('.countup'), 'countup--is-visible');
  };

  function countupObserve(entries, observer) { // observe countup position -> start animation when inside viewport
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      countUpAnimate(this);
    }
  };

  function countUpAnimate(countup) { // animate countup
    countup.element.textContent = countup.initialValue;
    countUpShow(countup);
    window.cancelAnimationFrame(countup.intervalId);
    var currentTime = null;

    function runCountUp(timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > countup.options.duration) progress = countup.options.duration;
      var val = getValEaseOut(progress, countup.initialValue, countup.finalValue - countup.initialValue, countup.options.duration);
      countup.element.textContent = getCountUpValue(val, countup);
      if(progress < countup.options.duration) {
        countup.intervalId = window.requestAnimationFrame(runCountUp);
      } else {
        countUpComplete(countup);
      }
    };

    countup.intervalId = window.requestAnimationFrame(runCountUp);
  };

  function getCountUpValue(val, countup) { // reset new countup value to proper decimal places+separator
    if(countup.options.decimal) {val = parseFloat(val.toFixed(countup.options.decimal));}
    else {val = parseInt(val);}
    if(countup.options.separator) val = val.toLocaleString('en');
    return val;
  }

  function countUpComplete(countup) { // emit event when animation is over
    countup.element.dispatchEvent(new CustomEvent('countUpComplete'));
    countup.animationTriggered = true;
  };

  function initCountUpSr(countup) { // make sure countup is accessible
    // hide elements that will be animated to SR
    countup.element.setAttribute('aria-hidden', 'true');
    // create new element with visible final value - accessible to SR only
    var srValue = document.createElement('span');
    srValue.textContent = countup.finalValue;
    Util.addClass(srValue, 'sr-only');
    countup.element.parentNode.insertBefore(srValue, countup.element.nextSibling);
  };

  function getCountupStart(countup) {
    return countup.deltaValue > 0 ? countup.finalValue - countup.deltaValue : countup.initialValue;
  };

  function getValEaseOut(t, b, c, d) { 
    t /= d;
    return -c * t*(t-2) + b;
  };

  CountUp.defaults = {
    element : '',
    separator : false,
    duration: 3000,
    decimal: false,
    initial: 0,
    delta: 0
  };

  window.CountUp = CountUp;

  //initialize the CountUp objects
  var countUp = document.getElementsByClassName('js-countup');
  if( countUp.length > 0 ) {
    for( var i = 0; i < countUp.length; i++) {(function(i){
    	var separator = (countUp[i].getAttribute('data-countup-sep')) ? countUp[i].getAttribute('data-countup-sep') : false,
        duration = (countUp[i].getAttribute('data-countup-duration')) ? countUp[i].getAttribute('data-countup-duration') : CountUp.defaults.duration,
        decimal = (countUp[i].getAttribute('data-countup-decimal')) ? countUp[i].getAttribute('data-countup-decimal') : false,
    		initial = (countUp[i].getAttribute('data-countup-start')) ? countUp[i].getAttribute('data-countup-start') : 0,
        delta = (countUp[i].getAttribute('data-countup-delta')) ? countUp[i].getAttribute('data-countup-delta') : 0;
    	new CountUp({element: countUp[i], separator : separator, duration: duration, decimal: decimal, initial: initial, delta: delta});
    })(i);}
  }
}());
// File#: _1_cross-table
// Usage: codyhouse.co/license
(function() {
  var CrossTables = function(element) {
    this.element = element;
    this.header = this.element.getElementsByClassName('js-cross-table__header')[0];
    this.body = this.element.getElementsByClassName('js-cross-table__body')[0];
    this.headerItems = this.header.getElementsByClassName('cross-table__cell');
    this.rows = this.body.getElementsByClassName('cross-table__row');
    this.rowSections = this.element.getElementsByClassName('js-cross-table__row--w-full');
    this.singleLayoutClass = 'cross-table--cards';
    initCrossTable(this);
  };

  function initCrossTable(table) {
    // create additional table content + set proper roles
    setTableRoles(table);
    addTableContent(table);

    // custom event emitted when window is resized
    table.element.addEventListener('update-cross-table', function(event){
      checkTableLayour(table);
    });
  };

  function checkTableLayour(table) {
    var layout = getComputedStyle(table.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table.element, table.singleLayoutClass, layout != 'expanded'); // reset table class
    resetTableLayout(table, layout); // reset table style
  };

  function resetTableLayout(table, layout) {
    // reset style based on layout state
    if(table.rowSections.length == 0) return;
    if(layout == 'expanded') {
      table.body.removeAttribute('style');
      for(var i = 0; i < table.rowSections.length; i++) {
        table.rowSections[i].removeAttribute('style'); 
      }
    } else {
      table.body.setAttribute('style', 'padding-top:'+table.rowSections[0].offsetHeight+'px');
      for(var i = 0; i < table.rowSections.length; i++) {
        table.rowSections[i].setAttribute('style', 'left:'+table.rowSections[i].nextElementSibling.offsetLeft+'px');
      }
    }
  };

  function setTableRoles(table) {
    // table
    table.element.setAttribute('role', 'table');
    // body and header
    table.header.setAttribute('role', 'rowgroup');
    table.body.setAttribute('role', 'rowgroup');
    // tr, th, td
    var trElements = table.element.getElementsByTagName('tr');
    for(var i=0; i < trElements.length; i++) {
      trElements[i].setAttribute('role', 'row');
    }
    var thElements = table.element.getElementsByTagName('th');
    for(var i=0; i < thElements.length; i++) {
      thElements[i].setAttribute('role', 'rowheader');
    }
    var tdElements = table.element.getElementsByTagName('td');
    for(var i=0; i < tdElements.length; i++) {
      tdElements[i].setAttribute('role', 'cell');
    }
  };

  function addTableContent(table) {
    // store header labels
    var headerLables = [];
    for(var i = 0; i < table.headerItems.length; i++) {
      var headerLabelEl = table.headerItems[i].getElementsByClassName('js-cross-table__label'),
        headerLabel = (headerLabelEl.length > 0 ) ? headerLabelEl[0].innerHTML : table.headerItems[i].innerHTML;
      headerLables.push(headerLabel);
    }
    // insert label inside each cell - viible in crads layout only
    for(var i = 0; i < table.rows.length; i++) {
      if( !Util.hasClass(table.rows[i], 'js-cross-table__row--w-full') ) {
        var cells = table.rows[i].children;
        for(var j = 1; j < headerLables.length; j++) {
          if(cells[j]) {
            cells[j].innerHTML = '<span aria-hidden="true" class="cross-table__label">'+headerLables[j]+':</span> <span>'+cells[j].innerHTML+'</span>';
          }
        }
      }
    }
  };

  var crossTables = document.getElementsByClassName('js-cross-table');
  if( crossTables.length > 0 ) {
    var j = 0,
    crossTablesArray = [];
    for( var i = 0; i < crossTables.length; i++) {
      var beforeContent = getComputedStyle(crossTables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){ crossTablesArray.push(new CrossTables(crossTables[i]));})(i);
        j = j + 1;
      }
    }

    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-cross-table');
      // reset table layout on resize
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < crossTablesArray.length; i++) {
          (function(i){crossTablesArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };

      (window.requestAnimationFrame) // init table layout
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
  }
}());
// File#: _1_custom-select
// Usage: codyhouse.co/license
(function() {
  // NOTE: you need the js code only when using the --custom-dropdown variation of the Custom Select component. Default version does nor require JS.
  
  var CustomSelect = function(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.selectedOption = getSelectedOptionText(this);
    this.selectId = this.select.getAttribute('id');
    this.trigger = false;
    this.dropdown = false;
    this.customOptions = false;
    this.arrowIcon = this.element.getElementsByTagName('svg');
    this.label = document.querySelector('[for="'+this.selectId+'"]');

    this.optionIndex = 0; // used while building the custom dropdown

    initCustomSelect(this); // init markup
    initCustomSelectEvents(this); // init event listeners
  };
  
  function initCustomSelect(select) {
    // create the HTML for the custom dropdown element
    select.element.insertAdjacentHTML('beforeend', initButtonSelect(select) + initListSelect(select));
    
    // save custom elements
    select.dropdown = select.element.getElementsByClassName('js-select__dropdown')[0];
    select.trigger = select.element.getElementsByClassName('js-select__button')[0];
    select.customOptions = select.dropdown.getElementsByClassName('js-select__item');
    
    // hide default select
    Util.addClass(select.select, 'is-hidden');
    if(select.arrowIcon.length > 0 ) select.arrowIcon[0].style.display = 'none';

    // place dropdown
    placeDropdown(select);
  };

  function initCustomSelectEvents(select) {
    // option selection in dropdown
    initSelection(select);

    // click events
    select.trigger.addEventListener('click', function(){
      toggleCustomSelect(select, false);
    });
    if(select.label) {
      // move focus to custom trigger when clicking on <select> label
      select.label.addEventListener('click', function(){
        Util.moveFocus(select.trigger);
      });
    }
    // keyboard navigation
    select.dropdown.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      }
    });
    // native <select> element has been updated -> update custom select as well
    select.element.addEventListener('select-updated', function(event){
      resetCustomSelect(select);
    });
  };

  function toggleCustomSelect(select, bool) {
    var ariaExpanded;
    if(bool) {
      ariaExpanded = bool;
    } else {
      ariaExpanded = select.trigger.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
    }
    select.trigger.setAttribute('aria-expanded', ariaExpanded);
    if(ariaExpanded == 'true') {
      var selectedOption = getSelectedOption(select);
      Util.moveFocus(selectedOption); // fallback if transition is not supported
      select.dropdown.addEventListener('transitionend', function cb(){
        Util.moveFocus(selectedOption);
        select.dropdown.removeEventListener('transitionend', cb);
      });
      placeDropdown(select); // place dropdown based on available space
    }
  };

  function placeDropdown(select) {
    // remove placement classes to reset position
    Util.removeClass(select.dropdown, 'select__dropdown--right select__dropdown--up');
    var triggerBoundingRect = select.trigger.getBoundingClientRect();
    Util.toggleClass(select.dropdown, 'select__dropdown--right', (document.documentElement.clientWidth - 5 < triggerBoundingRect.left + select.dropdown.offsetWidth));
    // check if there's enough space up or down
    var moveUp = (window.innerHeight - triggerBoundingRect.bottom - 5) < triggerBoundingRect.top;
    Util.toggleClass(select.dropdown, 'select__dropdown--up', moveUp);
    // check if we need to set a max width
    var maxHeight = moveUp ? triggerBoundingRect.top - 20 : window.innerHeight - triggerBoundingRect.bottom - 20;
    // set max-height based on available space
    select.dropdown.setAttribute('style', 'max-height: '+maxHeight+'px; width: '+triggerBoundingRect.width+'px;');
  };

  function keyboardCustomSelect(select, direction, event) { // navigate custom dropdown with keyboard
    event.preventDefault();
    var index = Util.getIndexInArray(select.customOptions, document.activeElement);
    index = (direction == 'next') ? index + 1 : index - 1;
    if(index < 0) index = select.customOptions.length - 1;
    if(index >= select.customOptions.length) index = 0;
    Util.moveFocus(select.customOptions[index]);
  };

  function initSelection(select) { // option selection
    select.dropdown.addEventListener('click', function(event){
      var option = event.target.closest('.js-select__item');
      if(!option) return;
      selectOption(select, option);
    });
  };
  
  function selectOption(select, option) {
    if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
      // selecting the same option
      select.trigger.setAttribute('aria-expanded', 'false'); // hide dropdown
    } else { 
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
      option.setAttribute('aria-selected', 'true');
      select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
      select.trigger.setAttribute('aria-expanded', 'false');
      // new option has been selected -> update native <select> element _ arai-label of trigger <button>
      updateNativeSelect(select, option.getAttribute('data-index'));
      updateTriggerAria(select); 
    }
    // move focus back to trigger
    select.trigger.focus();
  };

  function updateNativeSelect(select, index) {
    select.select.selectedIndex = index;
    select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
  };

  function updateTriggerAria(select) {
    select.trigger.setAttribute('aria-label', select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent);
  };

  function getSelectedOptionText(select) {// used to initialize the label of the custom select button
    var label = '';
    if('selectedIndex' in select.select) {
      label = select.options[select.select.selectedIndex].text;
    } else {
      label = select.select.querySelector('option[selected]').text;
    }
    return label;

  };
  
  function initButtonSelect(select) { // create the button element -> custom select trigger
    // check if we need to add custom classes to the button trigger
    var customClasses = select.element.getAttribute('data-trigger-class') ? ' '+select.element.getAttribute('data-trigger-class') : '';

    var label = select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent;
  
    var button = '<button type="button" class="js-select__button select__button'+customClasses+'" aria-label="'+label+'" aria-expanded="false" aria-controls="'+select.selectId+'-dropdown"><span aria-hidden="true" class="js-select__label select__label">'+select.selectedOption+'</span>';
    if(select.arrowIcon.length > 0 && select.arrowIcon[0].outerHTML) {
      var clone = select.arrowIcon[0].cloneNode(true);
      Util.removeClass(clone, 'select__icon');
      button = button +clone.outerHTML;
    }
    
    return button+'</button>';

  };

  function initListSelect(select) { // create custom select dropdown
    var list = '<div class="js-select__dropdown select__dropdown" aria-describedby="'+select.selectId+'-description" id="'+select.selectId+'-dropdown">';
    list = list + getSelectLabelSR(select);
    if(select.optGroups.length > 0) {
      for(var i = 0; i < select.optGroups.length; i++) {
        var optGroupList = select.optGroups[i].getElementsByTagName('option'),
          optGroupLabel = '<li><span class="select__item select__item--optgroup">'+select.optGroups[i].getAttribute('label')+'</span></li>';
        list = list + '<ul class="select__list" role="listbox">'+optGroupLabel+getOptionsList(select, optGroupList) + '</ul>';
      }
    } else {
      list = list + '<ul class="select__list" role="listbox">'+getOptionsList(select, select.options) + '</ul>';
    }
    return list;
  };

  function getSelectLabelSR(select) {
    if(select.label) {
      return '<p class="sr-only" id="'+select.selectId+'-description">'+select.label.textContent+'</p>'
    } else {
      return '';
    }
  };
  
  function resetCustomSelect(select) {
    // <select> element has been updated (using an external control) - update custom select
    var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
    if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
    var option = select.dropdown.querySelector('.js-select__item[data-index="'+select.select.selectedIndex+'"]');
    option.setAttribute('aria-selected', 'true');
    select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
    select.trigger.setAttribute('aria-expanded', 'false');
    updateTriggerAria(select); 
  };

  function getOptionsList(select, options) {
    var list = '';
    for(var i = 0; i < options.length; i++) {
      var selected = options[i].hasAttribute('selected') ? ' aria-selected="true"' : ' aria-selected="false"';
      list = list + '<li><button type="button" class="reset js-select__item select__item select__item--option" role="option" data-value="'+options[i].value+'" '+selected+' data-index="'+select.optionIndex+'">'+options[i].text+'</button></li>';
      select.optionIndex = select.optionIndex + 1;
    };
    return list;
  };

  function getSelectedOption(select) {
    var option = select.dropdown.querySelector('[aria-selected="true"]');
    if(option) return option;
    else return select.dropdown.getElementsByClassName('js-select__item')[0];
  };

  function moveFocusToSelectTrigger(select) {
    if(!document.activeElement.closest('.js-select')) return
    select.trigger.focus();
  };
  
  function checkCustomSelectClick(select, target) { // close select when clicking outside it
    if( !select.element.contains(target) ) toggleCustomSelect(select, 'false');
  };
  
  //initialize the CustomSelect objects
  var customSelect = document.getElementsByClassName('js-select');
  if( customSelect.length > 0 ) {
    var selectArray = [];
    for( var i = 0; i < customSelect.length; i++) {
      (function(i){selectArray.push(new CustomSelect(customSelect[i]));})(i);
    }

    // listen for key events
    window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close custom select on 'Esc'
        selectArray.forEach(function(element){
          moveFocusToSelectTrigger(element); // if focus is within dropdown, move it to dropdown trigger
          toggleCustomSelect(element, 'false'); // close dropdown
        });
      } 
    });
    // close custom select when clicking outside it
    window.addEventListener('click', function(event){
      selectArray.forEach(function(element){
        checkCustomSelectClick(element, event.target);
      });
    });
  }
}());
// File#: _1_date-picker
// Usage: codyhouse.co/license
(function() {
  var DatePicker = function(opts) {
    this.options = Util.extend(DatePicker.defaults , opts);
    this.element = this.options.element;
    this.input = this.element.getElementsByClassName('js-date-input__text')[0];
    this.trigger = this.element.getElementsByClassName('js-date-input__trigger')[0];
    this.triggerLabel = this.trigger.getAttribute('aria-label');
    this.datePicker = this.element.getElementsByClassName('js-date-picker')[0];
    this.body = this.datePicker.getElementsByClassName('js-date-picker__dates')[0];
    this.navigation = this.datePicker.getElementsByClassName('js-date-picker__month-nav')[0];
    this.heading = this.datePicker.getElementsByClassName('js-date-picker__month-label')[0];
    this.pickerVisible = false;
    // date format
    this.dateIndexes = getDateIndexes(this); // store indexes of date parts (d, m, y)
    // set initial date
    resetCalendar(this);
    // selected date
    this.dateSelected = false;
    this.selectedDay = false;
    this.selectedMonth = false;
    this.selectedYear = false;
    // focus trap
    this.firstFocusable = false;
    this.lastFocusable = false;
    // date value - for custom control variation
    this.dateValueEl = this.element.getElementsByClassName('js-date-input__value');
    if(this.dateValueEl.length > 0) {
      this.dateValueLabelInit = this.dateValueEl[0].textContent; // initial input value
    }
    initCalendarAria(this);
    initCalendarEvents(this);
    // place picker according to available space
    placeCalendar(this);
  };

  DatePicker.prototype.showCalendar = function() {
    showCalendar(this);
  };

  DatePicker.prototype.showNextMonth = function() {
    showNext(this, true);
  };

  DatePicker.prototype.showPrevMonth = function() {
    showPrev(this, true);
  };

  function initCalendarAria(datePicker) {
    // reset calendar button label
    resetLabelCalendarTrigger(datePicker);
    if(datePicker.dateValueEl.length > 0) {
      resetCalendar(datePicker);
      resetLabelCalendarValue(datePicker);
    }
    // create a live region used to announce new month selection to SR
    var srLiveReagion = document.createElement('div');
    srLiveReagion.setAttribute('aria-live', 'polite');
    Util.addClass(srLiveReagion, 'sr-only js-date-input__sr-live');
    datePicker.element.appendChild(srLiveReagion);
    datePicker.srLiveReagion = datePicker.element.getElementsByClassName('js-date-input__sr-live')[0];
  };

  function initCalendarEvents(datePicker) {
    datePicker.input.addEventListener('focus', function(event){
      toggleCalendar(datePicker, true); // toggle calendar when focus is on input
    });
    if(datePicker.trigger) {
      datePicker.trigger.addEventListener('click', function(event){ // open calendar when clicking on calendar button
        event.preventDefault();
        datePicker.pickerVisible = false;
        toggleCalendar(datePicker);
        datePicker.trigger.setAttribute('aria-expanded', 'true');
      });
    }

    // select a date inside the date picker
    datePicker.body.addEventListener('click', function(event){
      event.preventDefault();
      var day = event.target.closest('button');
      if(day) {
        datePicker.dateSelected = true;
        datePicker.selectedDay = day.innerText;
        datePicker.selectedMonth = datePicker.currentMonth;
        datePicker.selectedYear = datePicker.currentYear;
        setInputValue(datePicker);
        datePicker.input.focus(); // focus on the input element and close picker
        resetLabelCalendarTrigger(datePicker);
        resetLabelCalendarValue(datePicker);
      }
    });

    // navigate using month nav
    datePicker.navigation.addEventListener('click', function(event){
      event.preventDefault();
      var btn = event.target.closest('.js-date-picker__month-nav-btn');
      if(btn) {
        Util.hasClass(btn, 'js-date-picker__month-nav-btn--prev') ? showPrev(datePicker, true) : showNext(datePicker, true);
      }
    });

    // hide calendar
    window.addEventListener('keydown', function(event){ // close calendar on esc
      if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        if(document.activeElement.closest('.js-date-picker')) {
          datePicker.input.focus(); //if focus is inside the calendar -> move the focus to the input element 
        } else { // do not move focus -> only close calendar
          hideCalendar(datePicker); 
        }
      }
    });
    window.addEventListener('click', function(event){
      if(!event.target.closest('.js-date-picker') && !event.target.closest('.js-date-input') && datePicker.pickerVisible) {
        hideCalendar(datePicker);
      }
    });

    // navigate through days of calendar
    datePicker.body.addEventListener('keydown', function(event){
      var day = datePicker.currentDay;
      if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        day = day + 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
        day = day + 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
        day = day - 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        day = day - 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 35 || event.key && event.key.toLowerCase() == 'end') { // move focus to last day of week
        event.preventDefault();
        day = day + 6 - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 36 || event.key && event.key.toLowerCase() == 'home') { // move focus to first day of week
        event.preventDefault();
        day = day - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 34 || event.key && event.key.toLowerCase() == 'pagedown') {
        event.preventDefault();
        showNext(datePicker); // show next month
      } else if(event.keyCode && event.keyCode == 33 || event.key && event.key.toLowerCase() == 'pageup') {
        event.preventDefault();
        showPrev(datePicker); // show prev month
      }
    });

    // trap focus inside calendar
    datePicker.datePicker.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        trapFocus(event, datePicker);
      }
    });

    datePicker.input.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        // update calendar on input enter
        resetCalendar(datePicker);
        resetLabelCalendarTrigger(datePicker);
        resetLabelCalendarValue(datePicker);
        hideCalendar(datePicker);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown' && datePicker.pickerVisible) { // move focus to calendar using arrow down
        datePicker.body.querySelector('button[tabindex="0"]').focus();
      };
    });
  };

  function getCurrentDay(date) {
    return (date) 
      ? getDayFromDate(date)
      : new Date().getDate();
  };

  function getCurrentMonth(date) {
    return (date) 
      ? getMonthFromDate(date)
      : new Date().getMonth();
  };

  function getCurrentYear(date) {
    return (date) 
      ? getYearFromDate(date)
      : new Date().getFullYear();
  };

  function getDayFromDate(date) {
    var day = parseInt(date.split('-')[2]);
    return isNaN(day) ? getCurrentDay(false) : day;
  };

  function getMonthFromDate(date) {
    var month = parseInt(date.split('-')[1]) - 1;
    return isNaN(month) ? getCurrentMonth(false) : month;
  };

  function getYearFromDate(date) {
    var year = parseInt(date.split('-')[0]);
    return isNaN(year) ? getCurrentYear(false) : year;
  };

  function showNext(datePicker, bool) {
    // show next month
    datePicker.currentYear = (datePicker.currentMonth === 11) ? datePicker.currentYear + 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth + 1) % 12;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagion.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function showPrev(datePicker, bool) {
    // show prev month
    datePicker.currentYear = (datePicker.currentMonth === 0) ? datePicker.currentYear - 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth === 0) ? 11 : datePicker.currentMonth - 1;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagion.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function checkDayInMonth(datePicker) {
    return (datePicker.currentDay > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) ? 1 : datePicker.currentDay;
  };

  function daysInMonth(year, month) {
    return 32 - new Date(year, month, 32).getDate();
  };

  function resetCalendar(datePicker) {
    var currentDate = false,
      selectedDate = datePicker.input.value;

    datePicker.dateSelected = false;
    if( selectedDate != '') {
      var date = getDateFromInput(datePicker);
      datePicker.dateSelected = true;
      currentDate = date;
    } 
    datePicker.currentDay = getCurrentDay(currentDate);
    datePicker.currentMonth = getCurrentMonth(currentDate); 
    datePicker.currentYear = getCurrentYear(currentDate); 
    
    datePicker.selectedDay = datePicker.dateSelected ? datePicker.currentDay : false;
    datePicker.selectedMonth = datePicker.dateSelected ? datePicker.currentMonth : false;
    datePicker.selectedYear = datePicker.dateSelected ? datePicker.currentYear : false;
  };

  function showCalendar(datePicker, bool) {
    // show calendar element
    var firstDay = getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, '01');
    datePicker.body.innerHTML = '';
    datePicker.heading.innerHTML = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;

    // creating all cells
    var date = 1,
      calendar = '';
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          calendar = calendar + '<li></li>';
        } else if (date > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) {
          break;
        } else {
          var classListDate = '',
            tabindexValue = '-1';
          if (date === datePicker.currentDay) {
            tabindexValue = '0';
          } 
          if(!datePicker.dateSelected && getCurrentMonth() == datePicker.currentMonth && getCurrentYear() == datePicker.currentYear && date == getCurrentDay()){
            classListDate = classListDate+' date-picker__date--today'
          }
          if (datePicker.dateSelected && date === datePicker.selectedDay && datePicker.currentYear === datePicker.selectedYear && datePicker.currentMonth === datePicker.selectedMonth) {
            classListDate = classListDate+'  date-picker__date--selected';
          }
          calendar = calendar + '<li><button class="date-picker__date'+classListDate+'" tabindex="'+tabindexValue+'" type="button">'+date+'</button></li>';
          date++;
        }
      }
    }
    datePicker.body.innerHTML = calendar; // appending days into calendar body
    
    // show calendar
    if(!datePicker.pickerVisible) Util.addClass(datePicker.datePicker, 'date-picker--is-visible');
    datePicker.pickerVisible = true;

    //  if bool is false, move focus to calendar day
    if(!bool) datePicker.body.querySelector('button[tabindex="0"]').focus();

    // store first/last focusable elements
    getFocusableElements(datePicker);

    //place calendar
    placeCalendar(datePicker);
  };

  function hideCalendar(datePicker) {
    Util.removeClass(datePicker.datePicker, 'date-picker--is-visible');
    datePicker.pickerVisible = false;

    // reset first/last focusable
    datePicker.firstFocusable = false;
    datePicker.lastFocusable = false;

    // reset trigger aria-expanded attribute
    if(datePicker.trigger) datePicker.trigger.setAttribute('aria-expanded', 'false');
  };

  function toggleCalendar(datePicker, bool) {
    if(!datePicker.pickerVisible) {
      resetCalendar(datePicker);
      showCalendar(datePicker, bool);
    } else {
      hideCalendar(datePicker);
    }
  };

  function getDayOfWeek(year, month, day) {
    var weekDay = (new Date(year, month, day)).getDay() - 1;
    if(weekDay < 0) weekDay = 6;
    return weekDay;
  };

  function getDateIndexes(datePicker) {
    var dateFormat = datePicker.options.dateFormat.toLowerCase().replace(/-/g, '');
    return [dateFormat.indexOf('d'), dateFormat.indexOf('m'), dateFormat.indexOf('y')];
  };

  function setInputValue(datePicker) {
    datePicker.input.value = getDateForInput(datePicker);
  };

  function getDateForInput(datePicker) {
    var dateArray = [];
    dateArray[datePicker.dateIndexes[0]] = getReadableDate(datePicker.selectedDay);
    dateArray[datePicker.dateIndexes[1]] = getReadableDate(datePicker.selectedMonth+1);
    dateArray[datePicker.dateIndexes[2]] = datePicker.selectedYear;
    return dateArray[0]+datePicker.options.dateSeparator+dateArray[1]+datePicker.options.dateSeparator+dateArray[2];
  };

  function getDateFromInput(datePicker) {
    var dateArray = datePicker.input.value.split(datePicker.options.dateSeparator);
    return dateArray[datePicker.dateIndexes[2]]+'-'+dateArray[datePicker.dateIndexes[1]]+'-'+dateArray[datePicker.dateIndexes[0]];
  };

  function getReadableDate(date) {
    return (date < 10) ? '0'+date : date;
  };

  function resetDayValue(day, datePicker) {
    var totDays = daysInMonth(datePicker.currentYear, datePicker.currentMonth);
    if( day > totDays) {
      datePicker.currentDay = day - totDays;
      showNext(datePicker, false);
    } else if(day < 1) {
      var newMonth = datePicker.currentMonth == 0 ? 11 : datePicker.currentMonth - 1;
      datePicker.currentDay = daysInMonth(datePicker.currentYear, newMonth) + day;
      showPrev(datePicker, false);
    } else {
      datePicker.currentDay = day;
      datePicker.body.querySelector('button[tabindex="0"]').setAttribute('tabindex', '-1');
      // set new tabindex to selected item
      var buttons = datePicker.body.getElementsByTagName("button");
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent == datePicker.currentDay) {
          buttons[i].setAttribute('tabindex', '0');
          buttons[i].focus();
          break;
        }
      }
      getFocusableElements(datePicker); // update first focusable/last focusable element
    }
  };

  function resetLabelCalendarTrigger(datePicker) {
    if(!datePicker.trigger) return;
    // reset accessible label of the calendar trigger
    (datePicker.selectedYear && datePicker.selectedMonth !== false && datePicker.selectedDay) 
      ? datePicker.trigger.setAttribute('aria-label', datePicker.triggerLabel+', selected date is '+ new Date(datePicker.selectedYear, datePicker.selectedMonth, datePicker.selectedDay).toDateString())
      : datePicker.trigger.setAttribute('aria-label', datePicker.triggerLabel);
  };

  function resetLabelCalendarValue(datePicker) {
    // this is used for the --custom-control variation -> there's a label that should be updated with the selected date
    if(datePicker.dateValueEl.length < 1) return;
    (datePicker.selectedYear && datePicker.selectedMonth !== false && datePicker.selectedDay) 
      ? datePicker.dateValueEl[0].textContent = getDateForInput(datePicker)
      : datePicker.dateValueEl[0].textContent = datePicker.dateValueLabelInit;
  };

  function getFocusableElements(datePicker) {
    var allFocusable = datePicker.datePicker.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstFocusable(allFocusable, datePicker);
    getLastFocusable(allFocusable, datePicker);
  }

  function getFirstFocusable(elements, datePicker) {
    for(var i = 0; i < elements.length; i++) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1') {
				datePicker.firstFocusable = elements[i];
				return true;
			}
		}
  };

  function getLastFocusable(elements, datePicker) {
    //get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1' ) {
				datePicker.lastFocusable = elements[i];
				return true;
			}
		}
  };

  function trapFocus(event, datePicker) {
    if( datePicker.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.lastFocusable.focus();
		}
		if( datePicker.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.firstFocusable.focus();
		}
  };

  function placeCalendar(datePicker) {
    // reset position
    datePicker.datePicker.style.left = '0px';
    datePicker.datePicker.style.right = 'auto';
    
    //check if you need to modify the calendar postion
    var pickerBoundingRect = datePicker.datePicker.getBoundingClientRect();

    if(pickerBoundingRect.right > window.innerWidth) {
      datePicker.datePicker.style.left = 'auto';
      datePicker.datePicker.style.right = '0px';
    }
  };

  DatePicker.defaults = {
    element : '',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dateFormat: 'd-m-y',
    dateSeparator: '/'
  };

  window.DatePicker = DatePicker;

  var datePicker = document.getElementsByClassName('js-date-input'),
    flexSupported = Util.cssSupports('align-items', 'stretch');
  if( datePicker.length > 0 ) {
		for( var i = 0; i < datePicker.length; i++) {(function(i){
      if(!flexSupported) {
        Util.addClass(datePicker[i], 'date-input--hide-calendar');
        return;
      }
      var opts = {element: datePicker[i]};
      if(datePicker[i].getAttribute('data-date-format')) {
        opts.dateFormat = datePicker[i].getAttribute('data-date-format');
      }
      if(datePicker[i].getAttribute('data-date-separator')) {
        opts.dateSeparator = datePicker[i].getAttribute('data-date-separator');
      }
      if(datePicker[i].getAttribute('data-months')) {
        opts.months = datePicker[i].getAttribute('data-months').split(',').map(function(item) {return item.trim();});
      }
      new DatePicker(opts);
    })(i);}
	}
}());


// File#: _1_details
// Usage: codyhouse.co/license
(function() {
	var Details = function(element, index) {
		this.element = element;
		this.summary = this.element.getElementsByClassName('js-details__summary')[0];
		this.details = this.element.getElementsByClassName('js-details__content')[0];
		this.htmlElSupported = 'open' in this.element;
		this.initDetails(index);
		this.initDetailsEvents();
	};

	Details.prototype.initDetails = function(index) {
		// init aria attributes 
		Util.setAttributes(this.summary, {'aria-expanded': 'false', 'aria-controls': 'details--'+index, 'role': 'button'});
		Util.setAttributes(this.details, {'aria-hidden': 'true', 'id': 'details--'+index});
	};

	Details.prototype.initDetailsEvents = function() {
		var self = this;
		if( this.htmlElSupported ) { // browser supports the <details> element 
			this.element.addEventListener('toggle', function(event){
				var ariaValues = self.element.open ? ['true', 'false'] : ['false', 'true'];
				// update aria attributes when details element status change (open/close)
				self.updateAriaValues(ariaValues);
			});
		} else { //browser does not support <details>
			this.summary.addEventListener('click', function(event){
				event.preventDefault();
				var isOpen = self.element.getAttribute('open'),
					ariaValues = [];

				isOpen ? self.element.removeAttribute('open') : self.element.setAttribute('open', 'true');
				ariaValues = isOpen ? ['false', 'true'] : ['true', 'false'];
				self.updateAriaValues(ariaValues);
			});
		}
	};

	Details.prototype.updateAriaValues = function(values) {
		this.summary.setAttribute('aria-expanded', values[0]);
		this.details.setAttribute('aria-hidden', values[1]);
	};

	//initialize the Details objects
	var detailsEl = document.getElementsByClassName('js-details');
	if( detailsEl.length > 0 ) {
		for( var i = 0; i < detailsEl.length; i++) {
			(function(i){new Details(detailsEl[i], i);})(i);
		}
	}
}());
// File#: _1_diagonal-movement
// Usage: codyhouse.co/license
/*
  Modified version of the jQuery-menu-aim plugin
  https://github.com/kamens/jQuery-menu-aim
  - Replaced jQuery with Vanilla JS
  - Minor changes
*/
(function() {
  var menuAim = function(opts) {
    init(opts);
  };

  window.menuAim = menuAim;

  function init(opts) {
    var activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = Util.extend({
        menu: '',
        rows: false, //if false, get direct children - otherwise pass nodes list 
        submenuSelector: "*",
        submenuDirection: "right",
        tolerance: 75,  // bigger = more forgivey when entering submenu
        enter: function(){},
        exit: function(){},
        activate: function(){},
        deactivate: function(){},
        exitMenu: function(){}
      }, opts),
      menu = options.menu;

    var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
      DELAY = 300;  // ms delay when user appears to be entering submenu

    /**
     * Keep track of the last few locations of the mouse.
     */
    var mouseMoveFallback = function(event) {
      (!window.requestAnimationFrame) ? mousemoveDocument(event) : window.requestAnimationFrame(function(){mousemoveDocument(event);});
    };

    var mousemoveDocument = function(e) {
      mouseLocs.push({x: e.pageX, y: e.pageY});

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If exitMenu is supplied and returns true, deactivate the
      // currently active row on menu exit.
      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function() {
      if (timeoutId) {
        // Cancel any previous activation delays
        clearTimeout(timeoutId);
      }

      options.enter(this);
      possiblyActivate(this);
    },
    mouseleaveRow = function() {
      options.exit(this);
    };

    /*
     * Immediately activate a row if the user clicks on it.
     */
    var clickRow = function() {
      activate(this);
    };  

    /**
     * Activate a menu row.
     */
    var activate = function(row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function(row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function() {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function() {
      if (!activeRow || !Util.is(activeRow, options.submenuSelector)) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      function getOffset(element) {
        var rect = element.getBoundingClientRect();
        return { top: rect.top + window.pageYOffset, left: rect.left + window.pageXOffset };
      };

      var offset = getOffset(menu),
          upperLeft = {
              x: offset.left,
              y: offset.top - options.tolerance
          },
          upperRight = {
              x: offset.left + menu.offsetWidth,
              y: upperLeft.y
          },
          lowerLeft = {
              x: offset.left,
              y: offset.top + menu.offsetHeight + options.tolerance
          },
          lowerRight = {
              x: offset.left + menu.offsetWidth,
              y: lowerLeft.y
          },
          loc = mouseLocs[mouseLocs.length - 1],
          prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x || prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      };

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    var reset = function(triggerDeactivate) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (activeRow && triggerDeactivate) {
        options.deactivate(activeRow);
      }

      activeRow = null;
    };

    var destroyInstance = function() {
      menu.removeEventListener('mouseleave', mouseleaveMenu);  
      document.removeEventListener('mousemove', mouseMoveFallback);
      if(rows.length > 0) {
        for(var i = 0; i < rows.length; i++) {
          rows[i].removeEventListener('mouseenter', mouseenterRow);  
          rows[i].removeEventListener('mouseleave', mouseleaveRow);
          rows[i].removeEventListener('click', clickRow);  
        }
      }
      
    };

    /**
     * Hook up initial menu events
     */
    menu.addEventListener('mouseleave', mouseleaveMenu);  
    var rows = (options.rows) ? options.rows : menu.children;
    if(rows.length > 0) {
      for(var i = 0; i < rows.length; i++) {(function(i){
        rows[i].addEventListener('mouseenter', mouseenterRow);  
        rows[i].addEventListener('mouseleave', mouseleaveRow);
        rows[i].addEventListener('click', clickRow);  
      })(i);}
    }

    document.addEventListener('mousemove', mouseMoveFallback);

    /* Reset/destroy menu */
    menu.addEventListener('reset', function(event){
      reset(event.detail);
    });
    menu.addEventListener('destroy', destroyInstance);
  };
}());


// File#: _1_dialog
// Usage: codyhouse.co/license
(function() {
  var Dialog = function(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.firstFocusable = null;
		this.lastFocusable = null;
		this.selectedTrigger = null;
		this.showClass = "dialog--is-visible";
    initDialog(this);
  };

  function initDialog(dialog) {
    if ( dialog.triggers ) {
			for(var i = 0; i < dialog.triggers.length; i++) {
				dialog.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					dialog.selectedTrigger = event.target;
					showDialog(dialog);
					initDialogEvents(dialog);
				});
			}
    }
    
    // listen to the openDialog event -> open dialog without a trigger button
		dialog.element.addEventListener('openDialog', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			showDialog(dialog);
			initDialogEvents(dialog);
		});
  };

  function showDialog(dialog) {
		Util.addClass(dialog.element, dialog.showClass);
    getFocusableElements(dialog);
		dialog.firstFocusable.focus();
		// wait for the end of transitions before moving focus
		dialog.element.addEventListener("transitionend", function cb(event) {
			dialog.firstFocusable.focus();
			dialog.element.removeEventListener("transitionend", cb);
		});
		emitDialogEvents(dialog, 'dialogIsOpen');
  };

  function closeDialog(dialog) {
    Util.removeClass(dialog.element, dialog.showClass);
		dialog.firstFocusable = null;
		dialog.lastFocusable = null;
		if(dialog.selectedTrigger) dialog.selectedTrigger.focus();
		//remove listeners
		cancelDialogEvents(dialog);
		emitDialogEvents(dialog, 'dialogIsClose');
  };
  
  function initDialogEvents(dialog) {
    //add event listeners
		dialog.element.addEventListener('keydown', handleEvent.bind(dialog));
		dialog.element.addEventListener('click', handleEvent.bind(dialog));
  };

  function cancelDialogEvents(dialog) {
		//remove event listeners
		dialog.element.removeEventListener('keydown', handleEvent.bind(dialog));
		dialog.element.removeEventListener('click', handleEvent.bind(dialog));
  };
  
  function handleEvent(event) {
		// handle events
		switch(event.type) {
      case 'click': {
        initClick(this, event);
      }
      case 'keydown': {
        initKeyDown(this, event);
      }
		}
  };
  
  function initKeyDown(dialog, event) {
		if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
			//close dialog on esc
			closeDialog(dialog);
		} else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside dialog
			trapFocus(dialog, event);
		}
	};

	function initClick(dialog, event) {
		//close dialog when clicking on close button
		if( !event.target.closest('.js-dialog__close') ) return;
		event.preventDefault();
		closeDialog(dialog);
	};

	function trapFocus(dialog, event) {
		if( dialog.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of dialog
			event.preventDefault();
			dialog.lastFocusable.focus();
		}
		if( dialog.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of dialog
			event.preventDefault();
			dialog.firstFocusable.focus();
		}
	};

  function getFocusableElements(dialog) {
    //get all focusable elements inside the dialog
		var allFocusable = dialog.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(dialog, allFocusable);
		getLastVisible(dialog, allFocusable);
  };

  function getFirstVisible(dialog, elements) {
    //get first visible focusable element inside the dialog
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				dialog.firstFocusable = elements[i];
				return true;
			}
		}
  };

  function getLastVisible(dialog, elements) {
    //get last visible focusable element inside the dialog
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				dialog.lastFocusable = elements[i];
				return true;
			}
		}
  };

  function emitDialogEvents(dialog, eventName) {
    var event = new CustomEvent(eventName, {detail: dialog.selectedTrigger});
		dialog.element.dispatchEvent(event);
  };

  //initialize the Dialog objects
	var dialogs = document.getElementsByClassName('js-dialog');
	if( dialogs.length > 0 ) {
		for( var i = 0; i < dialogs.length; i++) {
			(function(i){new Dialog(dialogs[i]);})(i);
		}
	}
}());
// File#: _1_file-upload
// Usage: codyhouse.co/license
(function() {
	var InputFile = function(element) {
		this.element = element;
		this.input = this.element.getElementsByClassName('file-upload__input')[0];
		this.label = this.element.getElementsByClassName('file-upload__label')[0];
		this.multipleUpload = this.input.hasAttribute('multiple'); // allow for multiple files selection
		
		// this is the label text element -> when user selects a file, it will be changed from the default value to the name of the file 
		this.labelText = this.element.getElementsByClassName('file-upload__text')[0];
		this.initialLabel = this.labelText.textContent;

		initInputFileEvents(this);
	}; 

	function initInputFileEvents(inputFile) {
		// make label focusable
		inputFile.label.setAttribute('tabindex', '0');
		inputFile.input.setAttribute('tabindex', '-1');

		// move focus from input to label -> this is triggered when a file is selected or the file picker modal is closed
		inputFile.input.addEventListener('focusin', function(event){ 
			inputFile.label.focus();
		});

		// press 'Enter' key on label element -> trigger file selection
		inputFile.label.addEventListener('keydown', function(event) {
			if( event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {inputFile.input.click();}
		});

		// file has been selected -> update label text
		inputFile.input.addEventListener('change', function(event){ 
			updateInputLabelText(inputFile);
		});
	};

	function updateInputLabelText(inputFile) {
		var label = '';
		if(inputFile.input.files && inputFile.input.files.length < 1) { 
			label = inputFile.initialLabel; // no selection -> revert to initial label
		} else if(inputFile.multipleUpload && inputFile.input.files && inputFile.input.files.length > 1) {
			label = inputFile.input.files.length+ ' files'; // multiple selection -> show number of files
		} else {
			label = inputFile.input.value.split('\\').pop(); // single file selection -> show name of the file
		}
		inputFile.labelText.textContent = label;
	};

  //initialize the InputFile objects
	var inputFiles = document.getElementsByClassName('file-upload');
	if( inputFiles.length > 0 ) {
		for( var i = 0; i < inputFiles.length; i++) {
			(function(i){new InputFile(inputFiles[i]);})(i);
		}
	}
}());
// File#: _1_filter-navigation
// Usage: codyhouse.co/license
(function() {
  var FilterNav = function(element) {
    this.element = element;
    this.wrapper = this.element.getElementsByClassName('js-filter-nav__wrapper')[0];
    this.nav = this.element.getElementsByClassName('js-filter-nav__nav')[0];
    this.list = this.nav.getElementsByClassName('js-filter-nav__list')[0];
    this.control = this.element.getElementsByClassName('js-filter-nav__control')[0];
    this.modalClose = this.element.getElementsByClassName('js-filter-nav__close-btn')[0];
    this.placeholder = this.element.getElementsByClassName('js-filter-nav__placeholder')[0];
    this.marker = this.element.getElementsByClassName('js-filter-nav__marker');
    this.layout = 'expanded';
    initFilterNav(this);
  };

  function initFilterNav(element) {
    checkLayout(element); // init layout
    if(element.layout == 'expanded') placeMarker(element);
    element.element.addEventListener('update-layout', function(event){ // on resize - modify layout
      checkLayout(element);
    });

    // update selected item
    element.wrapper.addEventListener('click', function(event){
      var newItem = event.target.closest('.js-filter-nav__btn');
      if(newItem) {
        updateCurrentItem(element, newItem);
        return;
      }
      // close modal list - mobile version only
      if(Util.hasClass(event.target, 'js-filter-nav__wrapper') || event.target.closest('.js-filter-nav__close-btn')) toggleModalList(element, false);
    });

    // open modal list - mobile version only
    element.control.addEventListener('click', function(event){
      toggleModalList(element, true);
    });
    
    // listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control)) {
					toggleModalList(element, false);
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control) && !document.activeElement.closest('.js-filter-nav__wrapper')) toggleModalList(element, false);
			}
		});
  };

  function updateCurrentItem(element, btn) {
    if(btn.getAttribute('aria-current') == 'true') {
      toggleModalList(element, false);
      return;
    }
    var activeBtn = element.wrapper.querySelector('[aria-current]');
    if(activeBtn) activeBtn.removeAttribute('aria-current');
    btn.setAttribute('aria-current', 'true');
    // update trigger label on selection (visible on mobile only)
    element.placeholder.textContent = btn.textContent;
    toggleModalList(element, false);
    if(element.layout == 'expanded') placeMarker(element);
  };

  function toggleModalList(element, bool) {
    element.control.setAttribute('aria-expanded', bool);
    Util.toggleClass(element.wrapper, 'filter-nav__wrapper--is-visible', bool);
    if(bool) {
      element.nav.querySelectorAll('[href], button:not([disabled])')[0].focus();
    } else if(isVisible(element.control)) {
      element.control.focus();
    }
  };

  function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};

  function checkLayout(element) {
    if(element.layout == 'expanded' && switchToCollapsed(element)) { // check if there's enough space 
      element.layout = 'collapsed';
      Util.removeClass(element.element, 'filter-nav--expanded');
      Util.addClass(element.element, 'filter-nav--collapsed');
      Util.removeClass(element.modalClose, 'is-hidden');
      Util.removeClass(element.control, 'is-hidden');
    } else if(element.layout == 'collapsed' && switchToExpanded(element)) {
      element.layout = 'expanded';
      Util.addClass(element.element, 'filter-nav--expanded');
      Util.removeClass(element.element, 'filter-nav--collapsed');
      Util.addClass(element.modalClose, 'is-hidden');
      Util.addClass(element.control, 'is-hidden');
    }
    // place background element
    if(element.layout == 'expanded') placeMarker(element);
  };

  function switchToCollapsed(element) {
    return element.nav.scrollWidth > element.nav.offsetWidth;
  };

  function switchToExpanded(element) {
    element.element.style.visibility = 'hidden';
    Util.addClass(element.element, 'filter-nav--expanded');
    Util.removeClass(element.element, 'filter-nav--collapsed');
    var switchLayout = element.nav.scrollWidth <= element.nav.offsetWidth;
    Util.removeClass(element.element, 'filter-nav--expanded');
    Util.addClass(element.element, 'filter-nav--collapsed');
    element.element.style.visibility = 'visible';
    return switchLayout;
  };

  function placeMarker(element) {
    var activeElement = element.wrapper.querySelector('.js-filter-nav__btn[aria-current="true"]');
    if(element.marker.length == 0 || !activeElement ) return;
    element.marker[0].style.width = activeElement.offsetWidth+'px';
    element.marker[0].style.transform = 'translateX('+(activeElement.getBoundingClientRect().left - element.list.getBoundingClientRect().left)+'px)';
  };

  var filterNav = document.getElementsByClassName('js-filter-nav');
  if(filterNav.length > 0) {
    var filterNavArray = [];
    for(var i = 0; i < filterNav.length; i++) {
      filterNavArray.push(new FilterNav(filterNav[i]));
    }

    var resizingId = false,
      customEvent = new CustomEvent('update-layout');

    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 100);
    });

    // wait for font to be loaded
    if(document.fonts) {
      document.fonts.onloadingdone = function (fontFaceSetEvent) {
        doneResizing();
      };
    }

    function doneResizing() {
      for( var i = 0; i < filterNavArray.length; i++) {
        (function(i){filterNavArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
  }
}());
// File#: _1_filter
// Usage: codyhouse.co/license

(function() {
  var Filter = function(opts) {
    this.options = Util.extend(Filter.defaults , opts); // used to store custom filter/sort functions
    this.element = this.options.element;
    this.elementId = this.element.getAttribute('id');
    this.items = this.element.querySelectorAll('.js-filter__item');
    this.controllers = document.querySelectorAll('[aria-controls="'+this.elementId+'"]'); // controllers wrappers
    this.fallbackMessage = document.querySelector('[data-fallback-gallery-id="'+this.elementId+'"]');
    this.filterString = []; // combination of different filter values
    this.sortingString = '';  // sort value - will include order and type of argument (e.g., number or string)
    // store info about sorted/filtered items
    this.filterList = []; // list of boolean for each this.item -> true if still visible , otherwise false
    this.sortingList = []; // list of new ordered this.item -> each element is [item, originalIndex]
    
    // store grid info for animation
    this.itemsGrid = []; // grid coordinates
    this.itemsInitPosition = []; // used to store coordinates of this.items before animation
    this.itemsIterPosition = []; // used to store coordinates of this.items before animation - intermediate state
    this.itemsFinalPosition = []; // used to store coordinates of this.items after filtering
    
    // animation off
    this.animateOff = this.element.getAttribute('data-filter-animation') == 'off';
    // used to update this.itemsGrid on resize
    this.resizingId = false;
    // default acceleration style - improve animation
    this.accelerateStyle = 'will-change: transform, opacity; transform: translateZ(0); backface-visibility: hidden;';

    // handle multiple changes
    this.animating = false;
    this.reanimate = false;

    initFilter(this);
  };

  function initFilter(filter) {
    resetFilterSortArray(filter, true, true); // init array filter.filterList/filter.sortingList
    createGridInfo(filter); // store grid coordinates in filter.itemsGrid
    initItemsOrder(filter); // add data-orders so that we can reset the sorting

    // events handling - filter update
    for(var i = 0; i < filter.controllers.length; i++) {
      filter.filterString[i] = ''; // reset filtering

      // get proper filter/sorting string based on selected controllers
      (function(i){
        filter.controllers[i].addEventListener('change', function(event) {  
          if(event.target.tagName.toLowerCase() == 'select') { // select elements
            (!event.target.getAttribute('data-filter'))
              ? setSortingString(filter, event.target.value, event.target.options[event.target.selectedIndex])
              : setFilterString(filter, i, 'select');
          } else if(event.target.tagName.toLowerCase() == 'input' && (event.target.getAttribute('type') == 'radio' || event.target.getAttribute('type') == 'checkbox') ) { // input (radio/checkboxed) elements
            (!event.target.getAttribute('data-filter'))
              ? setSortingString(filter, event.target.getAttribute('data-sort'), event.target)
              : setFilterString(filter, i, 'input');
          } else {
            // generic inout element
            (!filter.controllers[i].getAttribute('data-filter'))
              ? setSortingString(filter, filter.controllers[i].getAttribute('data-sort'), filter.controllers[i])
              : setFilterString(filter, i, 'custom');
          }

          updateFilterArray(filter);
        });

        filter.controllers[i].addEventListener('click', function(event) { // retunr if target is select/input elements
          var filterEl = event.target.closest('[data-filter]');
          var sortEl = event.target.closest('[data-sort]');
          if(!filterEl && !sortEl) return;
          if(filterEl && ( filterEl.tagName.toLowerCase() == 'input' || filterEl.tagName.toLowerCase() == 'select')) return;
          if(sortEl && (sortEl.tagName.toLowerCase() == 'input' || sortEl.tagName.toLowerCase() == 'select')) return;
          if(sortEl && Util.hasClass(sortEl, 'js-filter__custom-control')) return;
          if(filterEl && Util.hasClass(filterEl, 'js-filter__custom-control')) return;
          // this will be executed only for a list of buttons -> no inputs
          event.preventDefault();
          resetControllersList(filter, i, filterEl, sortEl);
          sortEl 
            ? setSortingString(filter, sortEl.getAttribute('data-sort'), sortEl)
            : setFilterString(filter, i, 'button');
          updateFilterArray(filter);
        });

        // target search inputs -> update them on 'input'
        filter.controllers[i].addEventListener('input', function(event) {
          if(event.target.tagName.toLowerCase() == 'input' && (event.target.getAttribute('type') == 'search' || event.target.getAttribute('type') == 'text') ) {
            setFilterString(filter, i, 'custom');
            updateFilterArray(filter);
          }
        });
      })(i);
    }

    // handle resize - update grid coordinates in filter.itemsGrid
    window.addEventListener('resize', function() {
      clearTimeout(filter.resizingId);
      filter.resizingId = setTimeout(function(){createGridInfo(filter)}, 300);
    });

    // check if there are filters/sorting values already set
    checkInitialFiltering(filter);

    // reset filtering results if filter selection was changed by an external control (e.g., form reset) 
    filter.element.addEventListener('update-filter-results', function(event){
      // reset filters first
      for(var i = 0; i < filter.controllers.length; i++) filter.filterString[i] = '';
      filter.sortingString = '';
      checkInitialFiltering(filter);
    });
  };

  function checkInitialFiltering(filter) {
    for(var i = 0; i < filter.controllers.length; i++) { // check if there's a selected option
      // buttons list
      var selectedButton = filter.controllers[i].getElementsByClassName('js-filter-selected');
      if(selectedButton.length > 0) {
        var sort = selectedButton[0].getAttribute('data-sort');
        sort
          ? setSortingString(filter, selectedButton[0].getAttribute('data-sort'), selectedButton[0])
          : setFilterString(filter, i, 'button');
        continue;
      }

      // input list
      var selectedInput = filter.controllers[i].querySelectorAll('input:checked');
      if(selectedInput.length > 0) {
        var sort = selectedInput[0].getAttribute('data-sort');
        sort
          ? setSortingString(filter, sort, selectedInput[0])
          : setFilterString(filter, i, 'input');
        continue;
      }
      // select item
      if(filter.controllers[i].tagName.toLowerCase() == 'select') {
        var sort = filter.controllers[i].getAttribute('data-sort');
        sort
          ? setSortingString(filter, filter.controllers[i].value, filter.controllers[i].options[filter.controllers[i].selectedIndex])
          : setFilterString(filter, i, 'select');
         continue;
      }
      // check if there's a generic custom input
      var radioInput = filter.controllers[i].querySelector('input[type="radio"]'),
        checkboxInput = filter.controllers[i].querySelector('input[type="checkbox"]');
      if(!radioInput && !checkboxInput) {
        var sort = filter.controllers[i].getAttribute('data-sort');
        var filterString = filter.controllers[i].getAttribute('data-filter');
        if(sort) setSortingString(filter, sort, filter.controllers[i]);
        else if(filterString) setFilterString(filter, i, 'custom');
      }
    }

    updateFilterArray(filter);
  };

  function setSortingString(filter, value, item) { 
    // get sorting string value-> sortName:order:type
    var order = item.getAttribute('data-sort-order') ? 'desc' : 'asc';
    var type = item.getAttribute('data-sort-number') ? 'number' : 'string';
    filter.sortingString = value+':'+order+':'+type;
  };

  function setFilterString(filter, index, type) { 
    // get filtering array -> [filter1:filter2, filter3, filter4:filter5]
    if(type == 'input') {
      var checkedInputs = filter.controllers[index].querySelectorAll('input:checked');
      filter.filterString[index] = '';
      for(var i = 0; i < checkedInputs.length; i++) {
        filter.filterString[index] = filter.filterString[index] + checkedInputs[i].getAttribute('data-filter') + ':';
      }
    } else if(type == 'select') {
      if(filter.controllers[index].multiple) { // select with multiple options
        filter.filterString[index] = getMultipleSelectValues(filter.controllers[index]);
      } else { // select with single option
        filter.filterString[index] = filter.controllers[index].value;
      }
    } else if(type == 'button') {
      var selectedButtons = filter.controllers[index].querySelectorAll('.js-filter-selected');
      filter.filterString[index] = '';
      for(var i = 0; i < selectedButtons.length; i++) {
        filter.filterString[index] = filter.filterString[index] + selectedButtons[i].getAttribute('data-filter') + ':';
      }
    } else if(type == 'custom') {
      filter.filterString[index] = filter.controllers[index].getAttribute('data-filter');
    }
  };

  function resetControllersList(filter, index, target1, target2) {
    // for a <button>s list -> toggle js-filter-selected + custom classes
    var multi = filter.controllers[index].getAttribute('data-filter-checkbox'),
      customClass = filter.controllers[index].getAttribute('data-selected-class');
    
    customClass = (customClass) ? 'js-filter-selected '+ customClass : 'js-filter-selected';
    if(multi == 'true') { // multiple options can be on
      (target1) 
        ? Util.toggleClass(target1, customClass, !Util.hasClass(target1, 'js-filter-selected'))
        : Util.toggleClass(target2, customClass, !Util.hasClass(target2, 'js-filter-selected'));
    } else { // only one element at the time
      // remove the class from all siblings
      var selectedOption = filter.controllers[index].querySelector('.js-filter-selected');
      if(selectedOption) Util.removeClass(selectedOption, customClass);
      (target1) 
        ? Util.addClass(target1, customClass)
        : Util.addClass(target2, customClass);
    }
  };

  function updateFilterArray(filter) { // sort/filter strings have been updated -> so you can update the gallery
    if(filter.animating) {
      filter.reanimate = true;
      return;
    }
    filter.animating = true;
    filter.reanimate = false;
    createGridInfo(filter); // get new grid coordinates
    sortingGallery(filter); // update sorting list 
    filteringGallery(filter); // update filter list
    resetFallbackMessage(filter, true); // toggle fallback message
    if(reducedMotion || filter.animateOff) {
      resetItems(filter);
    } else {
      updateItemsAttributes(filter);
    }
  };

  function sortingGallery(filter) {
    // use sorting string to reorder gallery
    var sortOptions = filter.sortingString.split(':');
    if(sortOptions[0] == '' || sortOptions[0] == '*') {
      // no sorting needed
      restoreSortOrder(filter);
    } else { // need to sort
      if(filter.options[sortOptions[0]]) { // custom sort function -> user takes care of it
        filter.sortingList = filter.options[sortOptions[0]](filter.sortingList);
      } else {
        filter.sortingList.sort(function(left, right) {
          var leftVal = left[0].getAttribute('data-sort-'+sortOptions[0]),
          rightVal = right[0].getAttribute('data-sort-'+sortOptions[0]);
          if(sortOptions[2] == 'number') {
            leftVal = parseFloat(leftVal);
            rightVal = parseFloat(rightVal);
          }
          if(sortOptions[1] == 'desc') return leftVal <= rightVal ? 1 : -1;
          else return leftVal >= rightVal ? 1 : -1;
        });
      }
    }
  };

  function filteringGallery(filter) {
    // use filtering string to reorder gallery
    resetFilterSortArray(filter, true, false);
    // we can have multiple filters
    for(var i = 0; i < filter.filterString.length; i++) {
      //check if multiple filters inside the same controller
      if(filter.filterString[i] != '' && filter.filterString[i] != '*' && filter.filterString[i] != ' ') {
        singleFilterGallery(filter, filter.filterString[i].split(':'));
      }
    }
  };

  function singleFilterGallery(filter, subfilter) {
    if(!subfilter || subfilter == '' || subfilter == '*') return;
    // check if we have custom options
    var customFilterArray = [];
    for(var j = 0; j < subfilter.length; j++) {
      if(filter.options[subfilter[j]]) { // custom function
        customFilterArray[subfilter[j]] = filter.options[subfilter[j]](filter.items);
      }
    }

    for(var i = 0; i < filter.items.length; i++) {
      var filterValues = filter.items[i].getAttribute('data-filter').split(' ');
      var present = false;
      for(var j = 0; j < subfilter.length; j++) {
        if(filter.options[subfilter[j]] && customFilterArray[subfilter[j]][i]) { // custom function
          present = true;
          break;
        } else if(subfilter[j] == '*' || filterValues.indexOf(subfilter[j]) > -1) {
          present = true;
          break;
        }
      }
      filter.filterList[i] = !present ? false : filter.filterList[i];
    }
  };

  function updateItemsAttributes(filter) { // set items before triggering the update animation
    // get offset of all elements before animation
    storeOffset(filter, filter.itemsInitPosition);
    // set height of container
    filter.element.setAttribute('style', 'height: '+parseFloat(filter.element.offsetHeight)+'px; width: '+parseFloat(filter.element.offsetWidth)+'px;');

    for(var i = 0; i < filter.items.length; i++) { // remove is-hidden class from items now visible and scale to zero
      if( Util.hasClass(filter.items[i], 'is-hidden') && filter.filterList[i]) {
        filter.items[i].setAttribute('data-scale', 'on');
        filter.items[i].setAttribute('style', filter.accelerateStyle+'transform: scale(0.5); opacity: 0;')
        Util.removeClass(filter.items[i], 'is-hidden');
      }
    }
    // get new elements offset
    storeOffset(filter, filter.itemsIterPosition);
    // translate items so that they are in the right initial position
    for(var i = 0; i < filter.items.length; i++) {
      if( filter.items[i].getAttribute('data-scale') != 'on') {
        filter.items[i].setAttribute('style', filter.accelerateStyle+'transform: translateX('+parseInt(filter.itemsInitPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsInitPosition[i][1] - filter.itemsIterPosition[i][1])+'px);');
      }
    }

    animateItems(filter)
  };

  function animateItems(filter) {
    var transitionValue = 'transform '+filter.options.duration+'ms cubic-bezier(0.455, 0.03, 0.515, 0.955), opacity '+filter.options.duration+'ms';

    // get new index of items in the list
    var j = 0;
    for(var i = 0; i < filter.sortingList.length; i++) {
      var item = filter.items[filter.sortingList[i][1]];
        
      if(Util.hasClass(item, 'is-hidden') || !filter.filterList[filter.sortingList[i][1]]) {
        // item is hidden or was previously hidden -> final position equal to first one
        filter.itemsFinalPosition[filter.sortingList[i][1]] = filter.itemsIterPosition[filter.sortingList[i][1]];
        if(item.getAttribute('data-scale') == 'on') j = j + 1; 
      } else {
        filter.itemsFinalPosition[filter.sortingList[i][1]] = [filter.itemsGrid[j][0], filter.itemsGrid[j][1]]; // left/top
        j = j + 1; 
      }
    } 

    setTimeout(function(){
      for(var i = 0; i < filter.items.length; i++) {
        if(filter.filterList[i] && filter.items[i].getAttribute('data-scale') == 'on') { // scale up item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: translateX('+parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1])+'px) scale(1); opacity: 1;');
        } else if(filter.filterList[i]) { // translate item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: translateX('+parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1])+'px);');
        } else { // scale down item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: scale(0.5); opacity: 0;');
        }
      };
    }, 50);  
    
    // wait for the end of transition of visible elements
    setTimeout(function(){
      resetItems(filter);
    }, (filter.options.duration + 100));
  };

  function resetItems(filter) {
    // animation was off or animation is over -> reset attributes
    for(var i = 0; i < filter.items.length; i++) {
      filter.items[i].removeAttribute('style');
      Util.toggleClass(filter.items[i], 'is-hidden', !filter.filterList[i]);
      filter.items[i].removeAttribute('data-scale');
    }
    
    for(var i = 0; i < filter.items.length; i++) {// reorder
      filter.element.appendChild(filter.items[filter.sortingList[i][1]]);
    }

    filter.items = [];
    filter.items = filter.element.querySelectorAll('.js-filter__item');
    resetFilterSortArray(filter, false, true);
    filter.element.removeAttribute('style');
    filter.animating = false;
    if(filter.reanimate) {
      updateFilterArray(filter);
    }

    resetFallbackMessage(filter, false); // toggle fallback message

    // emit custom event - end of filtering
    filter.element.dispatchEvent(new CustomEvent('filter-selection-updated'));
  };

  function resetFilterSortArray(filter, filtering, sorting) {
    for(var i = 0; i < filter.items.length; i++) {
      if(filtering) filter.filterList[i] = true;
      if(sorting) filter.sortingList[i] = [filter.items[i], i];
    }
  };

  function createGridInfo(filter) {
    var containerWidth = parseFloat(window.getComputedStyle(filter.element).getPropertyValue('width')),
      itemStyle, itemWidth, itemHeight, marginX, marginY, colNumber;

    // get offset first visible element
    for(var i = 0; i < filter.items.length; i++) {
      if( !Util.hasClass(filter.items[i], 'is-hidden') ) {
        itemStyle = window.getComputedStyle(filter.items[i]),
        itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
        itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
        marginX = parseFloat(itemStyle.getPropertyValue('margin-left')) + parseFloat(itemStyle.getPropertyValue('margin-right')),
        marginY = parseFloat(itemStyle.getPropertyValue('margin-bottom')) + parseFloat(itemStyle.getPropertyValue('margin-top'));
        if(marginX == 0 && marginY == 0) {
          // grid is set using the gap property and not margins
          var margins = resetMarginValues(filter);
          marginX = margins[0];
          marginY = margins[1];
        }
        var colNumber = parseInt((containerWidth + marginX)/(itemWidth+marginX));
        filter.itemsGrid[0] = [filter.items[i].offsetLeft, filter.items[i].offsetTop]; // left, top
        break;
      }
    }

    for(var i = 1; i < filter.items.length; i++) {
      var x = i < colNumber ? i : i % colNumber,
        y = i < colNumber ? 0 : Math.floor(i/colNumber);
      filter.itemsGrid[i] = [filter.itemsGrid[0][0] + x*(itemWidth+marginX), filter.itemsGrid[0][1] + y*(itemHeight+marginY)];
    }
  };

  function storeOffset(filter, array) {
    for(var i = 0; i < filter.items.length; i++) {
      array[i] = [filter.items[i].offsetLeft, filter.items[i].offsetTop];
    }
  };

  function initItemsOrder(filter) {
    for(var i = 0; i < filter.items.length; i++) {
      filter.items[i].setAttribute('data-init-sort-order', i);
    }
  };

  function restoreSortOrder(filter) {
    for(var i = 0; i < filter.items.length; i++) {
      filter.sortingList[parseInt(filter.items[i].getAttribute('data-init-sort-order'))] = [filter.items[i], i];
    }
  };

  function resetFallbackMessage(filter, bool) {
    if(!filter.fallbackMessage) return;
    var show = true;
    for(var i = 0; i < filter.filterList.length; i++) {
      if(filter.filterList[i]) {
        show = false;
        break;
      }
    };
    if(bool) { // reset visibility before animation is triggered
      if(!show) Util.addClass(filter.fallbackMessage, 'is-hidden');
      return;
    }
    Util.toggleClass(filter.fallbackMessage, 'is-hidden', !show);
  };

  function getMultipleSelectValues(multipleSelect) {
    // get selected options of a <select multiple> element
    var options = multipleSelect.options,
      value = '';
    for(var i = 0; i < options.length; i++) {
      if(options[i].selected) {
        if(value != '') value = value + ':';
        value = value + options[i].value;
      }
    }
    return value;
  };

  function resetMarginValues(filter) {
    var gapX = getComputedStyle(filter.element).getPropertyValue('--gap-x'),
      gapY = getComputedStyle(filter.element).getPropertyValue('--gap-y'),
      gap = getComputedStyle(filter.element).getPropertyValue('--gap'),
      gridGap = [0, 0];
    // tif the gap property is used to create the grid (not margin left/right) -> get gap values rather than margins
    // check if the --gap/--gap-x/--gap-y
    var newDiv = document.createElement('div'),
      cssText = 'position: absolute; opacity: 0; width: 0px; height: 0px';
    if(gapX && gapY) {
      cssText = 'position: absolute; opacity: 0; width: '+gapX+'; height: '+gapY;
    } else if(gap) {
      cssText = 'position: absolute; opacity: 0; width: '+gap+'; height: '+gap;
    } else if(gapX) {
      cssText = 'position: absolute; opacity: 0; width: '+gapX+'; height: 0px';
    } else if(gapY) {
      cssText = 'position: absolute; opacity: 0; width: 0px; height: '+gapY;
    }
    newDiv.style.cssText = cssText;
    document.body.appendChild(newDiv);
    gridGap = [newDiv.offsetWidth, newDiv.offsetHeight];
    document.body.removeChild(newDiv);
    return gridGap;
  };

  Filter.defaults = {
    element : false,
    duration: 400
  };

  window.Filter = Filter;

  // init Filter object
  var filterGallery = document.getElementsByClassName('js-filter'),
    reducedMotion = Util.osHasReducedMotion();
  if( filterGallery.length > 0 ) {
    for( var i = 0; i < filterGallery.length; i++) {
      var duration = filterGallery[i].getAttribute('data-filter-duration');
      if(!duration) duration = Filter.defaults.duration;
      new Filter({element: filterGallery[i], duration: duration});
    }
  }
}());
// File#: _1_flash-message
// Usage: codyhouse.co/license
(function() {
	var FlashMessage = function(element) {
		this.element = element;
		this.showClass = "flash-message--is-visible";
		this.messageDuration = parseInt(this.element.getAttribute('data-duration')) || 3000;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.temeoutId = null;
		this.isVisible = false;
		this.initFlashMessage();
	};

	FlashMessage.prototype.initFlashMessage = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( self.triggers ) {
			for(var i = 0; i < self.triggers.length; i++) {
				self.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					self.showFlashMessage();
				});
			}
		}
		//listen to the event that triggers the opening of a flash message
		self.element.addEventListener('showFlashMessage', function(){
			self.showFlashMessage();
		});
	};

	FlashMessage.prototype.showFlashMessage = function() {
		var self = this;
		Util.addClass(self.element, self.showClass);
		self.isVisible = true;
		//hide other flash messages
		self.hideOtherFlashMessages();
		if( self.messageDuration > 0 ) {
			//hide the message after an interveal (this.messageDuration)
			self.temeoutId = setTimeout(function(){
				self.hideFlashMessage();
			}, self.messageDuration);
		}
	};

	FlashMessage.prototype.hideFlashMessage = function() {
		Util.removeClass(this.element, this.showClass);
		this.isVisible = false;
		//reset timeout
		clearTimeout(this.temeoutId);
		this.temeoutId = null;
	};

	FlashMessage.prototype.hideOtherFlashMessages = function() {
		var event = new CustomEvent('flashMessageShown', { detail: this.element });
		window.dispatchEvent(event);
	};

	FlashMessage.prototype.checkFlashMessage = function(message) {
		if( !this.isVisible ) return; 
		if( this.element == message) return;
		this.hideFlashMessage();
	};

	//initialize the FlashMessage objects
	var flashMessages = document.getElementsByClassName('js-flash-message');
	if( flashMessages.length > 0 ) {
		var flashMessagesArray = [];
		for( var i = 0; i < flashMessages.length; i++) {
			(function(i){flashMessagesArray.push(new FlashMessage(flashMessages[i]));})(i);
		}

		//listen for a flash message to be shown -> close the others
		window.addEventListener('flashMessageShown', function(event){
			flashMessagesArray.forEach(function(element){
				element.checkFlashMessage(event.detail);
			});
		});
	}
}());
// File#: _1_floating-action-button
// Usage: codyhouse.co/license
(function() {
  var Fab = function(element) {
		this.element = element;
		this.fabButton = this.element.getElementsByClassName('js-fab__btn');
    this.fabPopover = this.element.getElementsByClassName('js-fab__popover');
    this.fabPopoverInner = this.element.getElementsByClassName('js-fab__popover-inner');
    this.visibleClass = 'fab--active';
    this.animating = false;
    // focusable elements
    this.firstFocusable = false;
		this.lastFocusable = false;
    // offset variables
    this.offsetIn = 0;
    this.offsetOut = 0;
    this.targetIn = this.element.getAttribute('data-target-in') ? document.querySelector(this.element.getAttribute('data-target-in')) : false;
    this.targetOut = this.element.getAttribute('data-target-out') ? document.querySelector(this.element.getAttribute('data-target-out')) : false;
    if(this.fabButton.length < 1 || this.fabPopover.length < 1) return;
		initFab(this);
	};

  // public methods
  Fab.prototype.setVariables = function() {
		setFabVariables(this);
	};

  Fab.prototype.resetVisibility = function() {
		resetFabVisibility(this);
	};

  // private methods
  function initFab(element) {
    resetFabVisibility(element);
    setFabVariables(element);
    initFabEvents(element);
  };

  function setFabVariables(element) {
    // set CSS variables
    element.fabPopoverInner[0].style.height = '';
    var height = element.fabPopover[0].offsetHeight+'px';

    element.element.style.setProperty('--fab-popover-height', height);
    element.fabPopoverInner[0].style.height = height;
  };

  function initFabEvents(element) {
    if(document.fonts) {
      // wait for fonts to be loaded and set popover height
      document.fonts.ready.then(function() {
        setFabVariables(element);
      });
    }

    // toggle popover when clicking on fab button
    element.fabButton[0].addEventListener('click', function() {
      if(element.animating) return;
      element.animating = true;
      toggleFab(element);
    });

    // close popover when clicking on fab background
    element.element.addEventListener('click', function(event){
      if(!event.target.closest('.js-fab__btn') && !event.target.closest('.js-fab__popover-inner')) toggleFab(element);
    });

    // trap focus
    element.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(element, event);
      } else if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        if(Util.hasClass(element.element, element.visibleClass)) toggleFab(element);
      }
    });
  };

  function toggleFab(element) {
    var isOpen = Util.hasClass(element.element, element.visibleClass);

    if(isOpen) {
      Util.removeClass(element.element, element.visibleClass);
      element.fabButton[0].removeAttribute('aria-expanded');
      element.fabButton[0].focus();
    } else {
      Util.addClass(element.element, element.visibleClass);
      element.fabButton[0].setAttribute('aria-expanded', 'true');
    }

    // wait for the end of the transition
    element.fabPopover[0].addEventListener('transitionend', function cb(){
      element.animating = false;
      element.fabPopover[0].removeEventListener('transitionend', cb);
      if(!isOpen) focusPopover(element);
    });
  };

  function focusPopover(element) {
    getFocusableElements(element);
    if(element.firstFocusable) {
			element.firstFocusable.focus();
		}
  };

  // trapping focus
  function getFocusableElements(element) {
    // get all focusable elements inside the popover
		var allFocusable = element.fabPopover[0].querySelectorAll(focusableElString);
		getFirstVisible(element, allFocusable);
		getLastVisible(element, allFocusable);
  };

  function getFirstVisible(element, focusableElments) {
		// get first visible focusable element inside the popover
		for(var i = 0; i < focusableElments.length; i++) {
			if( isVisible(focusableElments[i]) ) {
				element.firstFocusable = focusableElments[i];
				break;
			}
		}
	};

  function getLastVisible(element, focusableElments) {
		// get last visible focusable element inside the popover
		for(var i = focusableElments.length - 1; i >= 0; i--) {
			if( isVisible(focusableElments[i]) ) {
				element.lastFocusable = focusableElments[i];
				break;
			}
		}
  };

  function trapFocus(element, event) {
    if( element.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of popover
			event.preventDefault();
			element.lastFocusable.focus();
		}
		if( element.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of popover
			event.preventDefault();
			element.firstFocusable.focus();
		}
  };

  function isVisible(element) {
		// check if element is visible
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

  // offset functions 
  function resetFabVisibility(element) {
    getFabBtnOffsets(element); // get offset values - show/hide fab button 
    var scrollTop = document.documentElement.scrollTop,
      topTarget = false,
      bottomTarget = false;
    if(element.offsetIn <= scrollTop || element.offsetIn == 0) {
      topTarget = true;
    }
    if(element.offsetOut == 0 || scrollTop < element.offsetOut) {
      bottomTarget = true;
    }
    Util.toggleClass(element.element, 'fab--in', bottomTarget && topTarget);

    // if popover is visible -> close it
    if( (!bottomTarget || !topTarget) && Util.hasClass(element.element, element.visibleClass)) toggleFab(element);
  };

  function getFabBtnOffsets(element) { // get offset in and offset out values
    // update offsetIn
    element.offsetIn = 0;
    if(element.targetIn) {
      var boundingClientRect = element.targetIn.getBoundingClientRect();
      element.offsetIn = boundingClientRect.top + document.documentElement.scrollTop + boundingClientRect.height;
    }
    var dataOffsetIn = element.element.getAttribute('data-offset-in');
    if(dataOffsetIn) {
      element.offsetIn = element.offsetIn + parseInt(dataOffsetIn);
    }
    // update offsetOut
    element.offsetOut = 0;
    if(element.targetOut) {
      var boundingClientRect = element.targetOut.getBoundingClientRect();
      element.offsetOut = boundingClientRect.top + document.documentElement.scrollTop - window.innerHeight;
    }
    var dataOffsetOut = element.element.getAttribute('data-offset-out');
    if(dataOffsetOut) {
      element.offsetOut = element.offsetOut + parseInt(dataOffsetOut);
    }
  };

  //initialize the Fab objects
	var fabs = document.getElementsByClassName('js-fab');
  // generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( fabs.length > 0 ) {
		var fabsArray = [];
		for( var i = 0; i < fabs.length; i++) {
			(function(i){fabsArray.push(new Fab(fabs[i]));})(i);
		}

    // reset fab height on resize
    var resizingId = false;

    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing);
    });

    window.addEventListener('scroll', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneScrolling);
    });

    function doneResizing() {
      fabsArray.forEach(function(element){
				element.setVariables();
        element.resetVisibility();
			});
    };

    function doneScrolling() {
      fabsArray.forEach(function(element){
				element.resetVisibility();
			});
    };
	}
}());
// File#: _1_floating-label
// Usage: codyhouse.co/license
(function() {
	var floatingLabels = document.getElementsByClassName('floating-label');
	if( floatingLabels.length > 0 ) {
		var placeholderSupported = checkPlaceholderSupport(); // check if browser supports :placeholder
		for(var i = 0; i < floatingLabels.length; i++) {
			(function(i){initFloatingLabel(floatingLabels[i])})(i);
		}

		function initFloatingLabel(element) {
			if(!placeholderSupported) { // :placeholder is not supported -> show label right away
				Util.addClass(element.getElementsByClassName('form-label')[0], 'form-label--floating');
				return;
			}
			var input = element.getElementsByClassName('form-control')[0];
			input.addEventListener('input', function(event){
				resetFloatingLabel(element, input);
			});
		};

		function resetFloatingLabel(element, input) { // show label if input is not empty
			Util.toggleClass(element.getElementsByClassName('form-label')[0], 'form-label--floating', input.value.length > 0);
		};

		function checkPlaceholderSupport() {
			var input = document.createElement('input');
    	return ('placeholder' in input);
		};
	}
}());
// File#: _1_form-validator
// Usage: codyhouse.co/license
(function() {
  var FormValidator = function(opts) {
    this.options = Util.extend(FormValidator.defaults , opts);
		this.element = this.options.element;
    this.input = [];
    this.textarea = [];
    this.select = [];
    this.errorFields = [];
    this.errorFieldListeners = [];
		initFormValidator(this);
	};

  //public functions
  FormValidator.prototype.validate = function(cb) {
    validateForm(this);
    if(cb) cb(this.errorFields);
  };

  // private methods
  function initFormValidator(formValidator) {
    formValidator.input = formValidator.element.querySelectorAll('input');
    formValidator.textarea = formValidator.element.querySelectorAll('textarea');
    formValidator.select = formValidator.element.querySelectorAll('select');
  };

  function validateForm(formValidator) {
    // reset input with errors
    formValidator.errorFields = []; 
    // remove change/input events from fields with error
    resetEventListeners(formValidator);
    
    // loop through fields and push to errorFields if there are errors
    for(var i = 0; i < formValidator.input.length; i++) {
      validateField(formValidator, formValidator.input[i]);
    }

    for(var i = 0; i < formValidator.textarea.length; i++) {
      validateField(formValidator, formValidator.textarea[i]);
    }

    for(var i = 0; i < formValidator.select.length; i++) {
      validateField(formValidator, formValidator.select[i]);
    }

    // show errors if any was found
    for(var i = 0; i < formValidator.errorFields.length; i++) {
      showError(formValidator, formValidator.errorFields[i]);
    }

    // move focus to first field with error
    if(formValidator.errorFields.length > 0) formValidator.errorFields[0].focus();
  };

  function validateField(formValidator, field) {
    if(!field.checkValidity()) {
      formValidator.errorFields.push(field);
      return;
    }
    // check for custom functions
    var customValidate = field.getAttribute('data-validate');
    if(customValidate && formValidator.options.customValidate[customValidate]) {
      formValidator.options.customValidate[customValidate](field, function(result) {
        if(!result) formValidator.errorFields.push(field);
      });
    }
  };

  function showError(formValidator, field) {
    // add error classes
    toggleErrorClasses(formValidator, field, true);

    // add event listener
    var index = formValidator.errorFieldListeners.length;
    formValidator.errorFieldListeners[index] = function() {
      toggleErrorClasses(formValidator, field, false);
      field.removeEventListener('change', formValidator.errorFieldListeners[index]);
      field.removeEventListener('input', formValidator.errorFieldListeners[index]);
    };
    field.addEventListener('change', formValidator.errorFieldListeners[index]);
    field.addEventListener('input', formValidator.errorFieldListeners[index]);
  };

  function toggleErrorClasses(formValidator, field, bool) {
    bool ? Util.addClass(field, formValidator.options.inputErrorClass) : Util.removeClass(field, formValidator.options.inputErrorClass);
    if(formValidator.options.inputWrapperErrorClass) {
      var wrapper = field.closest('.js-form-validate__input-wrapper');
      if(wrapper) {
        bool ? Util.addClass(wrapper, formValidator.options.inputWrapperErrorClass) : Util.removeClass(wrapper, formValidator.options.inputWrapperErrorClass);
      }
    }
  };

  function resetEventListeners(formValidator) {
    for(var i = 0; i < formValidator.errorFields.length; i++) {
      toggleErrorClasses(formValidator, formValidator.errorFields[i], false);
      formValidator.errorFields[i].removeEventListener('change', formValidator.errorFieldListeners[i]);
      formValidator.errorFields[i].removeEventListener('input', formValidator.errorFieldListeners[i]);
    }

    formValidator.errorFields = [];
    formValidator.errorFieldListeners = [];
  };
  
  FormValidator.defaults = {
    element : '',
    inputErrorClass : 'form-control--error',
    inputWrapperErrorClass: 'form-validate__input-wrapper--error',
    customValidate: {}
  };
  window.FormValidator = FormValidator;
}());
// File#: _1_immersive-section-transition
// Usage: codyhouse.co/license
(function() {
  var ImmerseSectionTr = function(element) {
    this.element = element;
    this.media = this.element.getElementsByClassName('js-immerse-section-tr__media');
    this.scrollContent = this.element.getElementsByClassName('js-immerse-section-tr__content');
    if(this.media.length < 1) return;
    this.figure = this.media[0].getElementsByClassName('js-immerse-section-tr__figure');
    if(this.figure.length < 1) return;
    this.visibleFigure = false;
    this.mediaScale = 1;
    this.mediaInitHeight = 0;
    this.elementPadding = 0;
    this.scrollingFn = false;
    this.scrolling = false;
    this.active = false;
    this.scrollDelta = 0; // amount to scroll for full-screen scaleup
    initImmerseSectionTr(this);
  };

  function initImmerseSectionTr(element) {
    initContainer(element);
    resetSection(element);

    // listen to resize event and reset values
    element.element.addEventListener('update-immerse-section', function(event){
      resetSection(element);
    });

    // detect when the element is sticky - update scale value and opacity layer 
    var observer = new IntersectionObserver(immerseSectionTrCallback.bind(element));
    observer.observe(element.media[0]);
  };

  function resetSection(element) {
    getVisibleFigure(element);
    checkEffectActive(element);
    if(element.active) {
      Util.removeClass(element.element, 'immerse-section-tr--disabled');
      updateMediaHeight(element);
      getMediaScale(element); 
      updateMargin(element);
      setScaleValue.bind(element)();
    } else {
      // reset appearance
      Util.addClass(element.element, 'immerse-section-tr--disabled');
      element.media[0].style = '';
      element.scrollContent[0].style = '';
      updateScale(element, 1);
      updateOpacity(element, 0);
    }
    element.element.dispatchEvent(new CustomEvent('immersive-section-updated', {detail: {active: element.active, asset: element.visibleFigure}}));
  };

  function getVisibleFigure(element) { // get visible figure element
    element.visibleFigure = false;
    for(var i = 0; i < element.figure.length; i++) {
      if(window.getComputedStyle(element.figure[i]).getPropertyValue('display') != 'none') {
        element.visibleFigure = element.figure[i];
        break;
      }
    }
  };

  function updateMediaHeight(element) { // set sticky element padding/margin + height
    element.mediaInitHeight = element.visibleFigure.offsetHeight;
    element.scrollDelta = (window.innerHeight - element.visibleFigure.offsetHeight) > (window.innerWidth - element.visibleFigure.offsetWidth)
      ? (window.innerHeight - element.visibleFigure.offsetHeight)/2
      : (window.innerWidth - element.visibleFigure.offsetWidth)/2;
    if(element.scrollDelta > window.innerHeight) element.scrollDelta = window.innerHeight;
    if(element.scrollDelta < 200) element.scrollDelta = 200;
    element.media[0].style.height = window.innerHeight+'px';
    element.media[0].style.paddingTop = (window.innerHeight - element.visibleFigure.offsetHeight)/2+'px';
    element.media[0].style.marginTop = (element.visibleFigure.offsetHeight - window.innerHeight)/2+'px';
  };

  function getMediaScale(element) { // get media final scale value
    var scaleX = roundValue(window.innerWidth/element.visibleFigure.offsetWidth),
      scaleY = roundValue(window.innerHeight/element.visibleFigure.offsetHeight);

    element.mediaScale = Math.max(scaleX, scaleY);
    element.elementPadding = parseInt(window.getComputedStyle(element.element).getPropertyValue('padding-top'));
  };

  function roundValue(value) {
    return (Math.ceil(value*100)/100).toFixed(2);
  };

  function updateMargin(element) { // update distance between media and content elements
    if(element.scrollContent.length > 0) element.scrollContent[0].style.marginTop = element.scrollDelta+'px';
  };

  function setScaleValue() { // update asset scale value
    if(!this.active) return; // effect is not active
    var offsetTop = (window.innerHeight - this.mediaInitHeight)/2;
    var top = this.element.getBoundingClientRect().top + this.elementPadding;

    if( top < offsetTop && top > offsetTop - this.scrollDelta) {
      var scale = 1 + (top - offsetTop)*(1 - this.mediaScale)/this.scrollDelta;
      updateScale(this, scale);
      updateOpacity(this, 0);
    } else if(top >= offsetTop) {
      updateScale(this, 1);
      updateOpacity(this, 0);
    } else {
      updateScale(this, this.mediaScale);
      updateOpacity(this, 1.8*( offsetTop - this.scrollDelta - top)/ window.innerHeight);
    }

    this.scrolling = false;
  };

  function updateScale(element, value) { // apply new scale value
    element.visibleFigure.style.transform = 'scale('+value+')';
    element.visibleFigure.style.msTransform = 'scale('+value+')';
  };

  function updateOpacity(element, value) { // update layer opacity
    element.element.style.setProperty('--immerse-section-tr-opacity', value);
  };

  function immerseSectionTrCallback(entries) { // intersectionObserver callback
    if(entries[0].isIntersecting) {
      if(this.scrollingFn) return; // listener for scroll event already added
      immerseSectionTrScrollEvent(this);
    } else {
      if(!this.scrollingFn) return; // listener for scroll event already removed
      window.removeEventListener('scroll', this.scrollingFn);
      this.scrollingFn = false;
    }
  };

  function immerseSectionTrScrollEvent(element) { // listen to scroll when asset element is inside the viewport
    element.scrollingFn = immerseSectionTrScrolling.bind(element);
    window.addEventListener('scroll', element.scrollingFn);
  };

  function immerseSectionTrScrolling() { // update asset scale on scroll
    if(this.scrolling) return;
    this.scrolling = true;
    window.requestAnimationFrame(setScaleValue.bind(this));
  };

  function initContainer(element) {
    // add a padding to the container to fix the collapsing-margin issue
    if(parseInt(window.getComputedStyle(element.element).getPropertyValue('padding-top')) == 0) element.element.style.paddingTop = '1px';
  };

  function checkEffectActive(element) { //check if effect needs to be activated
    element.active = true;
    if(element.visibleFigure.offsetHeight >= window.innerHeight) element.active = false;
    if( window.innerHeight - element.visibleFigure.offsetHeight >= 600) element.active = false;
  };

  //initialize the ImmerseSectionTr objects
  var immerseSections = document.getElementsByClassName('js-immerse-section-tr'),
    reducedMotion = Util.osHasReducedMotion(),
    intObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);

  if(immerseSections.length < 1 ) return;
	if( !reducedMotion && intObserverSupported) {
    var immerseSectionsArray = [];
		for( var i = 0; i < immerseSections.length; i++) {
      (function(i){immerseSectionsArray.push(new ImmerseSectionTr(immerseSections[i]));})(i);
    }

    if(immerseSectionsArray.length > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-immerse-section');
      
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });

      function doneResizing() {
        for( var i = 0; i < immerseSectionsArray.length; i++) {
          (function(i){immerseSectionsArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };
    };
  } else { // effect deactivated
    for( var i = 0; i < immerseSections.length; i++) Util.addClass(immerseSections[i], 'immerse-section-tr--disabled');
  }
}());
// File#: _1_looping_tabs
// Usage: codyhouse.co/license
(function() { 
  var LoopTab = function(opts) {
    this.options = Util.extend(LoopTab.defaults , opts);
		this.element = this.options.element;
		this.tabList = this.element.getElementsByClassName('js-loop-tabs__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-loop-tabs__panels')[0];
    this.panels = Util.getChildrenByClassName(this.panelsList, 'js-loop-tabs__panel');
    this.assetsList = this.element.getElementsByClassName('js-loop-tabs__assets')[0];
		this.assets = this.assetsList.getElementsByTagName('li');
		this.videos = getVideoElements(this);
    this.panelShowClass = 'loop-tabs__panel--selected';
		this.assetShowClass = 'loop-tabs__asset--selected';
		this.assetExitClass = 'loop-tabs__asset--exit';
    this.controlActiveClass = 'loop-tabs__control--selected';
    // autoplay
    this.autoplayPaused = false;
		this.loopTabAutoId = false;
		this.loopFillAutoId = false;
		this.loopFill = 0;
		initLoopTab(this);
	};
	
	function getVideoElements(tab) {
		var videos = [];
		for(var i = 0; i < tab.assets.length; i++) {
			var video = tab.assets[i].getElementsByTagName('video');
			videos[i] = video.length > 0 ? video[0] : false;
		}
		return videos;
	};
  
  function initLoopTab(tab) {
    //set initial aria attributes
		tab.tabList.setAttribute('role', 'tablist');
		for( var i = 0; i < tab.triggers.length; i++) {
			var bool = Util.hasClass(tab.triggers[i], tab.controlActiveClass),
        panelId = tab.panels[i].getAttribute('id');
			tab.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(tab.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(tab.triggers[i], 'js-loop-tabs__trigger'); 
      Util.setAttributes(tab.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
      Util.toggleClass(tab.panels[i], tab.panelShowClass, bool);
			Util.toggleClass(tab.assets[i], tab.assetShowClass, bool);
			
			resetVideo(tab, i, bool); // play/pause video if available

			if(!bool) tab.triggers[i].setAttribute('tabindex', '-1'); 
		}
		// add autoplay-off class if needed
		!tab.options.autoplay && Util.addClass(tab.element, 'loop-tabs--autoplay-off');
		//listen for Tab events
		initLoopTabEvents(tab);
  };

  function initLoopTabEvents(tab) {
		if(tab.options.autoplay) { 
			initLoopTabAutoplay(tab); // init autoplay
			// pause autoplay if user is interacting with the tabs
			tab.element.addEventListener('focusin', function(event){
				pauseLoopTabAutoplay(tab);
				tab.autoplayPaused = true;
			});
			tab.element.addEventListener('focusout', function(event){
				tab.autoplayPaused = false;
				initLoopTabAutoplay(tab);
			});
		}

    //click on a new tab -> select content
		tab.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-loop-tabs__trigger') ) triggerLoopTab(tab, event.target.closest('.js-loop-tabs__trigger'), event);
		});
		
    //arrow keys to navigate through tabs 
		tab.tabList.addEventListener('keydown', function(event) {
			if( !event.target.closest('.js-loop-tabs__trigger') ) return;
			if( event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright' ) {
				pauseLoopTabAutoplay(tab);
				selectNewLoopTab(tab, 'next', true);
			} else if( event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft' ) {
				pauseLoopTabAutoplay(tab);
				selectNewLoopTab(tab, 'prev', true);
			}
		});
  };

  function initLoopTabAutoplay(tab) {
		if(!tab.options.autoplay || tab.autoplayPaused) return;
		tab.loopFill = 0;
		var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass)[0];
		// reset css variables
		for(var i = 0; i < tab.triggers.length; i++) {
			if(cssVariableSupport) tab.triggers[i].style.setProperty('--loop-tabs-filling', 0);
		}
		
		tab.loopTabAutoId = setTimeout(function(){
      selectNewLoopTab(tab, 'next', false);
		}, tab.options.autoplayInterval);
		
		if(cssVariableSupport) { // tab fill effect
			tab.loopFillAutoId = setInterval(function(){
				tab.loopFill = tab.loopFill + 0.005;
				selectedTab.style.setProperty('--loop-tabs-filling', tab.loopFill);
			}, tab.options.autoplayInterval/200);
		}
  };

  function pauseLoopTabAutoplay(tab) { // pause autoplay
    if(tab.loopTabAutoId) {
			clearTimeout(tab.loopTabAutoId);
			tab.loopTabAutoId = false;
			clearInterval(tab.loopFillAutoId);
			tab.loopFillAutoId = false;
			// make sure the filling line is scaled up
			var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass);
			if(selectedTab.length > 0) selectedTab[0].style.setProperty('--loop-tabs-filling', 1);
		}
  };

  function selectNewLoopTab(tab, direction, bool) {
    var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass)[0],
			index = Util.getIndexInArray(tab.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = tab.listItems.length - 1;
		if(index >= tab.listItems.length) index = 0;	
		triggerLoopTab(tab, tab.triggers[index]);
		bool && tab.triggers[index].focus();
  };

  function triggerLoopTab(tab, tabTrigger, event) {
		pauseLoopTabAutoplay(tab);
		event && event.preventDefault();	
		var index = Util.getIndexInArray(tab.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(Util.hasClass(tab.triggers[index], tab.controlActiveClass)) return;
		
		for( var i = 0; i < tab.triggers.length; i++) {
			var bool = (i == index),
				exit = Util.hasClass(tab.triggers[i], tab.controlActiveClass);
			Util.toggleClass(tab.triggers[i], tab.controlActiveClass, bool);
      Util.toggleClass(tab.panels[i], tab.panelShowClass, bool);
			Util.toggleClass(tab.assets[i], tab.assetShowClass, bool);
			Util.toggleClass(tab.assets[i], tab.assetExitClass, exit);
			tab.triggers[i].setAttribute('aria-selected', bool);
			bool ? tab.triggers[i].setAttribute('tabindex', '0') : tab.triggers[i].setAttribute('tabindex', '-1');

			resetVideo(tab, i, bool); // play/pause video if available

			// listen for the end of animation on asset element and remove exit class
			if(exit) {(function(i){
				tab.assets[i].addEventListener('transitionend', function cb(event){
					tab.assets[i].removeEventListener('transitionend', cb);
					Util.removeClass(tab.assets[i], tab.assetExitClass);
				});
			})(i);}
		}
    
    // restart tab autoplay
    initLoopTabAutoplay(tab);
	};

	function resetVideo(tab, i, bool) {
		if(tab.videos[i]) {
			if(bool) {
				tab.videos[i].play();
			} else {
				tab.videos[i].pause();
				tab.videos[i].currentTime = 0;
			} 
		}
	};

  LoopTab.defaults = {
    element : '',
    autoplay : true,
    autoplayInterval: 5000
  };

  //initialize the Tab objects
	var loopTabs = document.getElementsByClassName('js-loop-tabs');
	if( loopTabs.length > 0 ) {
		var reducedMotion = Util.osHasReducedMotion(),
			cssVariableSupport = ('CSS' in window) && Util.cssSupports('color', 'var(--var)');
		for( var i = 0; i < loopTabs.length; i++) {
			(function(i){
        var autoplay = (loopTabs[i].getAttribute('data-autoplay') && loopTabs[i].getAttribute('data-autoplay') == 'off' || reducedMotion) ? false : true,
        autoplayInterval = (loopTabs[i].getAttribute('data-autoplay-interval')) ? loopTabs[i].getAttribute('data-autoplay-interval') : 5000;
        new LoopTab({element: loopTabs[i], autoplay : autoplay, autoplayInterval : autoplayInterval});
      })(i);
		}
	}
}());
// File#: _1_main-header
// Usage: codyhouse.co/license
(function() {
	var mainHeader = document.getElementsByClassName('js-header');
	if( mainHeader.length > 0 ) {
		var trigger = mainHeader[0].getElementsByClassName('js-header__trigger')[0],
			nav = mainHeader[0].getElementsByClassName('js-header__nav')[0];

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		//detect click on nav trigger
		trigger.addEventListener("click", function(event) {
			event.preventDefault();
			toggleNavigation(!Util.hasClass(nav, 'header__nav--is-visible'));
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger)) {
					focusMenu = trigger; // move focus to menu trigger when menu is close
					trigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) trigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function doneResizing() {
			if( !isVisible(trigger) && Util.hasClass(mainHeader[0], 'header--expanded')) toggleNavigation(false); 
		};
	}

	function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};

	function toggleNavigation(bool) { // toggle navigation visibility on small device
		Util.toggleClass(nav, 'header__nav--is-visible', bool);
		Util.toggleClass(mainHeader[0], 'header--expanded', bool);
		trigger.setAttribute('aria-expanded', bool);
		if(bool) { //opening menu -> move focus to first element inside nav
			nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
		} else if(focusMenu) {
			focusMenu.focus();
			focusMenu = false;
		}
	};
}());
// File#: _1_masonry
// Usage: codyhouse.co/license

(function() {
  var Masonry = function(element) {
    this.element = element;
    this.list = this.element.getElementsByClassName('js-masonry__list')[0];
    this.items = this.element.getElementsByClassName('js-masonry__item');
    this.activeColumns = 0;
    this.colStartWidth = 0; // col min-width (defined in CSS using --masonry-col-auto-size variable)
    this.colWidth = 0; // effective column width
    this.colGap = 0;
    // store col heights and items
    this.colHeights = [];
    this.colItems = [];
    // flex full support
    this.flexSupported = checkFlexSupported(this.items[0]);
    getGridLayout(this); // get initial grid params
    setGridLayout(this); // set grid params (width of elements)
    initMasonryLayout(this); // init gallery layout
  };

  function checkFlexSupported(item) {
    var itemStyle = window.getComputedStyle(item);
    return itemStyle.getPropertyValue('flex-basis') != 'auto';
  };

  function getGridLayout(grid) { // this is used to get initial grid details (width/grid gap)
    var itemStyle = window.getComputedStyle(grid.items[0]);
    if( grid.colStartWidth == 0) {
      grid.colStartWidth = parseFloat(itemStyle.getPropertyValue('width'));
    }
    grid.colGap = parseFloat(itemStyle.getPropertyValue('margin-right'));
  };

  function setGridLayout(grid) { // set width of items in the grid
    var containerWidth = parseFloat(window.getComputedStyle(grid.element).getPropertyValue('width'));
    grid.activeColumns = parseInt((containerWidth + grid.colGap)/(grid.colStartWidth+grid.colGap));
    if(grid.activeColumns == 0) grid.activeColumns = 1;
    grid.colWidth = parseFloat((containerWidth - (grid.activeColumns - 1)*grid.colGap)/grid.activeColumns);
    for(var i = 0; i < grid.items.length; i++) {
      grid.items[i].style.width = grid.colWidth+'px'; // reset items width
    }
  };

  function initMasonryLayout(grid) {
    if(grid.flexSupported) {
      checkImgLoaded(grid); // reset layout when images are loaded
    } else {
      Util.addClass(grid.element, 'masonry--loaded'); // make sure the gallery is visible
    }

    grid.element.addEventListener('masonry-resize', function(){ // window has been resized -> reset masonry layout
      getGridLayout(grid);
      setGridLayout(grid);
      if(grid.flexSupported) layItems(grid); 
    });

    grid.element.addEventListener('masonry-reset', function(event){ // reset layout (e.g., new items added to the gallery)
      if(grid.flexSupported) checkImgLoaded(grid); 
    });
  };

  function layItems(grid) {
    Util.addClass(grid.element, 'masonry--loaded'); // make sure the gallery is visible
    grid.colHeights = [];
    grid.colItems = [];

    // grid layout has already been set -> update container height and order of items
    for(var j = 0; j < grid.activeColumns; j++) {
      grid.colHeights.push(0); // reset col heights
      grid.colItems[j] = []; // reset items order
    }
    
    for(var i = 0; i < grid.items.length; i++) {
      var minHeight = Math.min.apply( Math, grid.colHeights ),
        index = grid.colHeights.indexOf(minHeight);
      if(grid.colItems[index]) grid.colItems[index].push(i);
      grid.items[i].style.flexBasis = 0; // reset flex basis before getting height
      var itemHeight = grid.items[i].getBoundingClientRect().height || grid.items[i].offsetHeight || 1;
      grid.colHeights[index] = grid.colHeights[index] + grid.colGap + itemHeight;
    }

    // reset height of container
    var masonryHeight = Math.max.apply( Math, grid.colHeights ) + 5;
    grid.list.style.cssText = 'height: '+ masonryHeight + 'px;';

    // go through elements and set flex order
    var order = 0;
    for(var i = 0; i < grid.colItems.length; i++) {
      for(var j = 0; j < grid.colItems[i].length; j++) {
        grid.items[grid.colItems[i][j]].style.order = order;
        order = order + 1;
      }
      // change flex-basis of last element of each column, so that next element shifts to next col
      var lastItemCol = grid.items[grid.colItems[i][grid.colItems[i].length - 1]];
      lastItemCol.style.flexBasis = masonryHeight - grid.colHeights[i] + lastItemCol.getBoundingClientRect().height - 5 + 'px';
    }

    // emit custom event when grid has been reset
    grid.element.dispatchEvent(new CustomEvent('masonry-laid'));
  };

  function checkImgLoaded(grid) {
    var imgs = grid.list.getElementsByTagName('img');

    function countLoaded() {
      var setTimeoutOn = false;
      for(var i = 0; i < imgs.length; i++) {
        if(!imgs[i].complete) {
          setTimeoutOn = true;
          break;
        } else if (typeof imgs[i].naturalHeight !== "undefined" && imgs[i].naturalHeight == 0) {
          setTimeoutOn = true;
          break;
        }
      }

      if(!setTimeoutOn) {
        layItems(grid);
      } else {
        setTimeout(function(){
          countLoaded();
        }, 100);
      }
    };

    if(imgs.length == 0) {
      layItems(grid); // no need to wait -> no img available
    } else {
      countLoaded();
    }
  };

  //initialize the Masonry objects
  var masonries = document.getElementsByClassName('js-masonry'), 
    flexSupported = Util.cssSupports('flex-basis', 'auto'),
    masonriesArray = [];

  if( masonries.length > 0) {
    for( var i = 0; i < masonries.length; i++) {
      if(!flexSupported) {
        Util.addClass(masonries[i], 'masonry--loaded'); // reveal gallery
      } else {
        (function(i){masonriesArray.push(new Masonry(masonries[i]));})(i); // init Masonry Layout
      }
    }

    if(!flexSupported) return;

    // listen to window resize -> reorganize items in gallery
    var resizingId = false,
      customEvent = new CustomEvent('masonry-resize');
      
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function doneResizing() {
      for( var i = 0; i < masonriesArray.length; i++) {
        (function(i){masonriesArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
  };
}());
// File#: _1_menu
// Usage: codyhouse.co/license
(function() {
	var Menu = function(element) {
		this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.menuItems = this.element.getElementsByClassName('js-menu__content');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
		this.menuIsOpen = false;
		this.initMenu();
		this.initMenuEvents();
	};	

	Menu.prototype.initMenu = function() {
		// init aria-labels
		for(var i = 0; i < this.trigger.length; i++) {
			Util.setAttributes(this.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
		// init tabindex
		for(var i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].setAttribute('tabindex', '0');
		}
	};

	Menu.prototype.initMenuEvents = function() {
		var self = this;
		for(var i = 0; i < this.trigger.length; i++) {(function(i){
			self.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the menu had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(self.element, 'menu--is-visible') && self.selectedTrigger !=  self.trigger[i]) {
					self.toggleMenu(false, false); // close menu
				}
				// toggle menu
				self.selectedTrigger = self.trigger[i];
				self.toggleMenu(!Util.hasClass(self.element, 'menu--is-visible'), true);
			});
		})(i);}
		
		// keyboard events
		this.element.addEventListener('keydown', function(event) {
			// use up/down arrow to navigate list of menu items
			if( !Util.hasClass(event.target, 'js-menu__content') ) return;
			if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
				self.navigateItems(event, 'next');
			} else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
				self.navigateItems(event, 'prev');
			}
		});
	};

	Menu.prototype.toggleMenu = function(bool, moveFocus) {
		var self = this;
		// toggle menu visibility
		Util.toggleClass(this.element, 'menu--is-visible', bool);
		this.menuIsOpen = bool;
		if(bool) {
			this.selectedTrigger.setAttribute('aria-expanded', 'true');
			Util.moveFocus(this.menuItems[0]);
			this.element.addEventListener("transitionend", function(event) {Util.moveFocus(self.menuItems[0]);}, {once: true});
			// position the menu element
			this.positionMenu();
			// add class to menu trigger
			Util.addClass(this.selectedTrigger, 'menu-control--active');
		} else if(this.selectedTrigger) {
			this.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(this.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(this.selectedTrigger, 'menu-control--active');
			this.selectedTrigger = false;
		}
	};

	Menu.prototype.positionMenu = function(event, direction) {
		var selectedTriggerPosition = this.selectedTrigger.getBoundingClientRect(),
			menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			// menuOnTop = window.innerHeight < selectedTriggerPosition.bottom + this.element.offsetHeight;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + this.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + this.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - this.element.offsetWidth)/2)+'px;';
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - 20 : window.innerHeight - selectedTriggerPosition.bottom - 20;
		this.element.setAttribute('style', horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};

	Menu.prototype.navigateItems = function(event, direction) {
		event.preventDefault();
		var index = Util.getIndexInArray(this.menuItems, event.target),
			nextIndex = direction == 'next' ? index + 1 : index - 1;
		if(nextIndex < 0) nextIndex = this.menuItems.length - 1;
		if(nextIndex > this.menuItems.length - 1) nextIndex = 0;
		Util.moveFocus(this.menuItems[nextIndex]);
	};

	Menu.prototype.checkMenuFocus = function() {
		var menuParent = document.activeElement.closest('.js-menu');
		if (!menuParent || !this.element.contains(menuParent)) this.toggleMenu(false, false);
	};

	Menu.prototype.checkMenuClick = function(target) {
		if( !this.element.contains(target) && !target.closest('[aria-controls="'+this.elementId+'"]')) this.toggleMenu(false);
	};

	window.Menu = Menu;

	//initialize the Menu objects
	var menus = document.getElementsByClassName('js-menu');
	if( menus.length > 0 ) {
		var menusArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < menus.length; i++) {
			(function(i){
				menusArray.push(new Menu(menus[i]));
				var scrollableElement = menus[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) {
				//close menu if focus is outside menu element
				menusArray.forEach(function(element){
					element.checkMenuFocus();
				});
			} else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
				// close menu on 'Esc'
				menusArray.forEach(function(element){
					element.toggleMenu(false, false);
				});
			} 
		});
		// close menu when clicking outside it
		window.addEventListener('click', function(event){
			menusArray.forEach(function(element){
				element.checkMenuClick(event.target);
			});
		});
		// on resize -> close all menu elements
		window.addEventListener('resize', function(event){
			menusArray.forEach(function(element){
				element.toggleMenu(false, false);
			});
		});
		// on scroll -> close all menu elements
		window.addEventListener('scroll', function(event){
			menusArray.forEach(function(element){
				if(element.menuIsOpen) element.toggleMenu(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					menusArray.forEach(function(element){
						if(element.menuIsOpen) element.toggleMenu(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
	var Modal = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null; // focus will be moved to this element when modal is open
		this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
		this.selectedTrigger = null;
		this.preventScrollEl = this.getPreventScrollEl();
		this.showClass = "modal--is-visible";
		this.initModal();
	};

	Modal.prototype.getPreventScrollEl = function() {
		var scrollEl = false;
		var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

	Modal.prototype.initModal = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(self.element, self.showClass)) {
						self.closeModal();
						return;
					}
					self.selectedTrigger = event.target;
					self.showModal();
					self.initModalEvents();
				});
			}
		}

		// listen to the openModal event -> open modal without a trigger button
		this.element.addEventListener('openModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.showModal();
			self.initModalEvents();
		});

		// listen to the closeModal event -> close modal without a trigger button
		this.element.addEventListener('closeModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.closeModal();
		});

		// if modal is open by default -> initialise modal events
		if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
	};

	Modal.prototype.showModal = function() {
		var self = this;
		Util.addClass(this.element, this.showClass);
		this.getFocusableElements();
		if(this.moveFocusEl) {
			this.moveFocusEl.focus();
			// wait for the end of transitions before moving focus
			this.element.addEventListener("transitionend", function cb(event) {
				self.moveFocusEl.focus();
				self.element.removeEventListener("transitionend", cb);
			});
		}
		this.emitModalEvents('modalIsOpen');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
	};

	Modal.prototype.closeModal = function() {
		if(!Util.hasClass(this.element, this.showClass)) return;
		console.log('close')
		Util.removeClass(this.element, this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelModalEvents();
		this.emitModalEvents('modalIsClose');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
	};

	Modal.prototype.initModalEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Modal.prototype.cancelModalEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Modal.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Modal.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside modal
			this.trapFocus(event);
		} else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
			event.preventDefault();
			this.closeModal(); // close modal when pressing Enter on close button
		}	
	};

	Modal.prototype.initClick = function(event) {
		//close modal when clicking on close button or modal bg layer 
		if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
		event.preventDefault();
		this.closeModal();
	};

	Modal.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of modal
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of modal
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Modal.prototype.getFocusableElements = function() {
		//get all focusable elements inside the modal
		var allFocusable = this.element.querySelectorAll(focusableElString);
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
		this.getFirstFocusable();
	};

	Modal.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the modal
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				this.firstFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				this.lastFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getFirstFocusable = function() {
		if(!this.modalFocus || !Element.prototype.matches) {
			this.moveFocusEl = this.firstFocusable;
			return;
		}
		var containerIsFocusable = this.modalFocus.matches(focusableElString);
		if(containerIsFocusable) {
			this.moveFocusEl = this.modalFocus;
		} else {
			this.moveFocusEl = false;
			var elements = this.modalFocus.querySelectorAll(focusableElString);
			for(var i = 0; i < elements.length; i++) {
				if( isVisible(elements[i]) ) {
					this.moveFocusEl = elements[i];
					break;
				}
			}
			if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
		}
	};

	Modal.prototype.emitModalEvents = function(eventName) {
		var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
		this.element.dispatchEvent(event);
	};

	function isVisible(element) {
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

	window.Modal = Modal;

	//initialize the Modal objects
	var modals = document.getElementsByClassName('js-modal');
	// generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( modals.length > 0 ) {
		var modalArrays = [];
		for( var i = 0; i < modals.length; i++) {
			(function(i){modalArrays.push(new Modal(modals[i]));})(i);
		}

		window.addEventListener('keydown', function(event){ //close modal window on esc
			if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
				for( var i = 0; i < modalArrays.length; i++) {
					(function(i){modalArrays[i].closeModal();})(i);
				};
			}
		});
	}
}());
// File#: _1_newsletter-input
// Usage: codyhouse.co/license
(function() {
  var NewsInput = function(opts) {
    this.options = Util.extend(NewsInput.defaults, opts);
    this.element = this.options.element;
    this.input = this.element.getElementsByClassName('js-news-form__input');
    this.button = this.element.getElementsByClassName('js-news-form__btn');
    this.submitting = false;
    initNewsInput(this);
  };

  function initNewsInput(element) {
    if(element.input.length < 1 || element.input.button < 1) return;
    // check email value
    element.input[0].addEventListener('input', function(event){
      // hide success/error messages
      Util.removeClass(element.element, 'news-form--success news-form--error');
      // enable/disable form
      checkEmailFormat(element);
    });

    // animate newsletter when submitting form 
    element.element.addEventListener('submit', function(event){
      event.preventDefault();
      if(element.submitting) return;
      element.submitting = true;
      element.response = false;
      
      // start button animation
      Util.addClass(element.element, 'news-form--loading news-form--circle-loop');
      // at the end of each animation cicle, restart animation if there was no response from the submit function yet
      element.element.addEventListener('animationend', function cb(event){
        if(element.response) { // complete button animation
          element.element.removeEventListener('animationend', cb);
          showResponseMessage(element, element.response);
        } else { // keep loading animation going
          Util.removeClass(element.element, 'news-form--circle-loop');
          element.element.offsetWidth;
          Util.addClass(element.element, 'news-form--circle-loop');
        }
      });
      
      // custom submit function
      element.options.submit(element.input[0].value, function(response){
        element.response = response;
        element.submitting = false;
        if(!animationSupported) showResponseMessage(element, response);
      });
    });
  };

  function showResponseMessage(element, response) {
    Util.removeClass(element.element, 'news-form--loading news-form--circle-loop');
    (response == 'success')
      ? Util.addClass(element.element, 'news-form--success')
      : Util.addClass(element.element, 'news-form--error');
  };

  function checkEmailFormat(element) {
    var email = element.input[0].value;
    var atPosition = email.indexOf("@"),
      dotPosition = email.lastIndexOf("."); 
    var enableForm = (atPosition >= 1 && dotPosition >= atPosition + 2 && dotPosition < email.length - 1);
    if(enableForm) {
      Util.addClass(element.element, 'news-form--enabled');
      element.button[0].removeAttribute('disabled');
    } else {
      Util.removeClass(element.element, 'news-form--enabled');
      element.button[0].setAttribute('disabled', true);
    }
  };

  window.NewsInput = NewsInput;

  NewsInput.defaults = {
    element : '',
    submit: false, // function used to return results
  };

  var animationSupported = Util.cssSupports('animation', 'name');
}());
// File#: _1_notice
// Usage: codyhouse.co/license
(function() {
  function initNoticeEvents(notice) {
    notice.addEventListener('click', function(event){
      if(event.target.closest('.js-notice__hide-control')) {
        event.preventDefault();
        Util.addClass(notice, 'notice--hide');
      }
    });
  };
  
  var noticeElements = document.getElementsByClassName('js-notice');
  if(noticeElements.length > 0) {
    for(var i=0; i < noticeElements.length; i++) {(function(i){
      initNoticeEvents(noticeElements[i]);
    })(i);}
  }
}());
// File#: _1_number-input
// Usage: codyhouse.co/license
(function() {
	var InputNumber = function(element) {
		this.element = element;
		this.input = this.element.getElementsByClassName('js-number-input__value')[0];
		this.min = parseFloat(this.input.getAttribute('min'));
		this.max = parseFloat(this.input.getAttribute('max'));
		this.step = parseFloat(this.input.getAttribute('step'));
		if(isNaN(this.step)) this.step = 1;
		this.precision = getStepPrecision(this.step);
		initInputNumberEvents(this);
	};

	function initInputNumberEvents(input) {
		// listen to the click event on the custom increment buttons
		input.element.addEventListener('click', function(event){ 
			var increment = event.target.closest('.js-number-input__btn');
			if(increment) {
				event.preventDefault();
				updateInputNumber(input, increment);
			}
		});

		// when input changes, make sure the new value is acceptable
		input.input.addEventListener('focusout', function(event){
			var value = parseFloat(input.input.value);
			if( value < input.min ) value = input.min;
			if( value > input.max ) value = input.max;
			// check value is multiple of step
			value = checkIsMultipleStep(input, value);
			if( value != parseFloat(input.input.value)) input.input.value = value;

		});
	};

	function getStepPrecision(step) {
		// if step is a floating number, return its precision
		return (step.toString().length - Math.floor(step).toString().length - 1);
	};

	function updateInputNumber(input, btn) {
		var value = ( Util.hasClass(btn, 'number-input__btn--plus') ) ? parseFloat(input.input.value) + input.step : parseFloat(input.input.value) - input.step;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		if( value < input.min ) value = input.min;
		if( value > input.max ) value = input.max;
		input.input.value = value;
		input.input.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
	};

	function checkIsMultipleStep(input, value) {
		// check if the number inserted is a multiple of the step value
		var remain = (value*10*input.precision)%(input.step*10*input.precision);
		if( remain != 0) value = value - remain;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		return value;
	};

	//initialize the InputNumber objects
	var inputNumbers = document.getElementsByClassName('js-number-input');
	if( inputNumbers.length > 0 ) {
		for( var i = 0; i < inputNumbers.length; i++) {
			(function(i){new InputNumber(inputNumbers[i]);})(i);
		}
	}
}());
// File#: _1_off-canvas-content
// Usage: codyhouse.co/license
(function() {
	var OffCanvas = function(element) {
		this.element = element;
		this.wrapper = document.getElementsByClassName('js-off-canvas')[0];
		this.main = document.getElementsByClassName('off-canvas__main')[0];
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.closeBtn = this.element.getElementsByClassName('js-off-canvas__close-btn');
		this.selectedTrigger = false;
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.animating = false;
		initOffCanvas(this);
	};	

	function initOffCanvas(panel) {
		panel.element.setAttribute('aria-hidden', 'true');
		for(var i = 0 ; i < panel.triggers.length; i++) { // listen to the click on off-canvas content triggers
			panel.triggers[i].addEventListener('click', function(event){
				panel.selectedTrigger = event.currentTarget;
				event.preventDefault();
				togglePanel(panel);
			});
		}

		// listen to the triggerOpenPanel event -> open panel without a trigger button
		panel.element.addEventListener('triggerOpenPanel', function(event){
			if(event.detail) panel.selectedTrigger = event.detail;
			openPanel(panel);
		});
		// listen to the triggerClosePanel event -> open panel without a trigger button
		panel.element.addEventListener('triggerClosePanel', function(event){
			closePanel(panel);
		});
	};

	function togglePanel(panel) {
		var status = (panel.element.getAttribute('aria-hidden') == 'true') ? 'close' : 'open';
		if(status == 'close') openPanel(panel);
		else closePanel(panel);
	};

	function openPanel(panel) {
		if(panel.animating) return; // already animating
		emitPanelEvents(panel, 'openPanel', '');
		panel.animating = true;
		panel.element.setAttribute('aria-hidden', 'false');
		Util.addClass(panel.wrapper, 'off-canvas--visible');
		getFocusableElements(panel);
		var transitionEl = panel.element;
		if(panel.closeBtn.length > 0 && !Util.hasClass(panel.closeBtn[0], 'js-off-canvas__a11y-close-btn')) transitionEl = 	panel.closeBtn[0];
		transitionEl.addEventListener('transitionend', function cb(){
			// wait for the end of transition to move focus and update the animating property
			panel.animating = false;
			Util.moveFocus(panel.element);
			transitionEl.removeEventListener('transitionend', cb);
		});
		if(!transitionSupported) panel.animating = false;
		initPanelEvents(panel);
	};

	function closePanel(panel, bool) {
		if(panel.animating) return;
		panel.animating = true;
		panel.element.setAttribute('aria-hidden', 'true');
		Util.removeClass(panel.wrapper, 'off-canvas--visible');
		panel.main.addEventListener('transitionend', function cb(){
			panel.animating = false;
			if(panel.selectedTrigger) panel.selectedTrigger.focus();
			setTimeout(function(){panel.selectedTrigger = false;}, 10);
			panel.main.removeEventListener('transitionend', cb);
		});
		if(!transitionSupported) panel.animating = false;
		cancelPanelEvents(panel);
		emitPanelEvents(panel, 'closePanel', bool);
	};

	function initPanelEvents(panel) { //add event listeners
		panel.element.addEventListener('keydown', handleEvent.bind(panel));
		panel.element.addEventListener('click', handleEvent.bind(panel));
	};

	function cancelPanelEvents(panel) { //remove event listeners
		panel.element.removeEventListener('keydown', handleEvent.bind(panel));
		panel.element.removeEventListener('click', handleEvent.bind(panel));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'keydown':
				initKeyDown(this, event);
				break;
			case 'click':
				initClick(this, event);
				break;
		}
	};

	function initClick(panel, event) { // close panel when clicking on close button
		if( !event.target.closest('.js-off-canvas__close-btn')) return;
		event.preventDefault();
		closePanel(panel, 'close-btn');
	};

	function initKeyDown(panel, event) {
		if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
			//close off-canvas panel on esc
			closePanel(panel, 'key');
		} else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside panel
			trapFocus(panel, event);
		}
	};

	function trapFocus(panel, event) {
		if( panel.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of panel
			event.preventDefault();
			panel.lastFocusable.focus();
		}
		if( panel.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of panel
			event.preventDefault();
			panel.firstFocusable.focus();
		}
	};

	function getFocusableElements(panel) { //get all focusable elements inside the off-canvas content
		var allFocusable = panel.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(panel, allFocusable);
		getLastVisible(panel, allFocusable);
	};

	function getFirstVisible(panel, elements) { //get first visible focusable element inside the off-canvas content
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				panel.firstFocusable = elements[i];
				return true;
			}
		}
	};

	function getLastVisible(panel, elements) { //get last visible focusable element inside the off-canvas content
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				panel.lastFocusable = elements[i];
				return true;
			}
		}
	};

	function emitPanelEvents(panel, eventName, target) { // emit custom event
		var event = new CustomEvent(eventName, {detail: target});
		panel.element.dispatchEvent(event);
	};

	//initialize the OffCanvas objects
	var offCanvas = document.getElementsByClassName('js-off-canvas__panel'),
		transitionSupported = Util.cssSupports('transition');
	if( offCanvas.length > 0 ) {
		for( var i = 0; i < offCanvas.length; i++) {
			(function(i){new OffCanvas(offCanvas[i]);})(i);
		}
	}
}());
// File#: _1_overscroll-section
// Usage: codyhouse.co/license
(function() {
  var OverscrollSection = function(element) {
    this.element = element;
    this.stickyContent = this.element.getElementsByClassName('js-overscroll-section__sticky-content');
    this.scrollContent = this.element.getElementsByClassName('js-overscroll-section__scroll-content');
    this.scrollingFn = false;
    this.scrolling = false;
    this.resetOpacity = false;
    this.disabledClass = 'overscroll-section--disabled';
    initOverscrollSection(this);
  };

  function initOverscrollSection(element) {
    // set position of sticky element
    setTop(element);
    // create a new node - to be inserted before the scroll element
    createPrevElement(element);
    // on resize -> reset element top position
    element.element.addEventListener('update-overscroll-section', function(){
      setTop(element);
      setPrevElementTop(element);
    });
    // set initial opacity value
    animateOverscrollSection.bind(element)(); 
    // change opacity of layer
    var observer = new IntersectionObserver(overscrollSectionCallback.bind(element));
    observer.observe(element.prevElement);
  };

  function createPrevElement(element) {
    if(element.scrollContent.length == 0) return;
    var newElement = document.createElement("div"); 
    newElement.setAttribute('aria-hidden', 'true');
    element.element.insertBefore(newElement, element.scrollContent[0]);
    element.prevElement =  element.scrollContent[0].previousElementSibling;
    element.prevElement.style.opacity = '0';
    setPrevElementTop(element);
  };

  function setPrevElementTop(element) {
    element.prevElementTop = element.prevElement.getBoundingClientRect().top + window.scrollY;
  };

  function overscrollSectionCallback(entries) {
    if(entries[0].isIntersecting) {
      if(this.scrollingFn) return; // listener for scroll event already added
      overscrollSectionInitEvent(this);
    } else {
      if(!this.scrollingFn) return; // listener for scroll event already removed
      window.removeEventListener('scroll', this.scrollingFn);
      updateOpacityValue(this, 0);
      this.scrollingFn = false;
    }
  };

  function overscrollSectionInitEvent(element) {
    element.scrollingFn = overscrollSectionScrolling.bind(element);
    window.addEventListener('scroll', element.scrollingFn);
  };

  function overscrollSectionScrolling() {
    if(this.scrolling) return;
    this.scrolling = true;
    window.requestAnimationFrame(animateOverscrollSection.bind(this));
  };

  function animateOverscrollSection() {
    if(this.stickyContent.length == 0) return;
    setPrevElementTop(this);
    if( parseInt(this.stickyContent[0].style.top) != window.innerHeight - this.stickyContent[0].offsetHeight) {
      setTop(this);
    }
    if(this.prevElementTop - window.scrollY < window.innerHeight*2/3) {
      var opacity = Math.easeOutQuart(window.innerHeight*2/3 + window.scrollY - this.prevElementTop, 0, 1, window.innerHeight*2/3);
      if(opacity > 0 ) {
        this.resetOpacity = false;
        updateOpacityValue(this, opacity);
      } else if(!this.resetOpacity) {
        this.resetOpacity = true;
        updateOpacityValue(this, 0);
      } 
    } else {
      updateOpacityValue(this, 0);
    }
    this.scrolling = false;
  };

  function updateOpacityValue(element, value) {
    element.element.style.setProperty('--overscroll-section-opacity', value);
  };

  function setTop(element) {
    if(element.stickyContent.length == 0) return;
    var translateValue = window.innerHeight - element.stickyContent[0].offsetHeight;
    element.stickyContent[0].style.top = translateValue+'px';
    // check if effect should be disabled
    Util.toggleClass(element.element, element.disabledClass, translateValue > 2);
  };

  //initialize the OverscrollSection objects
  var overscrollSections = document.getElementsByClassName('js-overscroll-section');
  var stickySupported = Util.cssSupports('position', 'sticky') || Util.cssSupports('position', '-webkit-sticky'),
    intObservSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
	if( overscrollSections.length > 0 && stickySupported && !reducedMotion && intObservSupported) {
    var overscrollSectionsArray = [];
		for( var i = 0; i < overscrollSections.length; i++) {
      (function(i){overscrollSectionsArray.push(new OverscrollSection(overscrollSections[i]));})(i);
    }
    
    var resizingId = false,
      customEvent = new CustomEvent('update-overscroll-section');

    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 100);
    });

    // wait for font to be loaded
    document.fonts.onloadingdone = function (fontFaceSetEvent) {
      doneResizing();
    };

    function doneResizing() {
      for( var i = 0; i < overscrollSectionsArray.length; i++) {
        (function(i){overscrollSectionsArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
	}
}());
// File#: _1_page-transition
// Usage: codyhouse.co/license
(function() {
  var PageTransition = function(opts) {
    if(!('CSS' in window) || !CSS.supports('color', 'var(--color)')) return;
    this.element = document.getElementsByClassName('js-page-trans')[0];
    this.options = Util.extend(PageTransition.defaults , opts);
    this.cachedPages = [];
    this.anchors = false;
    this.clickFunctions = [];
    this.animating = false;
    this.newContent = false;
    this.containerClass = 'js-page-trans__content';
    this.containers = [];
    initSrRegion(this);
    pageTrInit(this);
    initBrowserHistory(this);
  };

  function initSrRegion(element) {
    var liveRegion = document.createElement('p');
    Util.setAttributes(liveRegion, {'class': 'sr-only', 'role': 'alert', 'aria-live': 'polite', 'id': 'page-trans-sr-live'});
    element.element.appendChild(liveRegion);
    element.srLive = document.getElementById('page-trans-sr-live');
  };

  function pageTrInit(element) { // bind click events
    element.anchors = document.getElementsByClassName('js-page-trans-link');
    for(var i = 0; i < element.anchors.length; i++) {
      (function(i){
        element.clickFunctions[i] = function(event) {
          event.preventDefault();
          element.updateBrowserHistory = true;
          bindClick(element, element.anchors[i].getAttribute('href'));
        };

        element.anchors[i].addEventListener('click', element.clickFunctions[i]);
      })(i);
    }
  };

  function bindClick(element, link) {
    if(element.animating) return;
    element.animating = true;
    element.link = link; 
    // most of those links will be removed from the page
    unbindClickEvents(element);
    loadPageContent(element); 
    // code that should run before the leaving animation
    if(element.options.beforeLeave) element.options.beforeLeave(element.link);
    // announce to SR new content is being loaded
    element.srLive.textContent = element.options.srLoadingMessage;
    // leaving animation
    if(!element.options.leaveAnimation) return;
    element.containers.push(element.element.getElementsByClassName(element.containerClass)[0]);
    element.options.leaveAnimation(element.containers[0], element.link, function(){
      leavingAnimationComplete(element, true);
    });
  };

  function unbindClickEvents(element) {
    for(var i = 0; i < element.anchors.length; i++) {
      element.anchors[i].removeEventListener('click', element.clickFunctions[i]);
    }
  };

  function loadPageContent(element) {
    element.newContent = false;
    var pageCache = getCachedPage(element);
    if(pageCache) {
      element.newContent = pageCache;
    } else {
      if(element.options.loadFunction) { // use a custom function to load your data
        element.options.loadFunction(element.link, function(data){
          element.newContent = data;
          element.cachedPages.push({link: element.link, content: element.newContent});
        });
      } else {
        // load page content
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            element.newContent = getContainerHTML(element, xmlHttp.responseText);
            element.cachedPages.push({link: element.link, content: element.newContent});
          }
        };
        xmlHttp.open('GET', element.link);
        xmlHttp.send();
      }
    }
  };

  function leavingAnimationComplete(element, triggerProgress) {
    if(element.newContent) {
      // new content has already been created
      triggerEnteringProcess(element);
    } else {
      // new content is not available yet
      if(triggerProgress && element.options.progressAnimation) element.options.progressAnimation(element.link);
      setTimeout(function(){
        leavingAnimationComplete(element, false);
      }, 200);
    }
  };

  function getCachedPage(element) {
    var cachedContent = false;
    for(var i = 0; i < element.cachedPages.length; i++) {
      if(element.cachedPages[i].link == element.link) {
        cachedContent = element.cachedPages[i].content;
        break;
      }
    }
    return cachedContent;
  };

  function getContainerHTML(element, content) {
    var template = document.createElement('div');
    template.innerHTML = content;
    return template.getElementsByClassName(element.containerClass)[0].outerHTML;
  };

  function triggerEnteringProcess(element) {
    if(element.updateBrowserHistory) updateBrowserHistory(element);
    // inject new content
    element.containers[0].insertAdjacentHTML('afterend', element.newContent);
    element.containers = element.element.getElementsByClassName(element.containerClass);
    if(element.options.beforeEnter) element.options.beforeEnter(element.containers[0], element.containers[1], element.link);
    if(!element.options.enterAnimation) return; // entering animation
    element.options.enterAnimation(element.containers[0], element.containers[1], element.link, function(){
      // move focus to new cntent
      Util.moveFocus(element.containers[1]);
      // new content
      var newContent = element.containers[1];
      // remove old content
      element.containers[0].remove();
      if(element.options.afterEnter) element.options.afterEnter(newContent, element.link);
      pageTrInit(element); // bind click event to new anchor elements
      resetPageTransition(element);
      // announce to SR new content is available
      element.srLive.textContent = element.options.srLoadedMessage;
    });
  };

  function resetPageTransition(element) {
    // remove old content
    element.newContent = false;
    element.animating = false;
    element.containers = [];
    element.link = false;
  };

  function updateBrowserHistory(element) {
    if(window.history.state && window.history.state == element.link) return;
    window.history.pushState({path: element.link},'',element.link);
  };

  function initBrowserHistory(element) {
    setTimeout(function() {
      // on load -> replace window history with page url
      window.history.replaceState({path: document.location.href},'',document.location.href);
      window.addEventListener('popstate', function(event) {
        element.updateBrowserHistory = false;
        if(event.state && event.state.path) {
          bindClick(element, event.state.path);
        }
      });
    }, 10);
  };

  PageTransition.defaults = {
    beforeLeave: false, // run before the leaving animation is triggered
    leaveAnimation: false,
    progressAnimation: false,
    beforeEnter: false, // run before enterAnimation (after new content has been added to the page)
    enterAnimation: false,
    afterEnter: false,
    loadFunction: false,
    srLoadingMessage: 'New content is being loaded',
    srLoadedMessage: 'New content has been loaded' 
  };

  window.PageTransition = PageTransition;
}());
// File#: _1_parallax-image
// Usage: codyhouse.co/license
(function() {
  var ParallaxImg = function(element, rotationLevel) {
    this.element = element;
    this.figure = this.element.getElementsByClassName('js-parallax-img__assets')[0];
    this.imgs = this.element.getElementsByTagName('img');
    this.maxRotation = rotationLevel || 2; // rotate level
    if(this.maxRotation > 5) this.maxRotation = 5;
    this.scale = 1;
    this.animating = false;
    initParallax(this);
    initParallaxEvents(this);
  };

  function initParallax(element) {
    element.count = 0;
    window.requestAnimationFrame(checkImageLoaded.bind(element));
    for(var i = 0; i < element.imgs.length; i++) {(function(i){
      var loaded = false;
      element.imgs[i].addEventListener('load', function(){
        if(loaded) return;
        element.count = element.count + 1;
      });
      if(element.imgs[i].complete && !loaded) {
        loaded = true;
        element.count = element.count + 1;
      }
    })(i);}
  };

  function checkImageLoaded() {
    if(this.count >= this.imgs.length) {
      initScale(this);
      if(this.loaded) {
        window.cancelAnimationFrame(this.loaded);
        this.loaded = false;
      }
    } else {
      this.loaded = window.requestAnimationFrame(checkImageLoaded.bind(this));
    }
  };

  function initScale(element) {
    var maxImgResize = getMaxScale(element);
    element.scale = maxImgResize/(Math.sin(Math.PI / 2 - element.maxRotation*Math.PI/180));
    element.figure.style.transform = 'scale('+element.scale+')';  
    Util.addClass(element.element, 'parallax-img--loaded');  
  };

  function getMaxScale(element) {
    var minWidth = 0;
    var maxWidth = 0;
    for(var i = 0; i < element.imgs.length; i++) {
      var width = element.imgs[i].getBoundingClientRect().width;
      if(width < minWidth || i == 0 ) minWidth = width;
      if(width > maxWidth || i == 0 ) maxWidth = width;
    }
    var scale = Math.ceil(10*maxWidth/minWidth)/10;
    if(scale < 1.1) scale = 1.1;
    return scale;
  }

  function initParallaxEvents(element) {
    element.element.addEventListener('mousemove', function(event){
      if(element.animating) return;
      element.animating = true;
      window.requestAnimationFrame(moveImage.bind(element, event));
    });
  };

  function moveImage(event, timestamp) {
    var wrapperPosition = this.element.getBoundingClientRect();
    var rotateY = 2*(this.maxRotation/wrapperPosition.width)*(wrapperPosition.left - event.clientX + wrapperPosition.width/2);
    var rotateX = 2*(this.maxRotation/wrapperPosition.height)*(event.clientY - wrapperPosition.top - wrapperPosition.height/2);

    if(rotateY > this.maxRotation) rotateY = this.maxRotation;
		if(rotateY < -1*this.maxRotation) rotateY = -this.maxRotation;
		if(rotateX > this.maxRotation) rotateX = this.maxRotation;
    if(rotateX < -1*this.maxRotation) rotateX = -this.maxRotation;
    this.figure.style.transform = 'scale('+this.scale+') rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)';
    this.animating = false;
  };

  window.ParallaxImg = ParallaxImg;

  //initialize the ParallaxImg objects
	var parallaxImgs = document.getElementsByClassName('js-parallax-img');
	if( parallaxImgs.length > 0 && Util.cssSupports('transform', 'translateZ(0px)')) {
		for( var i = 0; i < parallaxImgs.length; i++) {
			(function(i){
        var rotationLevel = parallaxImgs[i].getAttribute('data-perspective');
        new ParallaxImg(parallaxImgs[i], rotationLevel);
      })(i);
		}
	};
}());
// File#: _1_popover
// Usage: codyhouse.co/license
(function() {
  var Popover = function(element) {
    this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false;
    // focusable elements
    this.firstFocusable = false;
		this.lastFocusable = false;
		// position target - position tooltip relative to a specified element
		this.positionTarget = getPositionTarget(this);
		// gap between element and viewport - if there's max-height 
		this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
		initPopover(this);
		initPopoverEvents(this);
  };

  // public methods
  Popover.prototype.togglePopover = function(bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function(target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function() {
    checkPopoverFocus(this);
  };

	// private methods
	function getPositionTarget(popover) {
		// position tooltip relative to a specified element - if provided
		var positionTargetSelector = popover.element.getAttribute('data-position-target');
		if(!positionTargetSelector) return false;
		var positionTarget = document.querySelector(positionTargetSelector);
		return positionTarget;
	};

  function initPopover(popover) {
		// init aria-labels
		for(var i = 0; i < popover.trigger.length; i++) {
			Util.setAttributes(popover.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
  };
  
  function initPopoverEvents(popover) {
		for(var i = 0; i < popover.trigger.length; i++) {(function(i){
			popover.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger !=  popover.trigger[i]) {
					togglePopover(popover, false, false); // close menu
				}
				// toggle popover
				popover.selectedTrigger = popover.trigger[i];
				togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
			});
    })(i);}
    
    // trap focus
    popover.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    });
  };
  
  function togglePopover(popover, bool, moveFocus) {
		// toggle popover visibility
		Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
		popover.popoverIsOpen = bool;
		if(bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover);
      // move focus
      focusPopover(popover);
			popover.element.addEventListener("transitionend", function(event) {focusPopover(popover);}, {once: true});
			// position the popover element
			positionPopover(popover);
			// add class to popover trigger
			Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
		} else if(popover.selectedTrigger) {
			popover.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(popover.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
			popover.selectedTrigger = false;
		}
	};
	
	function focusPopover(popover) {
		if(popover.firstFocusable) {
			popover.firstFocusable.focus();
		} else {
			Util.moveFocus(popover.element);
		}
	};

  function positionPopover(popover) {
		// reset popover position
		resetPopoverStyle(popover);
		var selectedTriggerPosition = (popover.positionTarget) ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
		
		var menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + popover.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - popover.element.offsetWidth)/2)+'px;';
		// check if popover needs a max-height (user will scroll inside the popover)
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;

		var initialStyle = popover.element.getAttribute('style');
		if(!initialStyle) initialStyle = '';
		popover.element.setAttribute('style', initialStyle + horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};
	
	function resetPopoverStyle(popover) {
		// remove popover inline style before appling new style
		popover.element.style.maxHeight = '';
		popover.element.style.top = '';
		popover.element.style.bottom = '';
		popover.element.style.left = '';
		popover.element.style.right = '';
	};

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if(!popover.popoverIsOpen) return;
    if(!popover.element.contains(target) && !target.closest('[aria-controls="'+popover.elementId+'"]')) togglePopover(popover, false);
  };

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if(!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  };
  
  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
		var allFocusable = popover.element.querySelectorAll(focusableElString);
		getFirstVisible(popover, allFocusable);
		getLastVisible(popover, allFocusable);
  };

  function getFirstVisible(popover, elements) {
		//get first visible focusable element inside the popover
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				popover.firstFocusable = elements[i];
				break;
			}
		}
	};

  function getLastVisible(popover, elements) {
		//get last visible focusable element inside the popover
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				popover.lastFocusable = elements[i];
				break;
			}
		}
  };

  function trapFocus(popover, event) {
    if( popover.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of popover
			event.preventDefault();
			popover.lastFocusable.focus();
		}
		if( popover.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of popover
			event.preventDefault();
			popover.firstFocusable.focus();
		}
  };
  
  function isVisible(element) {
		// check if element is visible
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

  window.Popover = Popover;

  //initialize the Popover objects
  var popovers = document.getElementsByClassName('js-popover');
  // generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	
	if( popovers.length > 0 ) {
		var popoversArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < popovers.length; i++) {
			(function(i){
				popoversArray.push(new Popover(popovers[i]));
				var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close popover on 'Esc'
				popoversArray.forEach(function(element){
					element.checkPopoverFocus();
				});
			} 
		});
		// close popover when clicking outside it
		window.addEventListener('click', function(event){
			popoversArray.forEach(function(element){
				element.checkPopoverClick(event.target);
			});
		});
		// on resize -> close all popover elements
		window.addEventListener('resize', function(event){
			popoversArray.forEach(function(element){
				element.togglePopover(false, false);
			});
		});
		// on scroll -> close all popover elements
		window.addEventListener('scroll', function(event){
			popoversArray.forEach(function(element){
				if(element.popoverIsOpen) element.togglePopover(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					popoversArray.forEach(function(element){
						if(element.popoverIsOpen) element.togglePopover(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_pre-header
// Usage: codyhouse.co/license
(function() {
	var preHeader = document.getElementsByClassName('js-pre-header');
	if(preHeader.length > 0) {
		for(var i = 0; i < preHeader.length; i++) {
			(function(i){ addPreHeaderEvent(preHeader[i]);})(i);
		}

		function addPreHeaderEvent(element) {
			var close = element.getElementsByClassName('js-pre-header__close-btn')[0];
			if(close) {
				close.addEventListener('click', function(event) {
					event.preventDefault();
					Util.addClass(element, 'pre-header--is-hidden');
				});
			}
		}
	}
}());
// File#: _1_product-tour
// Usage: codyhouse.co/license
(function() {
  var PTour = function(element, bool) {
    this.element = element;
    this.pin = this.element.getElementsByClassName('js-p-tour__pin');
    this.bg = this.element.getElementsByClassName('js-p-tour__background');
    this.steps = this.element.getElementsByClassName('js-p-tour__step');
    this.targets = [];
    this.targetPositions = [];
    this.showPTour = bool;
    this.visibleStep = 0;
    this.isMobile = false;
    this.resizingId = false;
    this.stepTimeout = false;
    // trigger of the entire tour
    this.tourTriggers = document.getElementsByClassName('js-p-tour-start');
    initPTour(this);
  };

  // public methods
  PTour.prototype.show = function() {
    updateLayout(this);
    resetTour(this);
		showTour(this);
	};

  PTour.prototype.hide = function() {
		closeTour(this);
	};

  // private methods
  function initPTour(element) {
    // define position functions
    setPositionFn(element);

    // collect all targets
    collectTargets(element);

    // set layout type
    updateLayout(element);

    // detect click on tour element
    element.element.addEventListener('click', function(event) {
      // check if we need to close tour
      var closeBtn = event.target.closest('.js-p-tour__close');
      if(closeBtn) closeTour(element);

      // check if this was a next/prev button
      var nextStep = event.target.closest('.js-p-tour__btn-next');
      if(nextStep) updateSteps(element, 'next');
      var prevStep = event.target.closest('.js-p-tour__btn-prev');
      if(prevStep) updateSteps(element, 'prev');
    });

    // toggle tour visibility
    element.showPTour ? showTour(element) : closeTour(element);

    // on resize -> update layout type
    window.addEventListener('resize', function(event){
      clearTimeout(element.resizingId);
      element.resizingId = setTimeout(function(){
        updateLayout(element);
        if(!element.mobile) showSelectedStep(element);
      }, 200);
    });

    // start tour using a trigger button
    if(element.tourTriggers.length > 0) {
      for(var i = 0; i < element.tourTriggers.length; i++) {
        element.tourTriggers[i].addEventListener('click', function(event) {
          updateLayout(element);
          resetTour(element);
		      showTour(element);
        });
      }
    }

    // add loaded class
    Util.addClass(element.element, 'p-tour--loaded');
  };

  function setPositionFn(element) {
    element['tooltipBottom'] = tooltipBottom;
    element['tooltipTop'] = tooltipTop;
    element['tooltipLeft'] = tooltipLeft;
    element['tooltipRight'] = tooltipRight;
    element['tooltipBottomLeft'] = tooltipBottomLeft;
    element['tooltipBottomRight'] = tooltipBottomRight;
    element['tooltipTopLeft'] = tooltipTopLeft;
    element['tooltipTopRight'] = tooltipTopRight;
  };

  function collectTargets(element) {
    for(var i = 0; i < element.steps.length; i++) {
      element.targets.push(document.querySelector('[data-p-tour-target="'+(i + 1)+'"]'));
      element.targetPositions.push(element.targets[i].getAttribute('data-p-tour-position') || 'center');
    };
  };

  function showTour(element) {
    Util.removeClass(element.element, 'p-tour--is-hidden');
    // reveal step
    showSelectedStep(element);
    // show background
    animateBg(element);
  };

  function closeTour(element) {
    Util.addClass(element.element, 'p-tour--is-hidden');
    element.element.addEventListener('transitionend', function cb(){
      element.visibleStep = 0;
      element.element.removeEventListener('transitionend', cb);
      updateLayout(element);
      resetTour(element);
    });
  };

  function updateSteps(element, direction) {
    // clear timeout
    if(element.stepTimeout) {
      clearTimeout(element.stepTimeout);
      element.stepTimeout = false;
    }
    var newIndex = direction == 'next' ? element.visibleStep + 1 : element.visibleStep - 1;
    if(newIndex < 0) newIndex = element.steps.length - 1;
    if(newIndex >= element.steps.length) newIndex = 0;
    // reset bg class
    Util.removeClass(element.bg[0], 'p-tour__background--animate');
    // hide old step
    hideStep(element, direction, function(){
      // update index
      element.visibleStep = newIndex;
      // show new step
      showSelectedStep(element, direction);
      // trigger bg animation
      animateBg(element);
    });
  };

  function hideStep(element, direction, cb) {
    Util.removeClass(element.steps[element.visibleStep], 'p-tour__step--current');
    if(element.isMobile) {
      // small screen animation
      var isNext = (direction == 'next');
      Util.toggleClass(element.steps[element.visibleStep], 'p-tour__step--m-right', !isNext);
      Util.toggleClass(element.steps[element.visibleStep], 'p-tour__step--m-left', isNext);
    } else {
      Util.addClass(element.pin[0], 'p-tour__pin--out');
    }
    if(element.isMobile) cb();
    else {
      element.stepTimeout = setTimeout(cb, 300);
    }
  };

  function showSelectedStep(element, direction) {
    // get pin position
    var position = getPinPosition(element); // position = [top, left]
    // update pin position
    setPosition(element.pin[0], position);
    // show pin
    Util.removeClass(element.pin[0], 'p-tour__pin--out');
    // get class position of new step (e.g., p-tour__step--right)
    var classPosition = setTooltipPosition(element, position); 
    // remove all position classes
    Util.removeClass(element.steps[element.visibleStep], 'p-tour__step--top p-tour__step--bottom p-tour__step--left p-tour__step--right p-tour__step--bottom-right p-tour__step--bottom-left p-tour__step--top-right p-tour__step--top-left');
    if(element.isMobile) {
      Util.addClass(element.steps[element.visibleStep], 'p-tour__step--current');
    } else {
      Util.addClass(element.steps[element.visibleStep], 'p-tour__step--current '+classPosition);
    }
    
    if(direction) {
      // mobile animation
      Util.removeClass(element.steps[element.visibleStep], 'p-tour__step--m-left p-tour__step--m-right');
    }
    // move focus to first action button
    var btnAction = element.steps[element.visibleStep].querySelector('button');
    if(btnAction) btnAction.focus();
  };

  function animateBg(element) {
    Util.addClass(element.bg[0], 'p-tour__background--animate');
  };

  function updateLayout(element) {
    var layout = getComputedStyle(element.element).getPropertyValue('--p-tour-layout').replace(/'/g, '').replace(/"/g, '').trim();
    // on resize -> check tour layout type
    element.isMobile = (layout == 'mobile');
    // init steps
    initStepsPosition(element);
  };

  function initStepsPosition(element) {
    if(!element.isMobile) {
      for(var i = 0; i < element.steps.length; i++) Util.removeClass(element.steps[i], 'p-tour__step--m-left p-tour__step--m-right');
    } else {
      for(var i = 0; i < element.steps.length; i++) {
        element.steps[i].style.top = '';
        element.steps[i].style.left = '';
        if(i < element.visibleStep) {
          Util.addClass(element.steps[i], 'p-tour__step--m-left');
          Util.removeClass(element.steps[i], 'p-tour__step--m-right');
        } else if(i > element.visibleStep) {
          Util.addClass(element.steps[i], 'p-tour__step--m-right');
          Util.removeClass(element.steps[i], 'p-tour__step--m-left');
        } else {
          Util.removeClass(element.steps[i], 'p-tour__step--m-right');
          Util.removeClass(element.steps[i], 'p-tour__step--m-left');
        }
      }
    }
  };

  function resetTour(element) {
    for(var i = 0; i < element.steps.length; i++) {
      Util.removeClass(element.steps[i], 'p-tour__step--current');
    }
    Util.removeClass(element.bg[0], 'p-tour__background--animate');
  };

  function getPinPosition(element) {
    var tourPosition = element.targetPositions[element.visibleStep],
      stepTargetPosition = element.targets[element.visibleStep].getBoundingClientRect();
    var position = [0, 0]; // [top, left]

    switch (tourPosition) {
      case 'bottom':
        position[0] = stepTargetPosition.bottom;
        position[1] = stepTargetPosition.left + stepTargetPosition.width/2;
        break;
      case 'top':
        position[0] = stepTargetPosition.top;
        position[1] = stepTargetPosition.left + stepTargetPosition.width/2;
        break;
      case 'left':
        position[0] = stepTargetPosition.top + stepTargetPosition.height/2;
        position[1] = stepTargetPosition.left;
        break;
      case 'right':
        position[0] = stepTargetPosition.top + stepTargetPosition.height/2;
        position[1] = stepTargetPosition.left + stepTargetPosition.width;
        break;
      case 'center':
        position[0] = stepTargetPosition.top + stepTargetPosition.height/2;
        position[1] = stepTargetPosition.left + stepTargetPosition.width/2;
        break;
      case 'bottom-right':
        position[0] = stepTargetPosition.top + stepTargetPosition.height;
        position[1] = stepTargetPosition.left + stepTargetPosition.width;
        break;
      case 'bottom-left':
        position[0] = stepTargetPosition.top + stepTargetPosition.height;
        position[1] = stepTargetPosition.left;
        break;
      case 'top-right':
        position[0] = stepTargetPosition.top;
        position[1] = stepTargetPosition.left + stepTargetPosition.width;
        break;
      case 'top-left':
        position[0] = stepTargetPosition.top;
        position[1] = stepTargetPosition.left;
        break;
    }
    return position;
  };

  function setPosition(element, position) {
    // position = [top, left]
    if(position[0] !== false) element.style.top = position[0]+'px';
    if(position[1] !== false) element.style.left = position[1]+'px';
  };

  function setTooltipPosition(element, position) {
    if(element.isMobile) return false;
    var layout = element.targetPositions[element.visibleStep];
    if(layout == 'center') layout == 'top';
    var tooltipInfo = getTooltipInfo(element, layout, position);
    setPosition(element.steps[element.visibleStep], tooltipInfo[1]);
    return 'p-tour__step--'+tooltipInfo[0];
  };

  function getTooltipInfo(element, layout, position) {
    switch (layout) {
      case 'bottom':
      case 'center':
        var result = checkPosition(element, 'tooltipBottom', 'tooltipTop', 'tooltipLeft', 'tooltipRight', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
      case 'top':
        var result = checkPosition(element, 'tooltipTop', 'tooltipBottom', 'tooltipLeft', 'tooltipRight', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
      case 'left':
      case 'bottom-left':
      case 'top-left':
        var result = checkPosition(element, 'tooltipLeft', 'tooltipTop', 'tooltipBottom', 'tooltipRight', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
      case 'right':
      case 'bottom-right':
      case 'top-right':
        var result = checkPosition(element, 'tooltipRight', 'tooltipLeft', 'tooltipTop', 'tooltipBottom', 'tooltipBottomLeft', 'tooltipBottomRight', 'tooltipTopLeft', 'tooltipTopRight', position);
        break;
    }
    return [result[1], result[0]];
  };

  function checkPosition(element, pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, position) {
    var result = element[pos1](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos2](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos3](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos4](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos5](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos6](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos7](element, position);
    if(result[0]) return [result[1], result[2]];
    result = element[pos8](element, position);
    if(result[0]) return [result[1], result[2]];
    return [[position[0], position[1] - element.steps[element.visibleStep].getBoundingClientRect().width], 'bottom'];
  };

  function tooltipBottom(element, position) {
    // check if tooltip can be placed below the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(tooltipBox.height + position[0] > window.innerHeight && position[0] > tooltipBox.height) {
      return [false, false, false]; 
    }
    if(position[1] - tooltipBox.width/2 < 0 && position[1] + tooltipBox.width < window.innerWidth) {
      return [false, false, false]; 
    }

    if(position[1] + tooltipBox.width > window.innerWidth && position[1] - tooltipBox.width > 0) {
      return [false, false, false]; 
    }
    return [true, [position[0], position[1] - tooltipBox.width/2], 'bottom'];
  };

  function tooltipTop(element, position) {
    // check if tooltip can be placed on top of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if( position[0] < tooltipBox.height && position[0] + tooltipBox.height < window.innerHeight) {
      return [false, false, false]; 
    }
    if(position[1] - tooltipBox.width/2 < 0 && position[1] + tooltipBox.width < window.innerWidth) {
      return [false, false, false]; 
    }
    
    if(position[1] + tooltipBox.width/2 > window.innerWidth && position[1] - tooltipBox.width > 0) {
      return [false, false, false]; 
    }
    return [true, [position[0] - tooltipBox.height, position[1] - tooltipBox.width/2], 'top'];
  };

  function tooltipLeft(element, position) {
    // check if tooltip can be placed to the left of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] < tooltipBox.width && position[1] + tooltipBox.width < window.innerWidth) return [false, false, false];
    if(position[0] < tooltipBox.height/2 && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    if(position[0] + tooltipBox.height/2 >  window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0] - tooltipBox.height/2, position[1] - tooltipBox.width], 'left'];
  };

  function tooltipRight(element, position) {
    // check if tooltip can be placed to the right of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] + tooltipBox.width > window.innerWidth && position[1] > tooltipBox.width) return [false, false, false];
    if(position[0] < tooltipBox.height/2 && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    if(position[0] + tooltipBox.height/2 >  window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0] - tooltipBox.height/2, position[1]], 'right'];
  };

  function tooltipBottomLeft(element, position) {
    // check if tooltip can be placed to the bottom-left of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] < tooltipBox.width && position[1] + tooltipBox.width < window.innerWidth) return [false, false, false];
    if(position[0] + tooltipBox.height > window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0], position[1] - tooltipBox.width], 'bottom-left'];
  };

  function tooltipTopLeft(element, position) {
    // check if tooltip can be placed to the top-left of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] < tooltipBox.width && position[1] + tooltipBox.width < window.innerWidth) return [false, false, false];
    if(position[0] < tooltipBox.height && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    return [true, [position[0] - tooltipBox.height, position[1] - tooltipBox.width], 'top-left'];
  };

  function tooltipBottomRight(element, position) {
    // check if tooltip can be placed to the bottom-right of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] + tooltipBox.width > window.innerWidth && position[1] > tooltipBox.width) return [false, false, false];
    if(position[0] + tooltipBox.height > window.innerHeight && position[0] > tooltipBox.height) return [false, false, false];
    return [true, [position[0], position[1]], 'bottom-right'];
  };

  function tooltipTopRight(element, position) {
    // check if tooltip can be placed to the top-right of the pin
    var tooltipBox = element.steps[element.visibleStep].getBoundingClientRect();
    if(position[1] + tooltipBox.width > window.innerWidth && position[1] > tooltipBox.width) return [false, false, false];
    if(position[0] < tooltipBox.height && position[0] + tooltipBox.height < window.innerHeight) return [false, false, false];
    return [true, [position[0] - tooltipBox.height, position[1]], 'top-right'];
  };

  window.PTour = PTour;

  //initialize the PTour objects
	var pTour = document.getElementsByClassName('js-p-tour');
	if( pTour.length > 0 ) {
		for( var i = 0; i < pTour.length; i++) {
			(function(i){new PTour(pTour[i], true);})(i);
		}
	};
}());
// File#: _1_rating
// Usage: codyhouse.co/license
(function() {
	var Rating = function(element) {
		this.element = element;
		this.icons = this.element.getElementsByClassName('js-rating__control')[0];
		this.iconCode = this.icons.children[0].parentNode.innerHTML;
		this.initialRating = [];
		this.initialRatingElement = this.element.getElementsByClassName('js-rating__value')[0];
		this.ratingItems;
		this.selectedRatingItem;
    this.readOnly = Util.hasClass(this.element, 'js-rating--read-only');
		this.ratingMaxValue = 5;
		this.getInitialRating();
		this.initRatingHtml();
	};

	Rating.prototype.getInitialRating = function() {
		// get the rating of the product
		if(!this.initialRatingElement || !this.readOnly) {
			this.initialRating = [0, false];
			return;
		}

		var initialValue = Number(this.initialRatingElement.textContent);
		if(isNaN(initialValue)) {
			this.initialRating = [0, false];
			return;
		}

		var floorNumber = Math.floor(initialValue);
		this.initialRating[0] = (floorNumber < initialValue) ? floorNumber + 1 : floorNumber;
		this.initialRating[1] = (floorNumber < initialValue) ? Math.round((initialValue - floorNumber)*100) : false;
	};

	Rating.prototype.initRatingHtml = function() {
		//create the star elements
		var iconsList = this.readOnly ? '<ul>' : '<ul role="radiogroup">';
		
		//if initial rating value is zero -> add a 'zero' item 
		if(this.initialRating[0] == 0 && !this.initialRating[1]) {
			iconsList = iconsList+ '<li class="rating__item--zero rating__item--checked"></li>';
		}

		// create the stars list 
		for(var i = 0; i < this.ratingMaxValue; i++) { 
			iconsList = iconsList + this.getStarHtml(i);
		}
		iconsList = iconsList + '</ul>';

		// --default variation only - improve SR accessibility including a legend element 
		if(!this.readOnly) {
			var labelElement = this.element.getElementsByTagName('label');
			if(labelElement.length > 0) {
				var legendElement = '<legend class="'+labelElement[0].getAttribute('class')+'">'+labelElement[0].textContent+'</legend>';
				iconsList = '<fieldset>'+legendElement+iconsList+'</fieldset>';
				Util.addClass(labelElement[0], 'is-hidden');
			}
		}

		this.icons.innerHTML = iconsList;
		
		//init object properties
		this.ratingItems = this.icons.getElementsByClassName('js-rating__item');
		this.selectedRatingItem = this.icons.getElementsByClassName('rating__item--checked')[0];

		//show the stars
		Util.removeClass(this.icons, 'rating__control--is-hidden');

		//event listener
		!this.readOnly && this.initRatingEvents();// rating vote enabled
	};

	Rating.prototype.getStarHtml = function(index) {
		var listItem = '';
		var checked = (index+1 == this.initialRating[0]) ? true : false,
			itemClass = checked ? ' rating__item--checked' : '',
			tabIndex = (checked || (this.initialRating[0] == 0 && !this.initialRating[1] && index == 0) ) ? 0 : -1,
			showHalf = checked && this.initialRating[1] ? true : false,
			iconWidth = showHalf ? ' rating__item--half': '';
		if(!this.readOnly) {
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'" role="radio" aria-label="'+(index+1)+'" aria-checked="'+checked+'" tabindex="'+tabIndex+'"><div class="rating__icon">'+this.iconCode+'</div></li>';
		} else {
			var starInner = showHalf ? '<div class="rating__icon">'+this.iconCode+'</div><div class="rating__icon rating__icon--inactive">'+this.iconCode+'</div>': '<div class="rating__icon">'+this.iconCode+'</div>';
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'">'+starInner+'</li>';
		}
		return listItem;
	};

	Rating.prototype.initRatingEvents = function() {
		var self = this;

		//click on a star
		this.icons.addEventListener('click', function(event){
			var trigger = event.target.closest('.js-rating__item');
			self.resetSelectedIcon(trigger);
		});

		//keyboard navigation -> select new star
		this.icons.addEventListener('keydown', function(event){
			if( event.keyCode && (event.keyCode == 39 || event.keyCode == 40 ) || event.key && (event.key.toLowerCase() == 'arrowright' || event.key.toLowerCase() == 'arrowdown') ) {
				self.selectNewIcon('next'); //select next star on arrow right/down
			} else if(event.keyCode && (event.keyCode == 37 || event.keyCode == 38 ) || event.key && (event.key.toLowerCase() == 'arrowleft' || event.key.toLowerCase() == 'arrowup')) {
				self.selectNewIcon('prev'); //select prev star on arrow left/up
			} else if(event.keyCode && event.keyCode == 32 || event.key && event.key == ' ') {
				self.selectFocusIcon(); // select focused star on Space
			}
		});
	};

	Rating.prototype.selectNewIcon = function(direction) {
		var index = Util.getIndexInArray(this.ratingItems, this.selectedRatingItem);
		index = (direction == 'next') ? index + 1 : index - 1;
		if(index < 0) index = this.ratingItems.length - 1;
		if(index >= this.ratingItems.length) index = 0;	
		this.resetSelectedIcon(this.ratingItems[index]);
		this.ratingItems[index].focus();
	};

	Rating.prototype.selectFocusIcon = function(direction) {
		this.resetSelectedIcon(document.activeElement);
	};

	Rating.prototype.resetSelectedIcon = function(trigger) {
		if(!trigger) return;
		Util.removeClass(this.selectedRatingItem, 'rating__item--checked');
		Util.setAttributes(this.selectedRatingItem, {'aria-checked': false, 'tabindex': -1});
		Util.addClass(trigger, 'rating__item--checked');
		Util.setAttributes(trigger, {'aria-checked': true, 'tabindex': 0});
		this.selectedRatingItem = trigger; 
		// update select input value
		var select = this.element.getElementsByTagName('select');
		if(select.length > 0) {
			select[0].value = trigger.getAttribute('aria-label');
		}
	};
	
	//initialize the Rating objects
	var ratings = document.getElementsByClassName('js-rating');
	if( ratings.length > 0 ) {
		for( var i = 0; i < ratings.length; i++) {
			(function(i){new Rating(ratings[i]);})(i);
		}
	};
}());
// File#: _1_read-more
// Usage: codyhouse.co/license
(function() {
  var ReadMore = function(element) {
    this.element = element;
    this.moreContent = this.element.getElementsByClassName('js-read-more__content');
    this.count = this.element.getAttribute('data-characters') || 200;
    this.counting = 0;
    this.btnClasses = this.element.getAttribute('data-btn-class');
    this.ellipsis = this.element.getAttribute('data-ellipsis') && this.element.getAttribute('data-ellipsis') == 'off' ? false : true;
    this.btnShowLabel = 'Read more';
    this.btnHideLabel = 'Read less';
    this.toggleOff = this.element.getAttribute('data-toggle') && this.element.getAttribute('data-toggle') == 'off' ? false : true;
    if( this.moreContent.length == 0 ) splitReadMore(this);
    setBtnLabels(this);
    initReadMore(this);
  };

  function splitReadMore(readMore) { 
    splitChildren(readMore.element, readMore); // iterate through children and hide content
  };

  function splitChildren(parent, readMore) {
    if(readMore.counting >= readMore.count) {
      Util.addClass(parent, 'js-read-more__content');
      return parent.outerHTML;
    }
    var children = parent.childNodes;
    var content = '';
    for(var i = 0; i < children.length; i++) {
      if (children[i].nodeType == Node.TEXT_NODE) {
        content = content + wrapText(children[i], readMore);
      } else {
        content = content + splitChildren(children[i], readMore);
      }
    }
    parent.innerHTML = content;
    return parent.outerHTML;
  };

  function wrapText(element, readMore) {
    var content = element.textContent;
    if(content.replace(/\s/g,'').length == 0) return '';// check if content is empty
    if(readMore.counting >= readMore.count) {
      return '<span class="js-read-more__content">' + content + '</span>';
    }
    if(readMore.counting + content.length < readMore.count) {
      readMore.counting = readMore.counting + content.length;
      return content;
    }
    var firstContent = content.substr(0, readMore.count - readMore.counting);
    firstContent = firstContent.substr(0, Math.min(firstContent.length, firstContent.lastIndexOf(" ")));
    var secondContent = content.substr(firstContent.length, content.length);
    readMore.counting = readMore.count;
    return firstContent + '<span class="js-read-more__content">' + secondContent + '</span>';
  };

  function setBtnLabels(readMore) { // set custom labels for read More/Less btns
    var btnLabels = readMore.element.getAttribute('data-btn-labels');
    if(btnLabels) {
      var labelsArray = btnLabels.split(',');
      readMore.btnShowLabel = labelsArray[0].trim();
      readMore.btnHideLabel = labelsArray[1].trim();
    }
  };

  function initReadMore(readMore) { // add read more/read less buttons to the markup
    readMore.moreContent = readMore.element.getElementsByClassName('js-read-more__content');
    if( readMore.moreContent.length == 0 ) {
      Util.addClass(readMore.element, 'read-more--loaded');
      return;
    }
    var btnShow = ' <button class="js-read-more__btn '+readMore.btnClasses+'">'+readMore.btnShowLabel+'</button>';
    var btnHide = ' <button class="js-read-more__btn is-hidden '+readMore.btnClasses+'">'+readMore.btnHideLabel+'</button>';
    if(readMore.ellipsis) {
      btnShow = '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>'+ btnShow;
    }

    readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML('afterend', btnHide);
    readMore.moreContent[0].insertAdjacentHTML('afterend', btnShow);
    resetAppearance(readMore);
    initEvents(readMore);
  };

  function resetAppearance(readMore) { // hide part of the content
    for(var i = 0; i < readMore.moreContent.length; i++) Util.addClass(readMore.moreContent[i], 'is-hidden');
    Util.addClass(readMore.element, 'read-more--loaded'); // show entire component
  };

  function initEvents(readMore) { // listen to the click on the read more/less btn
    readMore.btnToggle = readMore.element.getElementsByClassName('js-read-more__btn');
    readMore.ellipsis = readMore.element.getElementsByClassName('js-read-more__ellipsis');

    readMore.btnToggle[0].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, true);
    });
    readMore.btnToggle[1].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, false);
    });
  };

  function updateVisibility(readMore, visibile) {
    for(var i = 0; i < readMore.moreContent.length; i++) Util.toggleClass(readMore.moreContent[i], 'is-hidden', !visibile);
    // reset btns appearance
    Util.toggleClass(readMore.btnToggle[0], 'is-hidden', visibile);
    Util.toggleClass(readMore.btnToggle[1], 'is-hidden', !visibile);
    if(readMore.ellipsis.length > 0 ) Util.toggleClass(readMore.ellipsis[0], 'is-hidden', visibile);
    if(!readMore.toggleOff) Util.addClass(readMore.btn, 'is-hidden');
    // move focus
    if(visibile) {
      var targetTabIndex = readMore.moreContent[0].getAttribute('tabindex');
      Util.moveFocus(readMore.moreContent[0]);
      resetFocusTarget(readMore.moreContent[0], targetTabIndex);
    } else {
      Util.moveFocus(readMore.btnToggle[0]);
    }
  };

  function resetFocusTarget(target, tabindex) {
    if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}
  };

  //initialize the ReadMore objects
	var readMore = document.getElementsByClassName('js-read-more');
	if( readMore.length > 0 ) {
		for( var i = 0; i < readMore.length; i++) {
			(function(i){new ReadMore(readMore[i]);})(i);
		}
	};
}());
// File#: _1_repeater
// Usage: codyhouse.co/license
(function() {
  var Repeater = function(element) {
    this.element = element;
    this.blockWrapper = this.element.getElementsByClassName('js-repeater__list');
    if(this.blockWrapper.length < 1) return;
    this.blocks = false;
    getBlocksList(this);
    this.firstBlock = false;
    this.addNew = this.element.getElementsByClassName('js-repeater__add');
    this.cloneClass = this.element.getAttribute('data-repeater-class');
    this.inputName = this.element.getAttribute('data-repeater-input-name');
    initRepeater(this);
  };

  function initRepeater(element) {
    if(element.addNew.length < 1 || element.blocks.length < 1 || element.blockWrapper.length < 1 ) return;
    element.firstBlock = element.blocks[0].cloneNode(true);
    
    // detect click on a Remove button
    element.element.addEventListener('click', function(event) {
      var deleteBtn = event.target.closest('.js-repeater__remove');
      if(deleteBtn) {
        event.preventDefault();
        removeBlock(element, deleteBtn);
      }
    });

    // detect click on Add button
    element.addNew[0].addEventListener('click', function(event) {
      event.preventDefault();
      addBlock(element);
    });
  };

  function addBlock(element) {
    if(element.blocks.length > 0) {
      var clone = element.blocks[element.blocks.length - 1].cloneNode(true),
        nameToReplace = element.inputName.replace('[n]', '['+(element.blocks.length - 1)+']'),
        newName = element.inputName.replace('[n]', '['+element.blocks.length+']');
    } else {
      var clone =  element.firstBlock.cloneNode(true),
      nameToReplace = element.inputName.replace('[n]', '[0]'),
      newName = element.inputName.replace('[n]', '[0]');
    }
    
    if(element.cloneClass) Util.addClass(clone, element.cloneClass);
    // modify name/for/id attributes
    updateBlockAttrs(clone, nameToReplace, newName, true);

    element.blockWrapper[0].appendChild(clone);
    // update blocks list
    getBlocksList(element)
  };

  function removeBlock(element, trigger) {
    var block = trigger.closest('.js-repeater__item');
    if(block) {
      var index = Util.getIndexInArray(element.blocks, block);
      block.remove();
      // update blocks list
      getBlocksList(element);
      // need to reset all blocks after that -> name/for/id values
      for(var i = index; i < element.blocks.length; i++) {
        updateBlockAttrs(element.blocks[i], element.inputName.replace('[n]', '['+(i+1)+']'), element.inputName.replace('[n]', '['+i+']'));
      }
    }
  };

  function updateBlockAttrs(block, nameToReplace, newName, reset) {
    var nameElements = block.querySelectorAll('[name^="'+nameToReplace+'"]'),
      forElements = block.querySelectorAll('[for^="'+nameToReplace+'"]'),
      idElements = block.querySelectorAll('[id^="'+nameToReplace+'"]');

    for(var i = 0; i < nameElements.length; i++) {
      var nameAttr = nameElements[i].getAttribute('name');
      nameElements[i].setAttribute('name', nameAttr.replace(nameToReplace, newName));
      if(reset && nameElements[i].value) nameElements[i].value = '';
    }

    for(var i = 0; i < forElements.length; i++) {
      var forAttr = forElements[i].getAttribute('for');
      forElements[i].setAttribute('for', forAttr.replace(nameToReplace, newName));
    }

    for(var i = 0; i < idElements.length; i++) {
      var idAttr = idElements[i].getAttribute('id');
      idElements[i].setAttribute('id', idAttr.replace(nameToReplace, newName));
    }
  };

  function getBlocksList(element) {
    element.blocks = Util.getChildrenByClassName(element.blockWrapper[0], 'js-repeater__item');
  };

  //initialize the Repeater objects
	var repeater = document.getElementsByClassName('js-repeater');
	if( repeater.length > 0 ) {
		for( var i = 0; i < repeater.length; i++) {
			(function(i){new Repeater(repeater[i]);})(i);
		}
	};
}());
// File#: _1_reveal-effects
// Usage: codyhouse.co/license
(function() {
	var fxElements = document.getElementsByClassName('reveal-fx');
	var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(fxElements.length > 0) {
		// deactivate effect if Reduced Motion is enabled
		if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
			fxRemoveClasses();
			return;
		}
		//on small devices, do not animate elements -> reveal all
		if( fxDisabled(fxElements[0]) ) {
			fxRevealAll();
			return;
		}

		var fxRevealDelta = 120; // amount (in pixel) the element needs to enter the viewport to be revealed - if not custom value (data-reveal-fx-delta)
		
		var viewportHeight = window.innerHeight,
			fxChecking = false,
			fxRevealedItems = [],
			fxElementDelays = fxGetDelays(), //elements animation delay
			fxElementDeltas = fxGetDeltas(); // amount (in px) the element needs enter the viewport to be revealed (default value is fxRevealDelta) 
		
		
		// add event listeners
		window.addEventListener('load', fxReveal);
		window.addEventListener('resize', fxResize);
		window.addEventListener('restartAll', fxRestart);

		// observe reveal elements
		var observer = [];
		initObserver();

		function initObserver() {
			for(var i = 0; i < fxElements.length; i++) {
				observer[i] = new IntersectionObserver(
					function(entries, observer) { 
						if(entries[0].isIntersecting) {
							fxRevealItemObserver(entries[0].target);
							observer.unobserve(entries[0].target);
						}
					}, 
					{rootMargin: "0px 0px -"+fxElementDeltas[i]+"px 0px"}
				);
	
				observer[i].observe(fxElements[i]);
			}
		};

		function fxRevealAll() { // reveal all elements - small devices
			for(var i = 0; i < fxElements.length; i++) {
				Util.addClass(fxElements[i], 'reveal-fx--is-visible');
			}
		};

		function fxResize() { // on resize - check new window height and reveal visible elements
			if(fxChecking) return;
			fxChecking = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){fxReset();}, 250) : window.requestAnimationFrame(fxReset);
		};

		function fxReset() {
			viewportHeight = window.innerHeight;
			fxReveal();
		};

		function fxReveal() { // reveal visible elements
			for(var i = 0; i < fxElements.length; i++) {(function(i){
				if(fxRevealedItems.indexOf(i) != -1 ) return; //element has already been revelead
				if(fxElementIsVisible(fxElements[i], i)) {
					fxRevealItem(i);
					fxRevealedItems.push(i);
				}})(i); 
			}
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxRevealItem(index) {
			if(fxElementDelays[index] && fxElementDelays[index] != 0) {
				// wait before revealing element if a delay was added
				setTimeout(function(){
					Util.addClass(fxElements[index], 'reveal-fx--is-visible');
				}, fxElementDelays[index]);
			} else {
				Util.addClass(fxElements[index], 'reveal-fx--is-visible');
			}
		};

		function fxRevealItemObserver(item) {
			var index = Util.getIndexInArray(fxElements, item);
			if(fxRevealedItems.indexOf(index) != -1 ) return; //element has already been revelead
			fxRevealItem(index);
			fxRevealedItems.push(index);
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxGetDelays() { // get anmation delays
			var delays = [];
			for(var i = 0; i < fxElements.length; i++) {
				delays.push( fxElements[i].getAttribute('data-reveal-fx-delay') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delay')) : 0);
			}
			return delays;
		};

		function fxGetDeltas() { // get reveal delta
			var deltas = [];
			for(var i = 0; i < fxElements.length; i++) {
				deltas.push( fxElements[i].getAttribute('data-reveal-fx-delta') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delta')) : fxRevealDelta);
			}
			return deltas;
		};

		function fxDisabled(element) { // check if elements need to be animated - no animation on small devices
			return !(window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/'|"/g, "") == 'reveal-fx');
		};

		function fxElementIsVisible(element, i) { // element is inside viewport
			return (fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]);
		};

		function fxGetElementPosition(element) { // get top position of element
			return element.getBoundingClientRect().top;
		};

		function fxResetEvents() { 
			if(fxElements.length > fxRevealedItems.length) return;
			// remove event listeners if all elements have been revealed
			window.removeEventListener('load', fxReveal);
			window.removeEventListener('resize', fxResize);
		};

		function fxRemoveClasses() {
			// Reduced Motion on or Intersection Observer not supported
			while(fxElements[0]) {
				// remove all classes starting with 'reveal-fx--'
				var classes = fxElements[0].getAttribute('class').split(" ").filter(function(c) {
					return c.lastIndexOf('reveal-fx--', 0) !== 0;
				});
				fxElements[0].setAttribute('class', classes.join(" ").trim());
				Util.removeClass(fxElements[0], 'reveal-fx');
			}
		};

		function fxRestart() {
      // restart the reveal effect -> hide all elements and re-init the observer
      if (Util.osHasReducedMotion() || !intersectionObserverSupported || fxDisabled(fxElements[0])) {
        return;
      }
      // check if we need to add the event listensers back
      if(fxElements.length <= fxRevealedItems.length) {
        window.addEventListener('load', fxReveal);
        window.addEventListener('resize', fxResize);
      }
      // remove observer and reset the observer array
      for(var i = 0; i < observer.length; i++) {
        if(observer[i]) observer[i].disconnect();
      }
      observer = [];
      // remove visible class
      for(var i = 0; i < fxElements.length; i++) {
        Util.removeClass(fxElements[i], 'reveal-fx--is-visible');
      }
      // reset fxRevealedItems array
      fxRevealedItems = [];
      // restart observer
      initObserver();
    };
	}
}());
// File#: _1_revealing-section
// Usage: codyhouse.co/license
(function() {
  var RevealingSection = function(element) {
    this.element = element;
    this.scrollingFn = false;
    this.scrolling = false;
    this.resetOpacity = false;
    initRevealingSection(this);
  };

  function initRevealingSection(element) {
    // set position of sticky element
    setBottom(element);
    // create a new node - to be inserted before the sticky element
    createPrevElement(element);
    // on resize -> reset element bottom position
    element.element.addEventListener('update-reveal-section', function(){
      setBottom(element);
      setPrevElementTop(element);
    });
    animateRevealingSection.bind(element)(); // set initial status
    // change opacity of layer
    var observer = new IntersectionObserver(revealingSectionCallback.bind(element));
		observer.observe(element.prevElement);
  };

  function createPrevElement(element) {
    var newElement = document.createElement("div"); 
    newElement.setAttribute('aria-hidden', 'true');
    element.element.parentElement.insertBefore(newElement, element.element);
    element.prevElement =  element.element.previousElementSibling;
    element.prevElement.style.opacity = '0';
    element.prevElement.style.height = '1px';
    setPrevElementTop(element);
  };

  function setPrevElementTop(element) {
    element.prevElementTop = element.prevElement.getBoundingClientRect().top + window.scrollY;
  };

  function revealingSectionCallback(entries, observer) {
		if(entries[0].isIntersecting) {
      if(this.scrollingFn) return; // listener for scroll event already added
      revealingSectionInitEvent(this);
    } else {
      if(!this.scrollingFn) return; // listener for scroll event already removed
      window.removeEventListener('scroll', this.scrollingFn);
      updateOpacityValue(this, 0);
      this.scrollingFn = false;
    }
  };
  
  function revealingSectionInitEvent(element) {
    element.scrollingFn = revealingSectionScrolling.bind(element);
    window.addEventListener('scroll', element.scrollingFn);
  };

  function revealingSectionScrolling() {
    if(this.scrolling) return;
    this.scrolling = true;
    window.requestAnimationFrame(animateRevealingSection.bind(this));
  };

  function animateRevealingSection() {
    if(this.prevElementTop - window.scrollY < window.innerHeight) {
      var opacity = (1 - (window.innerHeight + window.scrollY - this.prevElementTop)/window.innerHeight).toFixed(2);
      if(opacity > 0 ) {
        this.resetOpacity = false;
        updateOpacityValue(this, opacity);
      } else if(!this.resetOpacity) {
        this.resetOpacity = true;
        updateOpacityValue(this, 0);
      } 
    }
    this.scrolling = false;
  };

  function updateOpacityValue(element, value) {
    element.element.style.setProperty('--reavealing-section-overlay-opacity', value);
  };

  function setBottom(element) {
    var translateValue = window.innerHeight - element.element.offsetHeight;
    if(translateValue > 0) translateValue = 0;
    element.element.style.bottom = ''+translateValue+'px';
  };

  //initialize the Revealing Section objects
  var revealingSection = document.getElementsByClassName('js-revealing-section');
  var stickySupported = Util.cssSupports('position', 'sticky') || Util.cssSupports('position', '-webkit-sticky');
	if( revealingSection.length > 0 && stickySupported) {
    var revealingSectionArray = [];
		for( var i = 0; i < revealingSection.length; i++) {
      (function(i){revealingSectionArray.push(new RevealingSection(revealingSection[i]));})(i);
    }
    
    var resizingId = false,
      customEvent = new CustomEvent('update-reveal-section');

    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 100);
    });

    // wait for font to be loaded
    if(document.fonts) {
      document.fonts.onloadingdone = function (fontFaceSetEvent) {
        doneResizing();
      };
    }

    function doneResizing() {
      for( var i = 0; i < revealingSectionArray.length; i++) {
        (function(i){revealingSectionArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
	}
}());
// File#: _1_scrolling-animations
// Usage: codyhouse.co/license
(function() {
  var ScrollFx = function(element, scrollableSelector) {
    this.element = element;
    this.options = [];
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    this.scrollingFx = [];
    this.animating = [];
    this.deltaScrolling = [];
    this.observer = [];
    this.scrollableSelector = scrollableSelector; // if the scrollable element is not the window 
    this.scrollableElement = false;
    initScrollFx(this);
    // ToDo - option to pass two selectors to target the element start and stop animation scrolling values -> to be used for sticky/fixed elements
  };

  function initScrollFx(element) {
    // do not animate if reduced motion is on
    if(Util.osHasReducedMotion()) return;
    // get scrollable element
    setScrollableElement(element);
    // get animation params
    var animation = element.element.getAttribute('data-scroll-fx');
    if(animation) {
      element.options.push(extractAnimation(animation));
    } else {
      getAnimations(element, 1);
    }
    // set Intersection Observer
    initObserver(element);
    // update params on resize
    initResize(element);
  };

  function setScrollableElement(element) {
    if(element.scrollableSelector) element.scrollableElement = document.querySelector(element.scrollableSelector);
  };

  function initObserver(element) {
    for(var i = 0; i < element.options.length; i++) {
      (function(i){
        element.scrollingFx[i] = false;
        element.deltaScrolling[i] = getDeltaScrolling(element, i);
        element.animating[i] = false;

        element.observer[i] = new IntersectionObserver(
          function(entries, observer) { 
            scrollFxCallback(element, i, entries, observer);
          },
          {
            rootMargin: (element.options[i][5] -100)+"% 0px "+(0 - element.options[i][4])+"% 0px"
          }
        );
    
        element.observer[i].observe(element.element);

        // set initial value
        setTimeout(function(){
          animateScrollFx.bind(element, i)();
        })
      })(i);
    }
  };

  function scrollFxCallback(element, index, entries, observer) {
		if(entries[0].isIntersecting) {
      if(element.scrollingFx[index]) return; // listener for scroll event already added
      // reset delta
      resetDeltaBeforeAnim(element, index);
      triggerAnimateScrollFx(element, index);
    } else {
      if(!element.scrollingFx[index]) return; // listener for scroll event already removed
      window.removeEventListener('scroll', element.scrollingFx[index]);
      element.scrollingFx[index] = false;
    }
  };

  function triggerAnimateScrollFx(element, index) {
    element.scrollingFx[index] = animateScrollFx.bind(element, index);
    (element.scrollableElement)
      ? element.scrollableElement.addEventListener('scroll', element.scrollingFx[index])
      : window.addEventListener('scroll', element.scrollingFx[index]);
  };

  function animateScrollFx(index) {
    // if window scroll is outside the proper range -> return
    if(getScrollY(this) < this.deltaScrolling[index][0]) {
      setCSSProperty(this, index, this.options[index][1]);
      return;
    }
    if(getScrollY(this) > this.deltaScrolling[index][1]) {
      setCSSProperty(this, index, this.options[index][2]);
      return;
    }
    if(this.animating[index]) return;
    this.animating[index] = true;
    window.requestAnimationFrame(updatePropertyScroll.bind(this, index));
  };

  function updatePropertyScroll(index) { // get value
    // check if this is a theme value or a css property
    if(isNaN(this.options[index][1])) {
      // this is a theme value to update
      (getScrollY(this) >= this.deltaScrolling[index][1]) 
        ? setCSSProperty(this, index, this.options[index][2])
        : setCSSProperty(this, index, this.options[index][1]);
    } else {
      // this is a CSS property
      var value = this.options[index][1] + (this.options[index][2] - this.options[index][1])*(getScrollY(this) - this.deltaScrolling[index][0])/(this.deltaScrolling[index][1] - this.deltaScrolling[index][0]);
      // update css property
      setCSSProperty(this, index, value);
    }
    
    this.animating[index] = false;
  };

  function setCSSProperty(element, index, value) {
    if(isNaN(value)) {
      // this is a theme value that needs to be updated
      setThemeValue(element, value);
      return;
    }
    if(element.options[index][0] == '--scroll-fx-skew' || element.options[index][0] == '--scroll-fx-scale') {
      // set 2 different CSS properties for the transformation on both x and y axis
      element.element.style.setProperty(element.options[index][0]+'-x', value+element.options[index][3]);
      element.element.style.setProperty(element.options[index][0]+'-y', value+element.options[index][3]);
    } else {
      // set single CSS property
      element.element.style.setProperty(element.options[index][0], value+element.options[index][3]);
    }
  };

  function setThemeValue(element, value) {
    // if value is different from the theme in use -> update it
    if(element.element.getAttribute('data-theme') != value) {
      Util.addClass(element.element, 'scroll-fx--theme-transition');
      element.element.offsetWidth;
      element.element.setAttribute('data-theme', value);
      element.element.addEventListener('transitionend', function cb(){
        element.element.removeEventListener('transitionend', cb);
        Util.removeClass(element.element, 'scroll-fx--theme-transition');
      });
    }
  };

  function getAnimations(element, index) {
    var option = element.element.getAttribute('data-scroll-fx-'+index);
    if(option) {
      // multiple animations for the same element - iterate through them
      element.options.push(extractAnimation(option));
      getAnimations(element, index+1);
    } 
    return;
  };

  function extractAnimation(option) {
    var array = option.split(',').map(function(item) {
      return item.trim();
    });
    var propertyOptions = getPropertyValues(array[1], array[2]);
    var animation = [getPropertyLabel(array[0]), propertyOptions[0], propertyOptions[1], propertyOptions[2], parseInt(array[3]), parseInt(array[4])];
    return animation;
  };

  function getPropertyLabel(property) {
    var propertyCss = '--scroll-fx-';
    for(var i = 0; i < property.length; i++) {
      propertyCss = (property[i] == property[i].toUpperCase())
        ? propertyCss + '-'+property[i].toLowerCase()
        : propertyCss +property[i];
    }
    if(propertyCss == '--scroll-fx-rotate') {
      propertyCss = '--scroll-fx-rotate-z';
    } else if(propertyCss == '--scroll-fx-translate') {
      propertyCss = '--scroll-fx-translate-x';
    }
    return propertyCss;
  };

  function getPropertyValues(val1, val2) {
    var nbVal1 = parseFloat(val1), 
      nbVal2 = parseFloat(val2),
      unit = val1.replace(nbVal1, '');
    if(isNaN(nbVal1)) {
      // property is a theme value
      nbVal1 = val1;
      nbVal2 = val2;
      unit = '';
    }
    return [nbVal1, nbVal2, unit];
  };

  function getDeltaScrolling(element, index) {
    // this retrieve the max and min scroll value that should trigger the animation
    var topDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][4]/100) + element.boundingRect.top,
      bottomDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][5]/100) + element.boundingRect.top;
    return [topDelta, bottomDelta];
  };

  function initResize(element) {
    var resizingId = false;
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(resetResize.bind(element), 500);
    });
    // emit custom event -> elements have been initialized
    var event = new CustomEvent('scrollFxReady');
		element.element.dispatchEvent(event);
  };

  function resetResize() {
    // on resize -> make sure to update all scrolling delta values
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    for(var i = 0; i < this.deltaScrolling.length; i++) {
      this.deltaScrolling[i] = getDeltaScrolling(this, i);
      animateScrollFx.bind(this, i)();
    }
    // emit custom event -> elements have been resized
    var event = new CustomEvent('scrollFxResized');
		this.element.dispatchEvent(event);
  };

  function resetDeltaBeforeAnim(element, index) {
    element.boundingRect = element.element.getBoundingClientRect();
    element.windowHeight = window.innerHeight;
    element.deltaScrolling[index] = getDeltaScrolling(element, index);
  };

  function getScrollY(element) {
    if(!element.scrollableElement) return window.scrollY;
    return element.scrollableElement.scrollTop;
  }

  window.ScrollFx = ScrollFx;

  var scrollFx = document.getElementsByClassName('js-scroll-fx');
  for(var i = 0; i < scrollFx.length; i++) {
    (function(i){
      var scrollableElement = scrollFx[i].getAttribute('data-scrollable-element');
      new ScrollFx(scrollFx[i], scrollableElement);
    })(i);
  }
}());
// File#: _1_skip-link
// Usage: codyhouse.co/license
(function() {
  function initSkipLinkEvents(skipLink) {
    // toggle class skip-link--focus if link is in focus/loses focus
    skipLink.addEventListener('focusin', function(){
      Util.addClass(skipLink, 'skip-link--focus');
    });
    skipLink.addEventListener('focusout', function(){
      Util.removeClass(skipLink, 'skip-link--focus');
    });
  };

  var skipLinks = document.getElementsByClassName('skip-link');
	if( skipLinks.length > 0 ) {
		for( var i = 0; i < skipLinks.length; i++) {
			initSkipLinkEvents(skipLinks[i]);
		}
  }
}());
// File#: _1_smooth-scrolling
// Usage: codyhouse.co/license
(function() {
	var SmoothScroll = function(element) {
		if(!('CSS' in window) || !CSS.supports('color', 'var(--color-var)')) return;
		this.element = element;
		this.scrollDuration = parseInt(this.element.getAttribute('data-duration')) || 300;
		this.dataElementY = this.element.getAttribute('data-scrollable-element-y') || this.element.getAttribute('data-scrollable-element') || this.element.getAttribute('data-element');
		this.scrollElementY = this.dataElementY ? document.querySelector(this.dataElementY) : window;
		this.dataElementX = this.element.getAttribute('data-scrollable-element-x');
		this.scrollElementX = this.dataElementY ? document.querySelector(this.dataElementX) : window;
		this.initScroll();
	};

	SmoothScroll.prototype.initScroll = function() {
		var self = this;

		//detect click on link
		this.element.addEventListener('click', function(event){
			event.preventDefault();
			var targetId = event.target.closest('.js-smooth-scroll').getAttribute('href').replace('#', ''),
				target = document.getElementById(targetId),
				targetTabIndex = target.getAttribute('tabindex'),
				windowScrollTop = self.scrollElementY.scrollTop || document.documentElement.scrollTop;

			// scroll vertically
			if(!self.dataElementY) windowScrollTop = window.scrollY || document.documentElement.scrollTop;

			var scrollElementY = self.dataElementY ? self.scrollElementY : false;

			var fixedHeight = self.getFixedElementHeight(); // check if there's a fixed element on the page
			Util.scrollTo(target.getBoundingClientRect().top + windowScrollTop - fixedHeight, self.scrollDuration, function() {
				// scroll horizontally
				self.scrollHorizontally(target, fixedHeight);
				//move the focus to the target element - don't break keyboard navigation
				Util.moveFocus(target);
				history.pushState(false, false, '#'+targetId);
				self.resetTarget(target, targetTabIndex);
			}, scrollElementY);
		});
	};

	SmoothScroll.prototype.scrollHorizontally = function(target, delta) {
    var scrollEl = this.dataElementX ? this.scrollElementX : false;
    var windowScrollLeft = this.scrollElementX ? this.scrollElementX.scrollLeft : document.documentElement.scrollLeft;
    var final = target.getBoundingClientRect().left + windowScrollLeft - delta,
      duration = this.scrollDuration;

    var element = scrollEl || window;
    var start = element.scrollLeft || document.documentElement.scrollLeft,
      currentTime = null;

    if(!scrollEl) start = window.scrollX || document.documentElement.scrollLeft;
		// return if there's no need to scroll
    if(Math.abs(start - final) < 5) return;
        
    var animateScroll = function(timestamp){
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var val = Math.easeInOutQuad(progress, start, final-start, duration);
      element.scrollTo({
				left: val,
			});
      if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

	SmoothScroll.prototype.resetTarget = function(target, tabindex) {
		if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}	
	};

	SmoothScroll.prototype.getFixedElementHeight = function() {
		var scrollElementY = this.dataElementY ? this.scrollElementY : document.documentElement;
    var fixedElementDelta = parseInt(getComputedStyle(scrollElementY).getPropertyValue('scroll-padding'));
		if(isNaN(fixedElementDelta) ) { // scroll-padding not supported
			fixedElementDelta = 0;
			var fixedElement = document.querySelector(this.element.getAttribute('data-fixed-element'));
			if(fixedElement) fixedElementDelta = parseInt(fixedElement.getBoundingClientRect().height);
		}
		return fixedElementDelta;
	};
	
	//initialize the Smooth Scroll objects
	var smoothScrollLinks = document.getElementsByClassName('js-smooth-scroll');
	if( smoothScrollLinks.length > 0 && !Util.cssSupports('scroll-behavior', 'smooth') && window.requestAnimationFrame) {
		// you need javascript only if css scroll-behavior is not supported
		for( var i = 0; i < smoothScrollLinks.length; i++) {
			(function(i){new SmoothScroll(smoothScrollLinks[i]);})(i);
		}
	}
}());
// File#: _1_social-sharing
// Usage: codyhouse.co/license
(function() {
  function initSocialShare(button) {
    button.addEventListener('click', function(event){
      event.preventDefault();
      var social = button.getAttribute('data-social');
      var url = getSocialUrl(button, social);
      (social == 'mail')
        ? window.location.href = url
        : window.open(url, social+'-share-dialog', 'width=626,height=436');
    });
  };

  function getSocialUrl(button, social) {
    var params = getSocialParams(social);
    var newUrl = '';
    for(var i = 0; i < params.length; i++) {
      var paramValue = button.getAttribute('data-'+params[i]);
      if(params[i] == 'hashtags') paramValue = encodeURI(paramValue.replace(/\#| /g, ''));
      if(paramValue) {
        (social == 'facebook') 
          ? newUrl = newUrl + 'u='+encodeURIComponent(paramValue)+'&'
          : newUrl = newUrl + params[i]+'='+encodeURIComponent(paramValue)+'&';
      }
    }
    if(social == 'linkedin') newUrl = 'mini=true&'+newUrl;
    return button.getAttribute('href')+'?'+newUrl;
  };

  function getSocialParams(social) {
    var params = [];
    switch (social) {
      case 'twitter':
        params = ['text', 'hashtags'];
        break;
      case 'facebook':
      case 'linkedin':
        params = ['url'];
        break;
      case 'pinterest':
        params = ['url', 'media', 'description'];
        break;
      case 'mail':
        params = ['subject', 'body'];
        break;
    }
    return params;
  };

  var socialShare = document.getElementsByClassName('js-social-share');
  if(socialShare.length > 0) {
    for( var i = 0; i < socialShare.length; i++) {
      (function(i){initSocialShare(socialShare[i])})(i);
    }
  }
}());
// File#: _1_stacking-cards
// Usage: codyhouse.co/license
(function() {
  var StackCards = function(element) {
    this.element = element;
    this.items = this.element.getElementsByClassName('js-stack-cards__item');
    this.scrollingFn = false;
    this.scrolling = false;
    initStackCardsEffect(this); 
    initStackCardsResize(this); 
  };

  function initStackCardsEffect(element) { // use Intersection Observer to trigger animation
    setStackCards(element); // store cards CSS properties
		var observer = new IntersectionObserver(stackCardsCallback.bind(element), { threshold: [0, 1] });
		observer.observe(element.element);
  };

  function initStackCardsResize(element) { // detect resize to reset gallery
    element.element.addEventListener('resize-stack-cards', function(){
      setStackCards(element);
      animateStackCards.bind(element);
    });
  };
  
  function stackCardsCallback(entries) { // Intersection Observer callback
    if(entries[0].isIntersecting) {
      if(this.scrollingFn) return; // listener for scroll event already added
      stackCardsInitEvent(this);
    } else {
      if(!this.scrollingFn) return; // listener for scroll event already removed
      window.removeEventListener('scroll', this.scrollingFn);
      this.scrollingFn = false;
    }
  };
  
  function stackCardsInitEvent(element) {
    element.scrollingFn = stackCardsScrolling.bind(element);
    window.addEventListener('scroll', element.scrollingFn);
  };

  function stackCardsScrolling() {
    if(this.scrolling) return;
    this.scrolling = true;
    window.requestAnimationFrame(animateStackCards.bind(this));
  };

  function setStackCards(element) {
    // store wrapper properties
    element.marginY = getComputedStyle(element.element).getPropertyValue('--stack-cards-gap');
    getIntegerFromProperty(element); // convert element.marginY to integer (px value)
    element.elementHeight = element.element.offsetHeight;

    // store card properties
    var cardStyle = getComputedStyle(element.items[0]);
    element.cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue('top')));
    element.cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue('height')));

    // store window property
    element.windowHeight = window.innerHeight;

    // reset margin + translate values
    if(isNaN(element.marginY)) {
      element.element.style.paddingBottom = '0px';
    } else {
      element.element.style.paddingBottom = (element.marginY*(element.items.length - 1))+'px';
    }

    for(var i = 0; i < element.items.length; i++) {
      if(isNaN(element.marginY)) {
        element.items[i].style.transform = 'none;';
      } else {
        element.items[i].style.transform = 'translateY('+element.marginY*i+'px)';
      }
    }
  };

  function getIntegerFromProperty(element) {
    var node = document.createElement('div');
    node.setAttribute('style', 'opacity:0; visbility: hidden;position: absolute; height:'+element.marginY);
    element.element.appendChild(node);
    element.marginY = parseInt(getComputedStyle(node).getPropertyValue('height'));
    element.element.removeChild(node);
  };

  function animateStackCards() {
    if(isNaN(this.marginY)) { // --stack-cards-gap not defined - do not trigger the effect
      this.scrolling = false;
      return; 
    }

    var top = this.element.getBoundingClientRect().top;

    if( this.cardTop - top + this.element.windowHeight - this.elementHeight - this.cardHeight + this.marginY + this.marginY*this.items.length > 0) { 
      this.scrolling = false;
      return;
    }

    for(var i = 0; i < this.items.length; i++) { // use only scale
      var scrolling = this.cardTop - top - i*(this.cardHeight+this.marginY);
      if(scrolling > 0) {  
        var scaling = i == this.items.length - 1 ? 1 : (this.cardHeight - scrolling*0.05)/this.cardHeight;
        this.items[i].style.transform = 'translateY('+this.marginY*i+'px) scale('+scaling+')';
      } else {
        this.items[i].style.transform = 'translateY('+this.marginY*i+'px)';
      }
    }

    this.scrolling = false;
  };

  // initialize StackCards object
  var stackCards = document.getElementsByClassName('js-stack-cards'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
    
	if(stackCards.length > 0 && intersectionObserverSupported && !reducedMotion) { 
    var stackCardsArray = [];
		for(var i = 0; i < stackCards.length; i++) {
			(function(i){
        stackCardsArray.push(new StackCards(stackCards[i]));
      })(i);
    }
    
    var resizingId = false,
      customEvent = new CustomEvent('resize-stack-cards');
    
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function doneResizing() {
      for( var i = 0; i < stackCardsArray.length; i++) {
        (function(i){stackCardsArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
	}
}());
// File#: _1_sticky-banner
// Usage: codyhouse.co/license
(function() {
  var StickyBanner = function(element) {
    this.element = element;
    this.offsetIn = 0;
    this.offsetOut = 0;
    this.targetIn = this.element.getAttribute('data-target-in') ? document.querySelector(this.element.getAttribute('data-target-in')) : false;
    this.targetOut = this.element.getAttribute('data-target-out') ? document.querySelector(this.element.getAttribute('data-target-out')) : false;
    this.reset = 0;
    // check if the window is the scrollable element
    this.dataElement = this.element.getAttribute('data-element');
    this.scrollElement = this.dataElement ? document.querySelector(this.dataElement) : window;
    this.scrollingId = false;
    getBannerOffsets(this);
    initBanner(this);
  };

  function getBannerOffsets(element) { // get offset in and offset out values
    // update offsetIn
    element.offsetIn = 0;
    var windowTop = getScrollTop(element);

    if(element.targetIn) {
      var boundingClientRect = element.targetIn.getBoundingClientRect();
      element.offsetIn = boundingClientRect.top + windowTop + boundingClientRect.height;
    }
    var dataOffsetIn = element.element.getAttribute('data-offset-in');
    if(dataOffsetIn) {
      element.offsetIn = element.offsetIn + parseInt(dataOffsetIn);
    }
    // update offsetOut
    element.offsetOut = 0;
    if(element.targetOut) {
      var boundingClientRect = element.targetOut.getBoundingClientRect();
      element.offsetOut = boundingClientRect.top + windowTop - window.innerHeight;
    }
    var dataOffsetOut = element.element.getAttribute('data-offset-out');
    if(dataOffsetOut) {
      element.offsetOut = element.offsetOut + parseInt(dataOffsetOut);
    }
  };

  function initBanner(element) {
    resetBannerVisibility(element);

    element.element.addEventListener('resize-banner', function(){
      getBannerOffsets(element);
      resetBannerVisibility(element);
    });

    element.element.addEventListener('scroll-banner', function(){
      if(element.reset < 10) {
        getBannerOffsets(element);
        element.reset = element.reset + 1;
      }
      resetBannerVisibility(element);
    });

    if(element.dataElement && element.scrollElement) {
      // the scrollable element is different from the window - detect the scrolling
      element.scrollElement.addEventListener('scroll', function(event){
        if(element.scrollingId) return;
        element.scrollingId = true;
        window.requestAnimationFrame(function(){
          element.element.dispatchEvent(new CustomEvent('scroll-banner'));
          element.scrollingId = false;
        })
      });
    }
  };

  function resetBannerVisibility(element) {
    var scrollTop = getScrollTop(element),
      topTarget = false,
      bottomTarget = false;
    if(element.offsetIn < scrollTop) {
      topTarget = true;
    }
    if(element.offsetOut == 0 || scrollTop < element.offsetOut) {
      bottomTarget = true;
    }

    Util.toggleClass(element.element, 'sticky-banner--visible', bottomTarget && topTarget);
  };

  function getScrollTop(element) {
    // the scrollable element could be different from the window element
    var windowTop = element.scrollElement.scrollTop || document.documentElement.scrollTop;
    if(!element.dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
    return windowTop;
  };

  //initialize the Sticky Banner objects
	var stckyBanner = document.getElementsByClassName('js-sticky-banner');
	if( stckyBanner.length > 0 ) {
		for( var i = 0; i < stckyBanner.length; i++) {
			(function(i){new StickyBanner(stckyBanner[i]);})(i);
    }
    
    // init scroll/resize
    var resizingId = false,
      scrollingId = false,
      resizeEvent = new CustomEvent('resize-banner'),
      scrollEvent = new CustomEvent('scroll-banner');
    
    window.addEventListener('resize', function(event){
      clearTimeout(resizingId);
      resizingId = setTimeout(function(){
        doneResizing(resizeEvent);
      }, 300);
    });

    window.addEventListener('scroll', function(event){
      if(scrollingId) return;
      scrollingId = true;
      window.requestAnimationFrame 
        ? window.requestAnimationFrame(function(){
          doneResizing(scrollEvent);
          scrollingId = false;
        })
        : setTimeout(function(){
          doneResizing(scrollEvent);
          scrollingId = false;
        }, 200);

      resizingId = setTimeout(function(){
        doneResizing(resizeEvent);
      }, 300);
    });

    function doneResizing(event) {
      for( var i = 0; i < stckyBanner.length; i++) {
        (function(i){stckyBanner[i].dispatchEvent(event)})(i);
      };
    };
	}
}());
// File#: _1_sticky-hero
// Usage: codyhouse.co/license
(function() {
	var StickyBackground = function(element) {
		this.element = element;
		this.scrollingElement = this.element.getElementsByClassName('sticky-hero__content')[0];
		this.nextElement = this.element.nextElementSibling;
		this.scrollingTreshold = 0;
		this.nextTreshold = 0;
		initStickyEffect(this);
	};

	function initStickyEffect(element) {
		var observer = new IntersectionObserver(stickyCallback.bind(element), { threshold: [0, 0.1, 1] });
		observer.observe(element.scrollingElement);
		if(element.nextElement) observer.observe(element.nextElement);
	};

	function stickyCallback(entries, observer) {
		var threshold = entries[0].intersectionRatio.toFixed(1);
		(entries[0].target ==  this.scrollingElement)
			? this.scrollingTreshold = threshold
			: this.nextTreshold = threshold;

		Util.toggleClass(this.element, 'sticky-hero--media-is-fixed', (this.nextTreshold > 0 || this.scrollingTreshold > 0));
	};


	var stickyBackground = document.getElementsByClassName('js-sticky-hero'),
		intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(stickyBackground.length > 0 && intersectionObserverSupported) { // if IntersectionObserver is not supported, animations won't be triggeres
		for(var i = 0; i < stickyBackground.length; i++) {
			(function(i){ // if animations are enabled -> init the StickyBackground object
        if( Util.hasClass(stickyBackground[i], 'sticky-hero--overlay-layer') || Util.hasClass(stickyBackground[i], 'sticky-hero--scale')) new StickyBackground(stickyBackground[i]);
      })(i);
		}
	}
}());
// File#: _1_swipe-content
(function() {
	var SwipeContent = function(element) {
		this.element = element;
		this.delta = [false, false];
		this.dragging = false;
		this.intervalId = false;
		initSwipeContent(this);
	};

	function initSwipeContent(content) {
		content.element.addEventListener('mousedown', handleEvent.bind(content));
		content.element.addEventListener('touchstart', handleEvent.bind(content));
	};

	function initDragging(content) {
		//add event listeners
		content.element.addEventListener('mousemove', handleEvent.bind(content));
		content.element.addEventListener('touchmove', handleEvent.bind(content));
		content.element.addEventListener('mouseup', handleEvent.bind(content));
		content.element.addEventListener('mouseleave', handleEvent.bind(content));
		content.element.addEventListener('touchend', handleEvent.bind(content));
	};

	function cancelDragging(content) {
		//remove event listeners
		if(content.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
			content.intervalId = false;
		}
		content.element.removeEventListener('mousemove', handleEvent.bind(content));
		content.element.removeEventListener('touchmove', handleEvent.bind(content));
		content.element.removeEventListener('mouseup', handleEvent.bind(content));
		content.element.removeEventListener('mouseleave', handleEvent.bind(content));
		content.element.removeEventListener('touchend', handleEvent.bind(content));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'mousedown':
			case 'touchstart':
				startDrag(this, event);
				break;
			case 'mousemove':
			case 'touchmove':
				drag(this, event);
				break;
			case 'mouseup':
			case 'mouseleave':
			case 'touchend':
				endDrag(this, event);
				break;
		}
	};

	function startDrag(content, event) {
		content.dragging = true;
		// listen to drag movements
		initDragging(content);
		content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
		// emit drag start event
		emitSwipeEvents(content, 'dragStart', content.delta, event.target);
	};

	function endDrag(content, event) {
		cancelDragging(content);
		// credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
		var dx = parseInt(unify(event).clientX), 
	    dy = parseInt(unify(event).clientY);
	  
	  // check if there was a left/right swipe
		if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
	    var s = getSign(dx - content.delta[0]);
			
			if(Math.abs(dx - content.delta[0]) > 30) {
				(s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
			}
	    
	    content.delta[0] = false;
	  }
		// check if there was a top/bottom swipe
	  if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
	  	var y = getSign(dy - content.delta[1]);

	  	if(Math.abs(dy - content.delta[1]) > 30) {
	    	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
	    }

	    content.delta[1] = false;
	  }
		// emit drag end event
	  emitSwipeEvents(content, 'dragEnd', [dx, dy]);
	  content.dragging = false;
	};

	function drag(content, event) {
		if(!content.dragging) return;
		// emit dragging event with coordinates
		(!window.requestAnimationFrame) 
			? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
			: content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
	};

	function emitDrag(event) {
		emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
	};

	function unify(event) { 
		// unify mouse and touch events
		return event.changedTouches ? event.changedTouches[0] : event; 
	};

	function emitSwipeEvents(content, eventName, detail, el) {
		var trigger = false;
		if(el) trigger = el;
		// emit event with coordinates
		var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
		content.element.dispatchEvent(event);
	};

	function getSign(x) {
		if(!Math.sign) {
			return ((x > 0) - (x < 0)) || +x;
		} else {
			return Math.sign(x);
		}
	};

	window.SwipeContent = SwipeContent;
	
	//initialize the SwipeContent objects
	var swipe = document.getElementsByClassName('js-swipe-content');
	if( swipe.length > 0 ) {
		for( var i = 0; i < swipe.length; i++) {
			(function(i){new SwipeContent(swipe[i]);})(i);
		}
	}
}());
// File#: _1_switch-icon
// Usage: codyhouse.co/license
(function() {
	var switchIcons = document.getElementsByClassName('js-switch-icon');
	if( switchIcons.length > 0 ) {
		for(var i = 0; i < switchIcons.length; i++) {(function(i){
			if( !Util.hasClass(switchIcons[i], 'switch-icon--hover') ) initswitchIcons(switchIcons[i]);
		})(i);}

		function initswitchIcons(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'switch-icon--state-b');
				Util.toggleClass(btn, 'switch-icon--state-b', status);
				// emit custom event
				var event = new CustomEvent('switch-icon-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_table
// Usage: codyhouse.co/license
(function() {
  function initTable(table) {
    checkTableLayour(table); // switch from a collapsed to an expanded layout
    Util.addClass(table, 'table--loaded'); // show table

    // custom event emitted when window is resized
    table.addEventListener('update-table', function(event){
      checkTableLayour(table);
    });
  };

  function checkTableLayour(table) {
    var layout = getComputedStyle(table, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table, tableExpandedLayoutClass, layout != 'collapsed');
  };

  var tables = document.getElementsByClassName('js-table'),
    tableExpandedLayoutClass = 'table--expanded';
  if( tables.length > 0 ) {
    var j = 0;
    for( var i = 0; i < tables.length; i++) {
      var beforeContent = getComputedStyle(tables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){initTable(tables[i]);})(i);
        j = j + 1;
      } else {
        Util.addClass(tables[i], 'table--loaded');
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-table');
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < tables.length; i++) {
          (function(i){tables[i].dispatchEvent(customEvent)})(i);
        };
      };

      (window.requestAnimationFrame) // init table layout
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
  }
}());
// File#: _1_ticker
// Usage: codyhouse.co/license
(function() {
  var Ticker = function(element) {
    this.element = element;
    this.list = this.element.getElementsByTagName('ul')[0];
    this.items = this.list.children;
    this.paused = false;
    // clones info
    this.clones = this.list.innerHTML;
    this.clonesNumber = 1;
    this.itemsLength = this.items.length;
    // animation duration
    this.animationDuration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ticker-animation-duration'));
    initTicker(this);
  };

  function initTicker(ticker) {
    // clone ticker children
    setTickerWidth(ticker);
    cloneItems(ticker);
    initAnimation(ticker);

    // resize/font loaded event
    ticker.element.addEventListener('update-ticker', function(event){
      setTickerWidth(ticker);
      cloneItems(ticker);
    });

    // click on control button events
    ticker.element.addEventListener('anim-ticker', function(event){
      ticker.paused = false;
      Util.removeClass(ticker.element, 'ticker--paused');
    });

    ticker.element.addEventListener('pause-ticker', function(event){
      ticker.paused = true;
      Util.addClass(ticker.element, 'ticker--paused');
    });

    // all set
    Util.addClass(ticker.element, 'ticker--loaded');
  };

  function setTickerWidth(ticker) {
    var width = 0;
    for(var i = 0; i < ticker.itemsLength; i++) {
      width = width + getItemWidth(ticker.items[i]);
    }
    // check if we need to update the number of clones
    if(width < window.innerWidth) {
      ticker.clonesNumber = Math.ceil(window.innerWidth/width) * 2 - 1;
    } else {
      ticker.clonesNumber = 1;
    }

    // update list width
    ticker.list.style.width = ((ticker.clonesNumber + 1)*width)+'px';
  };

  function getItemWidth(item) {
    var style = window.getComputedStyle(item);
    return parseFloat(style.marginRight) + parseFloat(style.marginLeft) + item.offsetWidth;
  };

  function cloneItems(ticker) {
    ticker.list.innerHTML = ticker.clones;
    for(var i = 0; i < ticker.clonesNumber; i++) {
      ticker.list.insertAdjacentHTML('beforeend', ticker.clones);
    }
    // update animation duration
    ticker.element.style.setProperty('--ticker-animation-duration', ticker.animationDuration*(ticker.clonesNumber+1)+'s');
  };

  function initAnimation(ticker) {
    // init observer - animate ticker only when in viewport
    var observer = new IntersectionObserver(tickerObserve.bind(ticker));
    observer.observe(ticker.element);
    
  };

  function tickerObserve(entries) {
    if(entries[0].isIntersecting) {
      if(!this.paused) Util.addClass(this.element, 'ticker--animate');
    } else {
      Util.removeClass(this.element, 'ticker--animate');
    }
  };

  function initTickerController(controller) {
    // play/pause btn controller
    var tickerContainer = document.getElementById(controller.getAttribute('aria-controls'));
    if(!tickerContainer) return;
    var tickerList = tickerContainer.getElementsByClassName('js-ticker');
    if(tickerList.length < 1) tickerList = [tickerContainer];
    // detect click
    controller.addEventListener('click', function(event){
      var playAnimation = controller.getAttribute('aria-pressed') == 'true';
      var animEvent = playAnimation ? 'anim-ticker' : 'pause-ticker';
      playAnimation ? controller.setAttribute('aria-pressed', 'false') : controller.setAttribute('aria-pressed', 'true');
      for(var i = 0; i < tickerList.length; i++) {
        tickerList[i].dispatchEvent(new CustomEvent(animEvent));
      }
    });
  };

  //initialize the Ticker objects
  var tickers = document.getElementsByClassName('js-ticker'),
    requestAnimationFrameSupported = window.requestAnimationFrame,
    reducedMotion = Util.osHasReducedMotion(),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);

	if( tickers.length > 0 ) {
    var tickersArray = [];
		for( var i = 0; i < tickers.length; i++) {
      if(!requestAnimationFrameSupported || reducedMotion || !intersectionObserverSupported) {
        // animation is off if requestAnimationFrame/IntersectionObserver is not supported or reduced motion is on
        Util.addClass(tickers[i], 'ticker--anim-off');
      } else {(function(i){tickersArray.push(new Ticker(tickers[i]));})(i);}
    }

    if(tickersArray.length > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-ticker');
      
      // on resize -> update ticker width 
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });

      // wait for font to be loaded -> update ticker width
      if(document.fonts) {
        document.fonts.onloadingdone = function (fontFaceSetEvent) {
          doneResizing();
        };
      }

      function doneResizing() {
        for( var i = 0; i < tickersArray.length; i++) {
          (function(i){tickersArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };

      // ticker play/pause buttons
      var tickerControl = document.getElementsByClassName('js-ticker-control');
      if(tickerControl.length > 0) {
        for( var i = 0; i < tickerControl.length; i++) {
          if(!requestAnimationFrameSupported || reducedMotion || !intersectionObserverSupported) {
            Util.addClass(tickerControl[i], 'is-hidden');
          } else {
            (function(i){initTickerController(tickerControl[i]);})(i);
          } 
        }
      }
    };
  }
}());
// File#: _1_tilted-img-slideshow
// Usage: codyhouse.co/license
(function() {
  var TiltedSlideshow = function(element) {
    this.element = element;
    this.list = this.element.getElementsByClassName('js-tilted-slideshow__list')[0];
    this.images = this.list.getElementsByClassName('js-tilted-slideshow__item');
    this.selectedIndex = 0;
    this.animating = false;
    // classes
    this.orderClasses = ['tilted-slideshow__item--top', 'tilted-slideshow__item--middle', 'tilted-slideshow__item--bottom'];
    this.moveClasses = ['tilted-slideshow__item--move-out', 'tilted-slideshow__item--move-in'];
    this.interactedClass = 'tilted-slideshow--interacted';
    initTiltedSlideshow(this);
  };

  function initTiltedSlideshow(slideshow) {
    if(!animateImgs) removeTransitions(slideshow);
    
    slideshow.list.addEventListener('click', function(event) {
      Util.addClass(slideshow.element, slideshow.interactedClass);
      animateImgs ? animateImages(slideshow) : switchImages(slideshow);
    });
  };

  function removeTransitions(slideshow) {
    // if reduced motion is on or css variables are not supported -> do not animate images
    for(var i = 0; i < slideshow.images.length; i++) {
      slideshow.images[i].style.transition = 'none';
    }
  };

  function switchImages(slideshow) {
    // if reduced motion is on or css variables are not supported -> switch images without animation
    resetOrderClasses(slideshow);
    resetSelectedIndex(slideshow);
  };

  function resetSelectedIndex(slideshow) {
    // update the index of the top image
    slideshow.selectedIndex = resetIndex(slideshow, slideshow.selectedIndex + 1);
  };

  function resetIndex(slideshow, index) {
    // make sure index is < 3
    if(index >= slideshow.images.length) index = index - slideshow.images.length;
    return index;
  };

  function resetOrderClasses(slideshow) {
    // update the orderClasses for each images
    if(!animateImgs) {
      // top image -> remove top class and add bottom class
      Util.addClass(slideshow.images[slideshow.selectedIndex], slideshow.orderClasses[2]);
      Util.removeClass(slideshow.images[slideshow.selectedIndex], slideshow.orderClasses[0]);
    }

    // middle image -> remove middle class and add top class
    var middleImage = slideshow.images[resetIndex(slideshow, slideshow.selectedIndex + 1)];
    Util.addClass(middleImage, slideshow.orderClasses[0]);
    Util.removeClass(middleImage, slideshow.orderClasses[1]);

    // bottom image -> remove bottom class and add middle class
    var bottomImage = slideshow.images[resetIndex(slideshow, slideshow.selectedIndex + 2)];
    Util.addClass(bottomImage, slideshow.orderClasses[1]);
    Util.removeClass(bottomImage, slideshow.orderClasses[2]);
  };

  function animateImages(slideshow) {
    if(slideshow.animating) return;
    slideshow.animating = true;

    // reset order classes for middle/bottom images
    resetOrderClasses(slideshow);
    
    // animate top image
    var topImage = slideshow.images[slideshow.selectedIndex];
    // remove top class and add move out class
    Util.removeClass(topImage, slideshow.orderClasses[0]);
    Util.addClass(topImage, slideshow.moveClasses[0]);
    
    topImage.addEventListener('transitionend', function cb(event) {
      // remove transition
			topImage.style.transition = 'none';
			topImage.removeEventListener("transitionend", cb);
      
      setTimeout(function(){
        // add bottom + move-in class, remove move-out class
        Util.removeClass(topImage, slideshow.moveClasses[0]);
        Util.addClass(topImage, slideshow.moveClasses[1]+' '+ slideshow.orderClasses[2]);
        setTimeout(function(){
          topImage.style.transition = '';
          // remove move-in class
          Util.removeClass(topImage, slideshow.moveClasses[1]);
          topImage.addEventListener('transitionend', function cbn(event) {
            // reset animating property and selectedIndex index
            resetSelectedIndex(slideshow);
            slideshow.animating = false;
            topImage.removeEventListener("transitionend", cbn);
          });
        }, 10);
      }, 10);
		});
  };

  var tiltedSlideshow = document.getElementsByClassName('js-tilted-slideshow'),
    animateImgs = !Util.osHasReducedMotion() && ('CSS' in window) && CSS.supports('color', 'var(--color-var)');
  if(tiltedSlideshow.length > 0) {
    for(var i = 0; i < tiltedSlideshow.length; i++) {
      new TiltedSlideshow(tiltedSlideshow[i]);
    }
  }
}());
// File#: _1_toast
// Usage: codyhouse.co/license
(function() {
  var Toasts = function() {
    this.toastsEl = document.getElementsByClassName('js-toast');
    this.toastsId = getRandomInt(0, 1000);
    this.index = 0;
    this.closingToast = false;
    initToasts(this);
  };

  // public method to initialize new toast elements
  Toasts.prototype.initToast = function(element) {
		initSingleToast(this, element);
	};

  function initToasts(obj) {
    // create a wrapper element for each toast variation
    createWrapper(obj, 'top-right');
    createWrapper(obj, 'top-left');
    createWrapper(obj, 'top-center');
    createWrapper(obj, 'bottom-right');
    createWrapper(obj, 'bottom-left');
    createWrapper(obj, 'bottom-center');

    // init single toast element
    for(var i = 0; i < obj.toastsEl.length; i++) {
      initSingleToast(obj, obj.toastsEl[i]);
    }

    // listen for dynamic toast creation
    window.addEventListener('newToast', function(event) {
      initSingleToast(obj, event.detail);
    });
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  };

  function createWrapper(obj, position) {
    var classes = 'top-0 left-0 flex-column';
    if(position == 'top-right') classes = 'top-0 right-0 flex-column';
    if(position == 'top-center') classes = 'top-0 left-50% -translate-x-50% flex-column items-center';
    if(position == 'bottom-right') classes = 'bottom-0 right-0 flex-column-reverse';
    if(position == 'bottom-left') classes = 'bottom-0 left-0 flex-column-reverse';
    if(position == 'bottom-center') classes = 'bottom-0 left-50% -translate-x-50% flex-column-reverse items-center';

    var div = '<div class="toast-wrapper position-fixed flex '+classes+'" id="toast-wrapper-'+position+'"></div>';
    document.body.insertAdjacentHTML('beforeend', div);
    obj[position] = document.getElementById('toast-wrapper-'+position);
  };

  function initSingleToast(obj, toast) {
    var id = 'toast-'+obj.toastsId+'-'+obj.index;
    obj.index = obj.index + 1;
    // store toast info in the Toasts obj
    obj[id] = {};
    obj[id]['interval'] = toast.getAttribute('data-toast-interval') || 5000,
    obj[id]['intervalId'] = false;
    obj[id]['closing'] = false;
    // get position type
    var classes = toast.getAttribute('class');
    obj[id]['position'] = 'top-right';
    if(classes.indexOf('toast--top-left') > -1) obj[id]['position'] = 'top-left';
    if(classes.indexOf('toast--top-center') > -1) obj[id]['position'] = 'top-center';
    if(classes.indexOf('toast--bottom-right') > -1) obj[id]['position'] = 'bottom-right';
    if(classes.indexOf('toast--bottom-left') > -1) obj[id]['position'] = 'bottom-left'; 
    if(classes.indexOf('toast--bottom-center') > -1) obj[id]['position'] = 'bottom-center';

    // listen for custom open event
    toast.addEventListener('openToast', function() {
      if(!Util.hasClass(toast, 'toast--hidden') || obj[id]['closing']) return;
      openToast(obj, toast, id);
    });

    // close toast
    toast.addEventListener('click', function(event){
      if(event.target.closest('.js-toast__close-btn')) {
        obj.closingToast = true;
        closeToast(obj, toast, id);
      }
    });
  };

  function openToast(obj, toast, id) {
    if(obj[id]['intervalId']) {
      clearInterval(obj[id]['intervalId']);
      obj[id]['intervalId'] = false;
    }
    // place toast - insert in the proper container
    var fragment = document.createDocumentFragment();
    fragment.appendChild(toast);
    obj[obj[id]['position']].appendChild(fragment);

    // change position
    toast.style.position = 'static';

    // show toast
    setTimeout(function() {
      Util.removeClass(toast, 'toast--hidden');
    });
    
    // automatically close after a time interval
    if(obj[id]['interval'] && parseInt(obj[id]['interval']) > 0) {
      setToastInterval(obj, toast, id, obj[id]['interval']);
    }
  };

  function setToastInterval(obj, toast, id, interval) {
    obj[id]['intervalId'] = setTimeout(function(){
      if(obj.closingToast) return setToastInterval(obj, toast, id, 1000);
      closeToast(obj, toast, id);
    }, interval);
  };

  function closeToast(obj, toast, id) {
    obj[id]['closing'] = true;
    Util.addClass(toast, 'toast--hidden');
    // clear timeout
    if(obj[id]['intervalId']) clearTimeout(obj[id]['intervalId']);
    // remove toast and animate siblings
    closeToastAnimation(obj, toast, id);    
  };

  function closeToastAnimation(obj, toast, id) {
    // get all next elements 
    var siblings = getToastNextSiblings(toast);
    // get translate value (could be positive or negative based on position)
    var toastStyle = window.getComputedStyle(toast),
      margin = parseInt(toastStyle.getPropertyValue('margin-top')) || parseInt(toastStyle.getPropertyValue('margin-bottom'));
    // translate next elements if any
    var translate = toast.offsetHeight + margin;
    if(obj[id]['position'].indexOf('top') > -1) {
      translate = '-'+translate
    }
    for(var i = 0; i < siblings.length; i++) {
      siblings[i].style.transform = 'translateY('+translate+'px)';
    }
    // remove toast and reset translate
    toast.addEventListener('transitionend', function cb(event){
      if(event.propertyName != 'opacity') return;
      toast.removeEventListener('transitionend', cb);
      removeToast(toast, siblings, obj, id);
      obj.closingToast = false;
    });
  };

  function getToastNextSiblings(toast) {
    var array = [];
    var nextSibling = toast.nextElementSibling;
    if(nextSibling) {
      array.push(nextSibling);
      var nextSiblingsIterate = getToastNextSiblings(nextSibling);
      Array.prototype.push.apply(array, nextSiblingsIterate);
    }
    return array;
  };

  function removeToast(toast, siblings, obj, id) {
    // reset position
    toast.style.position = '';

    // move toast back to body
    var fragment = document.createDocumentFragment();
    fragment.appendChild(toast);
    document.body.appendChild(fragment); 

    // reset siblings translate
    for(var i = 0; i < siblings.length; i++) {
      (function(i){
        // set transition to none
        siblings[i].style.transition = 'none';
        siblings[i].style.transform = '';
        setTimeout(function() {siblings[i].style.transition = '';}, 10);
      })(i);
    }

    // reset closing status
    obj[id]['closing'] = false;
  };

  window.Toasts = Toasts;

	//initialize the Toasts objects
	var toasts = document.getElementsByClassName('js-toast');
	if( toasts.length > 0 ) {
		new Toasts();
	}
}());
// File#: _1_tooltip
// Usage: codyhouse.co/license
(function() {
	var Tooltip = function(element) {
		this.element = element;
		this.tooltip = false;
		this.tooltipIntervalId = false;
		this.tooltipContent = this.element.getAttribute('title');
		this.tooltipPosition = (this.element.getAttribute('data-tooltip-position')) ? this.element.getAttribute('data-tooltip-position') : 'top';
		this.tooltipClasses = (this.element.getAttribute('data-tooltip-class')) ? this.element.getAttribute('data-tooltip-class') : false;
		this.tooltipId = 'js-tooltip-element'; // id of the tooltip element -> trigger will have the same aria-describedby attr
		// there are cases where you only need the aria-label -> SR do not need to read the tooltip content (e.g., footnotes)
		this.tooltipDescription = (this.element.getAttribute('data-tooltip-describedby') && this.element.getAttribute('data-tooltip-describedby') == 'false') ? false : true; 

		this.tooltipDelay = 300; // show tooltip after a delay (in ms)
		this.tooltipDelta = 10; // distance beetwen tooltip and trigger element (in px)
		this.tooltipTriggerHover = false;
		// tooltp sticky option
		this.tooltipSticky = (this.tooltipClasses && this.tooltipClasses.indexOf('tooltip--sticky') > -1);
		this.tooltipHover = false;
		if(this.tooltipSticky) {
			this.tooltipHoverInterval = false;
		}
		resetTooltipContent(this);
		initTooltip(this);
	};

	function resetTooltipContent(tooltip) {
		var htmlContent = tooltip.element.getAttribute('data-tooltip-title');
		if(htmlContent) {
			tooltip.tooltipContent = htmlContent;
		}
	};

	function initTooltip(tooltipObj) {
		// reset trigger element
		tooltipObj.element.removeAttribute('title');
		tooltipObj.element.setAttribute('tabindex', '0');
		// add event listeners
		tooltipObj.element.addEventListener('mouseenter', handleEvent.bind(tooltipObj));
		tooltipObj.element.addEventListener('focus', handleEvent.bind(tooltipObj));
	};

	function removeTooltipEvents(tooltipObj) {
		// remove event listeners
		tooltipObj.element.removeEventListener('mouseleave',  handleEvent.bind(tooltipObj));
		tooltipObj.element.removeEventListener('blur',  handleEvent.bind(tooltipObj));
	};

	function handleEvent(event) {
		// handle events
		switch(event.type) {
			case 'mouseenter':
			case 'focus':
				showTooltip(this, event);
				break;
			case 'mouseleave':
			case 'blur':
				checkTooltip(this);
				break;
		}
	};

	function showTooltip(tooltipObj, event) {
		// tooltip has already been triggered
		if(tooltipObj.tooltipIntervalId) return;
		tooltipObj.tooltipTriggerHover = true;
		// listen to close events
		tooltipObj.element.addEventListener('mouseleave', handleEvent.bind(tooltipObj));
		tooltipObj.element.addEventListener('blur', handleEvent.bind(tooltipObj));
		// show tooltip with a delay
		tooltipObj.tooltipIntervalId = setTimeout(function(){
			createTooltip(tooltipObj);
		}, tooltipObj.tooltipDelay);
	};

	function createTooltip(tooltipObj) {
		tooltipObj.tooltip = document.getElementById(tooltipObj.tooltipId);
		
		if( !tooltipObj.tooltip ) { // tooltip element does not yet exist
			tooltipObj.tooltip = document.createElement('div');
			document.body.appendChild(tooltipObj.tooltip);
		} 
		
		// reset tooltip content/position
		Util.setAttributes(tooltipObj.tooltip, {'id': tooltipObj.tooltipId, 'class': 'tooltip tooltip--is-hidden js-tooltip', 'role': 'tooltip'});
		tooltipObj.tooltip.innerHTML = tooltipObj.tooltipContent;
		if(tooltipObj.tooltipDescription) tooltipObj.element.setAttribute('aria-describedby', tooltipObj.tooltipId);
		if(tooltipObj.tooltipClasses) Util.addClass(tooltipObj.tooltip, tooltipObj.tooltipClasses);
		if(tooltipObj.tooltipSticky) Util.addClass(tooltipObj.tooltip, 'tooltip--sticky');
		placeTooltip(tooltipObj);
		Util.removeClass(tooltipObj.tooltip, 'tooltip--is-hidden');

		// if tooltip is sticky, listen to mouse events
		if(!tooltipObj.tooltipSticky) return;
		tooltipObj.tooltip.addEventListener('mouseenter', function cb(){
			tooltipObj.tooltipHover = true;
			if(tooltipObj.tooltipHoverInterval) {
				clearInterval(tooltipObj.tooltipHoverInterval);
				tooltipObj.tooltipHoverInterval = false;
			}
			tooltipObj.tooltip.removeEventListener('mouseenter', cb);
			tooltipLeaveEvent(tooltipObj);
		});
	};

	function tooltipLeaveEvent(tooltipObj) {
		tooltipObj.tooltip.addEventListener('mouseleave', function cb(){
			tooltipObj.tooltipHover = false;
			tooltipObj.tooltip.removeEventListener('mouseleave', cb);
			hideTooltip(tooltipObj);
		});
	};

	function placeTooltip(tooltipObj) {
		// set top and left position of the tooltip according to the data-tooltip-position attr of the trigger
		var dimention = [tooltipObj.tooltip.offsetHeight, tooltipObj.tooltip.offsetWidth],
			positionTrigger = tooltipObj.element.getBoundingClientRect(),
			position = [],
			scrollY = window.scrollY || window.pageYOffset;
		
		position['top'] = [ (positionTrigger.top - dimention[0] - tooltipObj.tooltipDelta + scrollY), (positionTrigger.right/2 + positionTrigger.left/2 - dimention[1]/2)];
		position['bottom'] = [ (positionTrigger.bottom + tooltipObj.tooltipDelta + scrollY), (positionTrigger.right/2 + positionTrigger.left/2 - dimention[1]/2)];
		position['left'] = [(positionTrigger.top/2 + positionTrigger.bottom/2 - dimention[0]/2 + scrollY), positionTrigger.left - dimention[1] - tooltipObj.tooltipDelta];
		position['right'] = [(positionTrigger.top/2 + positionTrigger.bottom/2 - dimention[0]/2 + scrollY), positionTrigger.right + tooltipObj.tooltipDelta];
		
		var direction = tooltipObj.tooltipPosition;
		if( direction == 'top' && position['top'][0] < scrollY) direction = 'bottom';
		else if( direction == 'bottom' && position['bottom'][0] + tooltipObj.tooltipDelta + dimention[0] > scrollY + window.innerHeight) direction = 'top';
		else if( direction == 'left' && position['left'][1] < 0 )  direction = 'right';
		else if( direction == 'right' && position['right'][1] + dimention[1] > window.innerWidth ) direction = 'left';
		
		if(direction == 'top' || direction == 'bottom') {
			if(position[direction][1] < 0 ) position[direction][1] = 0;
			if(position[direction][1] + dimention[1] > window.innerWidth ) position[direction][1] = window.innerWidth - dimention[1];
		}
		tooltipObj.tooltip.style.top = position[direction][0]+'px';
		tooltipObj.tooltip.style.left = position[direction][1]+'px';
		Util.addClass(tooltipObj.tooltip, 'tooltip--'+direction);
	};

	function checkTooltip(tooltipObj) {
		tooltipObj.tooltipTriggerHover = false;
		if(!tooltipObj.tooltipSticky) hideTooltip(tooltipObj);
		else {
			if(tooltipObj.tooltipHover) return;
			if(tooltipObj.tooltipHoverInterval) return;
			tooltipObj.tooltipHoverInterval = setTimeout(function(){
				hideTooltip(tooltipObj); 
				tooltipObj.tooltipHoverInterval = false;
			}, 300);
		}
	};

	function hideTooltip(tooltipObj) {
		if(tooltipObj.tooltipHover || tooltipObj.tooltipTriggerHover) return;
		clearInterval(tooltipObj.tooltipIntervalId);
		if(tooltipObj.tooltipHoverInterval) {
			clearInterval(tooltipObj.tooltipHoverInterval);
			tooltipObj.tooltipHoverInterval = false;
		}
		tooltipObj.tooltipIntervalId = false;
		if(!tooltipObj.tooltip) return;
		// hide tooltip
		removeTooltip(tooltipObj);
		// remove events
		removeTooltipEvents(tooltipObj);
	};

	function removeTooltip(tooltipObj) {
		if(tooltipObj.tooltipContent == tooltipObj.tooltip.innerHTML) {
			Util.addClass(tooltipObj.tooltip, 'tooltip--is-hidden');
		}
		if(tooltipObj.tooltipDescription) tooltipObj.element.removeAttribute('aria-describedby');
	};

	window.Tooltip = Tooltip;

	//initialize the Tooltip objects
	var tooltips = document.getElementsByClassName('js-tooltip-trigger');
	if( tooltips.length > 0 ) {
		for( var i = 0; i < tooltips.length; i++) {
			(function(i){new Tooltip(tooltips[i]);})(i);
		}
	}
}());
// File#: _1_vertical-timeline
// Usage: codyhouse.co/license
(function() {
	var VTimeline = function(element) {
    this.element = element;
    this.sections = this.element.getElementsByClassName('js-v-timeline__section');
    this.animate = this.element.getAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on' ? true : false;
    this.animationClass = 'v-timeline__section--animate';
    this.animationDelta = '-150px';
    initVTimeline(this);
  };

  function initVTimeline(element) {
    if(!element.animate) return;
    for(var i = 0; i < element.sections.length; i++) {
      var observer = new IntersectionObserver(vTimelineCallback.bind(element, i),
      {rootMargin: "0px 0px "+element.animationDelta+" 0px"});
		  observer.observe(element.sections[i]);
    }
  };

  function vTimelineCallback(index, entries, observer) {
    if(entries[0].isIntersecting) {
      Util.addClass(this.sections[index], this.animationClass);
      observer.unobserve(this.sections[index]);
    } 
  };

  //initialize the VTimeline objects
  var timelines = document.querySelectorAll('.js-v-timeline'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
	if( timelines.length > 0) {
		for( var i = 0; i < timelines.length; i++) {
      if(intersectionObserverSupported && !reducedMotion) (function(i){new VTimeline(timelines[i]);})(i);
      else timelines[i].removeAttribute('data-animation');
		}
	}
}());
// File#: _2_adv-custom-select
// Usage: codyhouse.co/license
(function() {
  var AdvSelect = function(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.optionData = getOptionsData(this);
    this.selectId = this.select.getAttribute('id');
    this.selectLabel = document.querySelector('[for='+this.selectId+']')
    this.trigger = this.element.getElementsByClassName('js-adv-select__control')[0];
    this.triggerLabel = this.trigger.getElementsByClassName('js-adv-select__value')[0];
    this.dropdown = document.getElementById(this.trigger.getAttribute('aria-controls'));

    initAdvSelect(this); // init markup
    initAdvSelectEvents(this); // init event listeners
  };

  function getOptionsData(select) {
    var obj = [],
      dataset = select.options[0].dataset;

    function camelCaseToDash( myStr ) {
      return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }
    for (var prop in dataset) {
      if (Object.prototype.hasOwnProperty.call(dataset, prop)) {
        // obj[prop] = select.dataset[prop];
        obj.push(camelCaseToDash(prop));
      }
    }
    return obj;
  };

  function initAdvSelect(select) {
    // create custom structure
    createAdvStructure(select);
    // update trigger label
    updateTriggerLabel(select);
    // hide native select and show custom structure
    Util.addClass(select.select, 'is-hidden');
    Util.removeClass(select.trigger, 'is-hidden');
    Util.removeClass(select.dropdown, 'is-hidden');
  };

  function initAdvSelectEvents(select) {
    if(select.selectLabel) {
      // move focus to custom trigger when clicking on <select> label
      select.selectLabel.addEventListener('click', function(){
        select.trigger.focus();
      });
    }

    // option is selected in dropdown
    select.dropdown.addEventListener('click', function(event){
      triggerSelection(select, event.target);
    });

    // keyboard navigation
    select.dropdown.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      } else if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        triggerSelection(select, document.activeElement);
      }
    });
  };

  function createAdvStructure(select) {
    // store optgroup and option structure
    var optgroup = select.dropdown.querySelector('[role="group"]'),
      option = select.dropdown.querySelector('[role="option"]'),
      optgroupClone = false,
      optgroupLabel = false,
      optionClone = false;
    if(optgroup) {
      optgroupClone = optgroup.cloneNode();
      optgroupLabel = document.getElementById(optgroupClone.getAttribute('describedby'));
    }
    if(option) optionClone = option.cloneNode(true);

    var dropdownCode = '';

    if(select.optGroups.length > 0) {
      for(var i = 0; i < select.optGroups.length; i++) {
        dropdownCode = dropdownCode + getOptGroupCode(select, select.optGroups[i], optgroupClone, optionClone, optgroupLabel, i);
      }
    } else {
      for(var i = 0; i < select.options.length; i++) {
        dropdownCode = dropdownCode + getOptionCode(select, select.options[i], optionClone);
      }
    }

    select.dropdown.innerHTML = dropdownCode;
  };

  function getOptGroupCode(select, optGroup, optGroupClone, optionClone, optgroupLabel, index) {
    if(!optGroupClone || !optionClone) return '';
    var code = '';
    var options = optGroup.getElementsByTagName('option');
    for(var i = 0; i < options.length; i++) {
      code = code + getOptionCode(select, options[i], optionClone);
    }
    if(optgroupLabel) {
      var label = optgroupLabel.cloneNode(true);
      var id = label.getAttribute('id') + '-'+index;
      label.setAttribute('id', id);
      optGroupClone.setAttribute('describedby', id);
      code = label.outerHTML.replace('{optgroup-label}', optGroup.getAttribute('label')) + code;
    } 
    optGroupClone.innerHTML = code;
    return optGroupClone.outerHTML;
  };

  function getOptionCode(select, option, optionClone) {
    optionClone.setAttribute('data-value', option.value);
    if(option.selected) {
      optionClone.setAttribute('aria-selected', 'true');
      optionClone.setAttribute('tabindex', '0');
    } else {
      optionClone.removeAttribute('aria-selected');
      optionClone.removeAttribute('tabindex');
    }
    var optionHtml = optionClone.outerHTML;
    optionHtml = optionHtml.replace('{option-label}', option.text);
    for(var i = 0; i < select.optionData.length; i++) {
      optionHtml = optionHtml.replace('{'+select.optionData[i]+'}', option.getAttribute('data-'+select.optionData[i]));
    }
    return optionHtml;
  };

  function updateTriggerLabel(select) {
    // select.triggerLabel.textContent = select.options[select.select.selectedIndex].text;
    select.triggerLabel.innerHTML = select.dropdown.querySelector('[aria-selected="true"]').innerHTML;
  };

  function triggerSelection(select, target) {
    var option = target.closest('[role="option"]');
    if(!option) return;
    selectOption(select, option);
  };

  function selectOption(select, option) {
    if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
      // selecting the same option
    } else { 
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if(selectedOption) {
        selectedOption.removeAttribute('aria-selected');
        selectedOption.removeAttribute('tabindex');
      }
      option.setAttribute('aria-selected', 'true');
      option.setAttribute('tabindex', '0');
      // new option has been selected -> update native <select> element and trigger label
      updateNativeSelect(select, option.getAttribute('data-value'));
      updateTriggerLabel(select);
    }
    // move focus back to trigger
    setTimeout(function(){
      select.trigger.click();
    });
  };

  function updateNativeSelect(select, selectedValue) {
    var selectedOption = select.select.querySelector('[value="'+selectedValue+'"');
    select.select.selectedIndex = Util.getIndexInArray(select.options, selectedOption);
    select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
  };

  function keyboardCustomSelect(select, direction) {
    var selectedOption = select.select.querySelector('[value="'+document.activeElement.getAttribute('data-value')+'"]');
    if(!selectedOption) return;
    var index = Util.getIndexInArray(select.options, selectedOption);
    
    index = direction == 'next' ? index + 1 : index - 1;
    if(index < 0) return;
    if(index >= select.options.length) return;
    
    var dropdownOption = select.dropdown.querySelector('[data-value="'+select.options[index].getAttribute('value')+'"]');
    if(dropdownOption) Util.moveFocus(dropdownOption);
  };

  //initialize the AdvSelect objects
  var advSelect = document.getElementsByClassName('js-adv-select');
  if( advSelect.length > 0 ) {
    for( var i = 0; i < advSelect.length; i++) {
      (function(i){new AdvSelect(advSelect[i]);})(i);
    }
  }
}());
// File#: _2_date-range
// Usage: codyhouse.co/license
(function() {
  var DateRange = function(opts) {
    this.options = Util.extend(DatePicker.defaults , opts);
    this.element = this.options.element;
    this.inputStart = this.element.getElementsByClassName('js-date-range__text--start')[0]; // visible to SR only
    this.inputEnd = this.element.getElementsByClassName('js-date-range__text--end')[0]; // visible to SR only
    this.trigger = this.element.getElementsByClassName('js-date-range__trigger')[0];
    this.triggerLabel = this.trigger.getAttribute('aria-label');
    this.datePicker = this.element.getElementsByClassName('js-date-picker')[0];
    this.body = this.datePicker.getElementsByClassName('js-date-picker__dates')[0];
    this.navigation = this.datePicker.getElementsByClassName('js-date-picker__month-nav')[0];
    this.heading = this.datePicker.getElementsByClassName('js-date-picker__month-label')[0];
    this.pickerVisible = false;
    // date format
    this.dateIndexes = getDateIndexes(this); // store indexes of date parts (d, m, y)
    // selected date (star/end)
    this.dateSelected = [];
    this.selectedDay = [];
    this.selectedMonth = [];
    this.selectedYear = [];
    // which date needs to be selected
    this.dateToSelect = 0; // o or start date, 1 for end date
    // focus trap
    this.firstFocusable = false;
    this.lastFocusable = false;
    // trigger btn - start/end values
    this.dateValueStartEl = this.element.getElementsByClassName('js-date-range__value--start');
    this.dateValueEndEl = this.element.getElementsByClassName('js-date-range__value--end');
    if(this.dateValueStartEl.length > 0) {
      this.dateValueStartElLabel = this.dateValueStartEl[0].textContent; // initial input value
    }
    if(this.dateValueEndEl.length > 0) {
      this.dateValueEndElLabel = this.dateValueEndEl[0].textContent; // initial input value
    }
    // trigger btn - label
    this.triggerLabelWrapper = this.trigger.getElementsByClassName('js-date-range__trigger-label');
    // custom classes
    this.selectedStartClass= 'date-picker__date--selected js-date-picker__date--range-start'; // does not include the class to remove borders
    this.selectedEndClass= 'date-picker__date--selected date-picker__date--range-end js-date-picker__date--range-end';
    this.inBetweenClass = 'date-picker__date--range';
    this.mouseMoving = false;
    // predefined options - if there's a select element with a list of predefined options
    this.predefOptions = this.element.previousElementSibling;
    initCalendarAria(this);
    resetCalendar(this);
    resetTriggerLabel(this, true);
    initCalendarEvents(this);

    // place picker according to available space
    placeCalendar(this);

    // predefined options
    initPredefinedOptions(this);
  };

  function initCalendarAria(datePicker) {
    // make input elements accessible
    resetInputVisibility(datePicker.inputStart);
    resetInputVisibility(datePicker.inputEnd);
    // create a live region used to announce new month selection to SR + new date selection
    var srLiveReagion = document.createElement('div');
    srLiveReagion.setAttribute('aria-live', 'polite');
    Util.addClass(srLiveReagion, 'sr-only js-date-range__sr-live');
    datePicker.element.appendChild(srLiveReagion);
    datePicker.srLiveReagionM = datePicker.element.getElementsByClassName('js-date-range__sr-live')[0];
  };

  function resetInputVisibility(input) {
    // make sure input elements are accessible to SR but not tabbable
    input.setAttribute('tabindex', '-1');
    var wrapper = input.closest('.js-date-range__input');
    if(wrapper) {
      Util.addClass(wrapper, 'sr-only');
      wrapper.style.display = 'block';
    }
  };

  function initCalendarEvents(datePicker) {
    if(datePicker.trigger) {
      datePicker.trigger.addEventListener('click', function(event){ // open calendar when clicking on calendar button
        event.preventDefault();
        datePicker.pickerVisible = false;
        toggleCalendar(datePicker);
        datePicker.trigger.setAttribute('aria-expanded', 'true');
      });
    }
    // navigate using month nav
    datePicker.navigation.addEventListener('click', function(event){
      event.preventDefault();
      var btn = event.target.closest('.js-date-picker__month-nav-btn');
      if(btn) {
        Util.hasClass(btn, 'js-date-picker__month-nav-btn--prev') ? showPrev(datePicker, true) : showNext(datePicker, true);
      }
    });

    // hide calendar
    window.addEventListener('keydown', function(event){ // close calendar on esc
      if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        if(!datePicker.pickerVisible) return;
        if(document.activeElement. closest('.js-date-picker')) {
          datePicker.trigger.focus(); //if focus is inside the calendar -> move the focus to the input element 
        } 
        hideCalendar(datePicker);
      }
    });
    window.addEventListener('click', function(event){
      if(!event.target.closest('.js-date-picker') && !event.target.closest('.js-date-range__trigger') && datePicker.pickerVisible) {
        hideCalendar(datePicker);
      }
    });

    // navigate through days of calendar
    datePicker.body.addEventListener('keydown', function(event){
      var day = datePicker.currentDay;
      if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        day = day + 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
        day = day + 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
        day = day - 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        day = day - 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 35 || event.key && event.key.toLowerCase() == 'end') { // move focus to last day of week
        event.preventDefault();
        day = day + 6 - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 36 || event.key && event.key.toLowerCase() == 'home') { // move focus to first day of week
        event.preventDefault();
        day = day - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 34 || event.key && event.key.toLowerCase() == 'pagedown') {
        event.preventDefault();
        showNext(datePicker); // show next month
        keyNavigationInBetween(datePicker);
      } else if(event.keyCode && event.keyCode == 33 || event.key && event.key.toLowerCase() == 'pageup') {
        event.preventDefault();
        showPrev(datePicker); // show prev month
        keyNavigationInBetween(datePicker);
      }
    });

    // trap focus inside calendar
    datePicker.datePicker.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        trapFocus(event, datePicker);
      }
    });

    // select a date inside the date picker
    datePicker.body.addEventListener('click', function(event){
      event.preventDefault();
      var day = event.target.closest('button');
      if(day) {
        if(datePicker.dateToSelect == 1 && dateIsBeforeStart(datePicker, day)) {
          // if this is end date -> make sure it is after start date, otherwise use as start date
          datePicker.dateToSelect = 0;
        }
        datePicker.dateSelected[datePicker.dateToSelect] = true;
        datePicker.selectedDay[datePicker.dateToSelect] = parseInt(day.innerText);
        datePicker.selectedMonth[datePicker.dateToSelect] = datePicker.currentMonth;
        datePicker.selectedYear[datePicker.dateToSelect] = datePicker.currentYear;

        if(datePicker.dateToSelect == 0) {
          setInputStartValue(datePicker);
          datePicker.dateToSelect = 1;
          startDateSelected(datePicker, day);
        } else {
          setInputEndValue(datePicker);
          datePicker.dateToSelect = 0;
          // close date picker
          hideCalendar(datePicker);
        }
        resetLabelCalendarTrigger(datePicker);
        resetLabelCalendarValue(datePicker);
        resetAriaLive(datePicker);
      }
    });

    // on mouse move, highlight the elements between start and end date
    datePicker.body.addEventListener('mousemove', function(event){
      var button = event.target.closest('.js-date-picker__date');
      if(!button || !datePicker.dateSelected[0] || datePicker.dateSelected[1]) return;
      showInBetweenElements(datePicker, button);
    });

    datePicker.body.addEventListener('mouseleave', function(event){
      if(!datePicker.dateSelected[1]) {
        // end date has not been selected -> remove the inBetween classes
        removeInBetweenClass(datePicker);
        resetStarDateAppearance(datePicker);
      }
    });

    // input events - for SR only
    datePicker.inputStart.addEventListener('focusout', function(event){
      resetCalendarFromInput(datePicker, datePicker.inputStart);
    });
    datePicker.inputEnd.addEventListener('focusout', function(event){
      resetCalendarFromInput(datePicker, datePicker.inputEnd);
    });
  };

  function dateIsBeforeStart(datePicker, day) { // do not allow end date < start date
    var selectedDate = [datePicker.currentYear, datePicker.currentMonth, parseInt(day.textContent)],
      startDate = [datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]];
    return isPast(selectedDate, startDate);
  };

  function startDateSelected(datePicker, day) { // new start date has been selected
    datePicker.dateSelected[1] = false;
    datePicker.selectedDay[1] = false;
    datePicker.selectedMonth[1] = false;
    datePicker.selectedYear[1] = false;
    // reset input
    datePicker.inputEnd.value = '';
    // remove class from selected element -> if there was one
    var startDate = datePicker.element.getElementsByClassName('js-date-picker__date--range-start');
    if(startDate.length > 0) {
      Util.removeClass(startDate[0], datePicker.selectedStartClass + ' date-picker__date--range-start');
    }
    var endDate = datePicker.element.getElementsByClassName('js-date-picker__date--range-end');
    if(endDate.length > 0) {
      Util.removeClass(endDate[0], datePicker.selectedEndClass);
    }
    removeInBetweenClass(datePicker);
    // add classes to selected date
    Util.addClass(day, datePicker.selectedStartClass);
  };

  function resetCalendarFromInput(datePicker, input) {
    // reset calendar when input field is updated (SR only)
    var inputDate = getDateFromInput(datePicker, input.value);
    if(!inputDate) {
      input.value = '';
      return;
    }
    if (isNaN(new Date(inputDate).getTime())) {
      input.value = '';
      return;
    }
    resetCalendar(datePicker);
  };

  function resetCalendar(datePicker) {
    // new date has been selected -> reset calendar appearance
    resetSingleDate(datePicker, 0);
    resetSingleDate(datePicker, 1);
    // reset aria
    resetLabelCalendarTrigger(datePicker);
    resetLabelCalendarValue(datePicker);
    resetAriaLive(datePicker);
  };

  function resetSingleDate(datePicker, index) {
    // set current date + selected date (index == 0 ? startDate : endDate)
    var currentDate = false,
      selectedDate = (index == 0 ) ? datePicker.inputStart.value : datePicker.inputEnd.value;

    datePicker.dateSelected[index] = false;
    if( selectedDate != '') {
      var date = getDateFromInput(datePicker, selectedDate);
      datePicker.dateSelected[index] = true;
      currentDate = date;
    } 
    if( index == 0 ) {
      datePicker.currentDay = getCurrentDay(currentDate);
      datePicker.currentMonth = getCurrentMonth(currentDate); 
      datePicker.currentYear = getCurrentYear(currentDate); 
    }
    
    datePicker.selectedDay[index] = datePicker.dateSelected[index] ? getCurrentDay(currentDate) : false;
    datePicker.selectedMonth[index] = datePicker.dateSelected[index] ? getCurrentMonth(currentDate) : false;
    datePicker.selectedYear[index] = datePicker.dateSelected[index] ? getCurrentYear(currentDate) : false;
  };

  function getCurrentDay(date) {
    return (date) 
      ? getDayFromDate(date)
      : new Date().getDate();
  };

  function getCurrentMonth(date) {
    return (date) 
      ? getMonthFromDate(date)
      : new Date().getMonth();
  };

  function getCurrentYear(date) {
    return (date) 
      ? getYearFromDate(date)
      : new Date().getFullYear();
  };

  function getDayFromDate(date) {
    var day = parseInt(date.split('-')[2]);
    return isNaN(day) ? getCurrentDay(false) : day;
  };

  function getMonthFromDate(date) {
    var month = parseInt(date.split('-')[1]) - 1;
    return isNaN(month) ? getCurrentMonth(false) : month;
  };

  function getYearFromDate(date) {
    var year = parseInt(date.split('-')[0]);
    return isNaN(year) ? getCurrentYear(false) : year;
  };

  function showNext(datePicker, bool) {
    // show next month
    datePicker.currentYear = (datePicker.currentMonth === 11) ? datePicker.currentYear + 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth + 1) % 12;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagionM.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function showPrev(datePicker, bool) {
    // show prev month
    datePicker.currentYear = (datePicker.currentMonth === 0) ? datePicker.currentYear - 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth === 0) ? 11 : datePicker.currentMonth - 1;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagionM.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function checkDayInMonth(datePicker) {
    return (datePicker.currentDay > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) ? 1 : datePicker.currentDay;
  };

  function daysInMonth(year, month) {
    return 32 - new Date(year, month, 32).getDate();
  };

  function showCalendar(datePicker, bool) {
    // show calendar element
    var firstDay = getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, '01');
    datePicker.body.innerHTML = '';
    datePicker.heading.innerHTML = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;

    // creating all cells
    var date = 1,
      calendar = '';
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          calendar = calendar + '<li></li>';
        } else if (date > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) {
          break;
        } else {
          var classListDate = '',
            tabindexValue = '-1';
          if (date === datePicker.currentDay) {
            tabindexValue = '0';
          } 
          if(!datePicker.dateSelected[0] && !datePicker.dateSelected[1] && getCurrentMonth() == datePicker.currentMonth && getCurrentYear() == datePicker.currentYear && date == getCurrentDay()){
            classListDate = classListDate+' date-picker__date--today'
          }
          if (datePicker.dateSelected[0] && date === datePicker.selectedDay[0] && datePicker.currentYear === datePicker.selectedYear[0] && datePicker.currentMonth === datePicker.selectedMonth[0]) {
            classListDate = classListDate+'  '+datePicker.selectedStartClass;
          }
          if (datePicker.dateSelected[1] && date === datePicker.selectedDay[1] && datePicker.currentYear === datePicker.selectedYear[1] && datePicker.currentMonth === datePicker.selectedMonth[1]) {
            classListDate = classListDate+'  '+datePicker.selectedEndClass;
          }
          calendar = calendar + '<li><button class="date-picker__date'+classListDate+' js-date-picker__date" tabindex="'+tabindexValue+'">'+date+'</button></li>';
          date++;
        }
      }
    }
    datePicker.body.innerHTML = calendar; // appending days into calendar body
    
    // show calendar
    if(!datePicker.pickerVisible) Util.addClass(datePicker.datePicker, 'date-picker--is-visible');
    datePicker.pickerVisible = true;

    //  if bool is false, move focus to calendar day
    if(!bool) datePicker.body.querySelector('button[tabindex="0"]').focus();

    // store first/last focusable elements
    getFocusableElements(datePicker);
    // set inBetween elements
    if(datePicker.dateSelected[1]) {
      var endDate = datePicker.element.getElementsByClassName('js-date-picker__date--range-end');
      if(endDate.length > 0) {
        resetInBetweenElements(datePicker, endDate[0]);
      } else if(monthIsBetween(datePicker)) {
        // end date has been set but it is in another month
        // if we are in a previous month -- reset in between days
        var dates = datePicker.element.getElementsByClassName('js-date-picker__date');
        resetInBetweenElements(datePicker, dates[dates.length - 1]);
      }
    }
    // reset trigger label
    resetTriggerLabel(datePicker, true);
  };

  function resetTriggerLabel(datePicker, bool) {
    if(datePicker.triggerLabelWrapper.length < 1) return;
    if(datePicker.triggerLabelWrapper[0].children.length < 2) return;

    if(bool) {
      Util.addClass(datePicker.triggerLabelWrapper[0].children[0], 'is-hidden');
      Util.removeClass(datePicker.triggerLabelWrapper[0].children[1], 'is-hidden');
      // place calendar
      placeCalendar(datePicker);
    } else if( !datePicker.dateSelected[0] && !datePicker.dateSelected[1]) {
      Util.addClass(datePicker.triggerLabelWrapper[0].children[1], 'is-hidden');
      Util.removeClass(datePicker.triggerLabelWrapper[0].children[0], 'is-hidden');
    }
  };

  function hideCalendar(datePicker) {
    Util.removeClass(datePicker.datePicker, 'date-picker--is-visible');
    datePicker.pickerVisible = false;

    // reset first/last focusable
    datePicker.firstFocusable = false;
    datePicker.lastFocusable = false;

    // reset trigger aria-expanded attribute
    if(datePicker.trigger) datePicker.trigger.setAttribute('aria-expanded', 'false');

    // update focus if required
    if(document.activeElement.closest('.js-date-picker')) datePicker.trigger.focus();

    // reset trigger label
    resetTriggerLabel(datePicker, false);
  };

  function toggleCalendar(datePicker, bool) {
    if(!datePicker.pickerVisible) {
      resetCalendar(datePicker);
      showCalendar(datePicker, bool);
    } else {
      hideCalendar(datePicker);
    }
  };

  function getDayOfWeek(year, month, day) {
    var weekDay = (new Date(year, month, day)).getDay() - 1;
    if(weekDay < 0) weekDay = 6;
    return weekDay;
  };

  function getDateIndexes(datePicker) {
    var dateFormat = datePicker.options.dateFormat.toLowerCase().replace(/-/g, '');
    return [dateFormat.indexOf('d'), dateFormat.indexOf('m'), dateFormat.indexOf('y')];
  };

  function setInputStartValue(datePicker) {
    datePicker.inputStart.value = getDateForInput(datePicker, 0);
  };

  function setInputEndValue(datePicker) {
    datePicker.inputEnd.value = getDateForInput(datePicker, 1);
  };

  function getDateForInput(datePicker, index) {
    // index is 0 for start date, 1 for end date
    var dateArray = [];
    dateArray[datePicker.dateIndexes[0]] = getReadableDate(datePicker.selectedDay[index]);
    dateArray[datePicker.dateIndexes[1]] = getReadableDate(datePicker.selectedMonth[index]+1);
    dateArray[datePicker.dateIndexes[2]] = datePicker.selectedYear[index];
    return dateArray[0]+datePicker.options.dateSeparator+dateArray[1]+datePicker.options.dateSeparator+dateArray[2];
  };

  function getDateFromInput(datePicker, input) {
    var dateArray = input.split(datePicker.options.dateSeparator);
    if(dateArray.length < 3) return false;
    return dateArray[datePicker.dateIndexes[2]]+'-'+dateArray[datePicker.dateIndexes[1]]+'-'+dateArray[datePicker.dateIndexes[0]];
  };

  function getReadableDate(date) {
    return (date < 10) ? '0'+date : date;
  };

  function resetDayValue(day, datePicker) {
    var totDays = daysInMonth(datePicker.currentYear, datePicker.currentMonth);
    if( day > totDays) {
      datePicker.currentDay = day - totDays;
      showNext(datePicker, false);
      keyNavigationInBetween(datePicker);
    } else if(day < 1) {
      var newMonth = datePicker.currentMonth == 0 ? 11 : datePicker.currentMonth - 1;
      datePicker.currentDay = daysInMonth(datePicker.currentYear, newMonth) + day;
      showPrev(datePicker, false);
      keyNavigationInBetween(datePicker);
    } else {
      datePicker.currentDay = day;
      datePicker.body.querySelector('button[tabindex="0"]').setAttribute('tabindex', '-1');
      // set new tabindex to selected item
      var buttons = datePicker.body.getElementsByTagName("button");
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent == datePicker.currentDay) {
          buttons[i].setAttribute('tabindex', '0');
          buttons[i].focus();
          break;
        }
      }
      getFocusableElements(datePicker); // update first focusable/last focusable element
      // reset inBetween dates
      keyNavigationInBetween(datePicker);
    }
  };

  function getFocusableElements(datePicker) {
    var allFocusable = datePicker.datePicker.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstFocusable(allFocusable, datePicker);
    getLastFocusable(allFocusable, datePicker);
  };

  function getFirstFocusable(elements, datePicker) {
    for(var i = 0; i < elements.length; i++) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1') {
				datePicker.firstFocusable = elements[i];
				return true;
			}
		}
  };

  function getLastFocusable(elements, datePicker) {
    //get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1' ) {
				datePicker.lastFocusable = elements[i];
				return true;
			}
		}
  };

  function trapFocus(event, datePicker) {
    if( datePicker.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.lastFocusable.focus();
		}
		if( datePicker.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.firstFocusable.focus();
		}
  };

  function resetLabelCalendarTrigger(datePicker) {
    // for SR only - update trigger aria-label to include selected dates
    if(!datePicker.trigger) return;
    var label = '';
    if(datePicker.selectedYear[0] && datePicker.selectedMonth[0] && datePicker.selectedDay[0]) {
      label = label + ', start date selected is '+ new Date(datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]).toDateString();
    }
    if(datePicker.selectedYear[1] && datePicker.selectedMonth[1] && datePicker.selectedDay[1]) {
      label = label + ', end date selected is '+ new Date(datePicker.selectedYear[1], datePicker.selectedMonth[1], datePicker.selectedDay[1]).toDateString();
    }

    datePicker.trigger.setAttribute('aria-label', datePicker.triggerLabel+label);
  };
  
  function resetLabelCalendarValue(datePicker) {
    // trigger visible label - update value with selected dates
    if(datePicker.dateValueStartEl.length > 0) {
      resetLabel(datePicker, 0, datePicker.dateValueStartEl[0], datePicker.dateValueStartElLabel);
    }
    if(datePicker.dateValueEndEl.length > 0) {
      resetLabel(datePicker, 1, datePicker.dateValueEndEl[0], datePicker.dateValueEndElLabel);
    }
  };

  function resetLabel(datePicker, index, input, initialLabel) {
    (datePicker.selectedYear[index] && datePicker.selectedMonth[index] !== false && datePicker.selectedDay[index]) 
      ? input.textContent = getDateForInput(datePicker, index)
      : input.textContent = initialLabel;
  };

  function resetAriaLive(datePicker) { 
    // SR only - update an aria live region to announce the date that has just been selected
    var content = false;
    if(datePicker.dateSelected[0] && !datePicker.dateSelected[1]) {
      // end date has been selected -> notify users
      content = 'Start date selected is '+ new Date(datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]).toDateString()+', select end date';
    }
    if(content) datePicker.srLiveReagionM.textContent = content;
  };

  function showInBetweenElements(datePicker, button) {
    // this function is used to add style to elements when the start date has been selected, and user is moving to select end date
    if(datePicker.mouseMoving) return;
    datePicker.mouseMoving = true;
    window.requestAnimationFrame(function(){
      removeInBetweenClass(datePicker);
      resetInBetweenElements(datePicker, button);
      resetStarDateAppearance(datePicker);
      datePicker.mouseMoving = false;
    });
  };

  function resetInBetweenElements(datePicker, endDate) {
    if(!endDate) return;
    // check if date is older than the start date -> do not add the --range class
    if(isPast([datePicker.currentYear, datePicker.currentMonth, parseInt(endDate.textContent)], [datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]])) return
    if(Util.hasClass(endDate, 'js-date-picker__date--range-start')) {
      Util.addClass(endDate, 'date-picker__date--range-start');
      return;
    } else if(!Util.hasClass(endDate, 'js-date-picker__date--range-end')) {
      Util.addClass(endDate, datePicker.inBetweenClass);
    }
    var prevDay = endDate.closest('li').previousElementSibling;
    if(!prevDay) return;
    var date = prevDay.querySelector('button');
    if(!date) return;
    resetInBetweenElements(datePicker, date);
  };

  function removeInBetweenClass(datePicker) {
    var inBetweenDates = datePicker.element.getElementsByClassName(datePicker.inBetweenClass);
    while(inBetweenDates[0]) {
      Util.removeClass(inBetweenDates[0], datePicker.inBetweenClass);
    }
  };

  function monthIsBetween(datePicker) {
    var beforeEndDate = false;
    var afterStartDate = false;
    // check before end date
    if(datePicker.currentYear < datePicker.selectedYear[1]) {
      beforeEndDate = true;
    } else if(datePicker.currentYear == datePicker.selectedYear[1] && datePicker.currentMonth <= datePicker.selectedMonth[1]) {
      beforeEndDate = true;
    }
    // check after start date
    if(datePicker.currentYear > datePicker.selectedYear[0]) {
      afterStartDate = true;
    } else if(datePicker.currentYear == datePicker.selectedYear[0] && datePicker.currentMonth >= datePicker.selectedMonth[0]) {
      afterStartDate = true;
    }
    return beforeEndDate && afterStartDate;
  };

  function isPast(date, now) {
    // date < now
    var newdate = new Date(date[0], date[1], date[2]),
      nowDate = new Date(now[0], now[1], now[2]);
    return newdate < nowDate;
  };

  function keyNavigationInBetween(datePicker) {
    if(datePicker.dateSelected[0] && !datePicker.dateSelected[1]) showInBetweenElements(datePicker, datePicker.element.querySelector('.js-date-picker__date[tabindex="0"]'));
  };

  function resetStarDateAppearance(datePicker) {
    // the start date apperance is modified when there are --range elements (e.g., remove corners)
    if(!datePicker.dateSelected[0]) return;
    var inBetweenDates = datePicker.datePicker.getElementsByClassName(datePicker.inBetweenClass);
    if(inBetweenDates.length == 0) {
      var startDate = datePicker.datePicker.getElementsByClassName('date-picker__date--range-start');
      if(startDate.length > 0) Util.removeClass(startDate[0], 'date-picker__date--range-start');
    }
  };

  function initPredefinedOptions(datePicker) {
    if(!datePicker.predefOptions || !Util.hasClass(datePicker.predefOptions, 'js-date-range-select')) return;
    
    var select = datePicker.predefOptions.querySelector('select');
    if(!select) return;

    // check initial value and toggle date range
    if(select.options[select.selectedIndex].value == 'custom') Util.removeClass(datePicker.element, 'is-hidden');

    select.addEventListener('change', function(event) {
      if(select.options[select.selectedIndex].value == 'custom') {
        // reveal date picker
        Util.removeClass(datePicker.element, 'is-hidden');
        placeCalendar(datePicker);
        datePicker.trigger.focus();
      } else {
        Util.addClass(datePicker.element, 'is-hidden');
      }
    });
  };

  function placeCalendar(datePicker) {
    // reset position
    datePicker.datePicker.style.left = '0px';
    datePicker.datePicker.style.right = 'auto';
    
    //check if you need to modify the calendar postion
    var pickerBoundingRect = datePicker.datePicker.getBoundingClientRect();

    if(pickerBoundingRect.right > window.innerWidth) {
      datePicker.datePicker.style.left = 'auto';
      datePicker.datePicker.style.right = '0px';
    }
  };

  DateRange.defaults = {
    element : '',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dateFormat: 'd-m-y',
    dateSeparator: '/'
  };

  window.DateRange = DateRange;

  var dateRange = document.getElementsByClassName('js-date-range');
  if( dateRange.length > 0 ) {
		for( var i = 0; i < dateRange.length; i++) {(function(i){
      var opts = {element: dateRange[i]};
      if(dateRange[i].getAttribute('data-date-format')) {
        opts.dateFormat = dateRange[i].getAttribute('data-date-format');
      }
      if(dateRange[i].getAttribute('data-date-separator')) {
        opts.dateSeparator = dateRange[i].getAttribute('data-date-separator');
      }
      if(dateRange[i].getAttribute('data-months')) {
        opts.months = dateRange[i].getAttribute('data-months').split(',').map(function(item) {return item.trim();});
      }
      new DateRange(opts);
    })(i);}
	}
}());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
	if(flexHeader.length > 0) {
		var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		resetFlexHeaderOffset();
		setAriaButtons();

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
			toggleMenuNavigation(event.detail);
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
			}
		});

		// detect click on a dropdown control button - expand-on-mobile only
		flexHeader[0].addEventListener('click', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control');
			if(!btnLink) return;
			!btnLink.getAttribute('aria-expanded') ? btnLink.setAttribute('aria-expanded', 'true') : btnLink.removeAttribute('aria-expanded');
		});

		// detect mouseout from a dropdown control button - expand-on-mobile only
		flexHeader[0].addEventListener('mouseout', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control');
			if(!btnLink) return;
			// check layout type
			if(getLayout() == 'mobile') return;
			btnLink.removeAttribute('aria-expanded');
		});

		// close dropdown on focusout - expand-on-mobile only
		flexHeader[0].addEventListener('focusin', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control'),
				dropdown = event.target.closest('.f-header__dropdown');
			if(dropdown) return;
			if(btnLink && btnLink.hasAttribute('aria-expanded')) return;
			// check layout type
			if(getLayout() == 'mobile') return;
			var openDropdown = flexHeader[0].querySelector('.js-f-header__dropdown-control[aria-expanded="true"]');
			if(openDropdown) openDropdown.removeAttribute('aria-expanded');
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function getMenuFirstFocusable() {
			var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		};

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
				menuTrigger.click();
			}
			resetFlexHeaderOffset();
		};
		
		function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
			Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
			Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
			menuTrigger.setAttribute('aria-expanded', bool);
			if(bool) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		};

		function resetFlexHeaderOffset() {
			// on mobile -> update max height of the flexi header based on its offset value (e.g., if there's a fixed pre-header element)
			document.documentElement.style.setProperty('--f-header-offset', flexHeader[0].getBoundingClientRect().top+'px');
		};

		function setAriaButtons() {
			var btnDropdown = flexHeader[0].getElementsByClassName('js-f-header__dropdown-control');
			for(var i = 0; i < btnDropdown.length; i++) {
				var id = 'f-header-dropdown-'+i,
					dropdown = btnDropdown[i].nextElementSibling;
				if(dropdown.hasAttribute('id')) {
					id = dropdown.getAttribute('id');
				} else {
					dropdown.setAttribute('id', id);
				}
				btnDropdown[i].setAttribute('aria-controls', id);	
			}
		};

		function getLayout() {
			return getComputedStyle(flexHeader[0], ':before').getPropertyValue('content').replace(/\'|"/g, '');
		};
	}
}());
// File#: _2_full-screen-select
(function() {
	var CustomSelect = function(element) {
		this.element = element;
		this.items = this.element.children;
		initCustomSelect(this);
	};

	function initCustomSelect(select) {
		// arrow navigation
		select.element.addEventListener('keydown', function(event){
			if( event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown' ) {
				selectOption(select, 1); // go to next option
			} else if( event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup' ) {
				selectOption(select, -1); // go to prev option
			}
		});
	};

	function selectOption(select, direction) {
		var focusElement = document.activeElement,
			index = Util.getIndexInArray(select.items, focusElement.closest('li'));
		if(index < 0) return;
		index = index + direction;
		if( index < 0 ) index = select.items.length - 1;
		if( index >= select.items.length) index = 0;
		Util.moveFocus(select.items[index].getElementsByTagName(focusElement.tagName)[0]);
	};

	//initialize the CustomSelect objects
	var customSelect = document.getElementsByClassName('js-full-screen-select');
	if( customSelect.length > 0 ) {
		for( var i = 0; i < customSelect.length; i++) {
			(function(i){new CustomSelect(customSelect[i]);})(i);
		}
	}
}());
// File#: _2_grid-switch
// Usage: codyhouse.co/license
(function() {
  var GridSwitch = function(element) {
    this.element = element;
    this.controller = this.element.getElementsByClassName('js-grid-switch__controller')[0];
    this.items = this.element.getElementsByClassName('js-grid-switch__item');
    this.contentElements = this.element.getElementsByClassName('js-grid-switch__content');
    // store custom classes
    this.classList = [[this.element.getAttribute('data-gs-item-class-1'), this.element.getAttribute('data-gs-content-class-1')], [this.element.getAttribute('data-gs-item-class-2'), this.element.getAttribute('data-gs-content-class-2')]];
    initGridSwitch(this);
  };

  function initGridSwitch(element) {
    // get selected state and apply style
    var selectedInput = element.controller.querySelector('input:checked');
    if(selectedInput) {
      setGridAppearance(element, selectedInput.value);
    }
    // reveal grid
    Util.addClass(element.element, 'grid-switch--is-visible');
    // a new layout has been selected 
    element.controller.addEventListener('change', function(event) {
      setGridAppearance(element, event.target.value);
    });
  };

  function setGridAppearance(element, value) {
    var newStatus = parseInt(value) - 1,
      oldStatus = newStatus == 1 ? 0 : 1;
      
    for(var i = 0; i < element.items.length; i++) {
      Util.removeClass(element.items[i], element.classList[oldStatus][0]);
      Util.removeClass(element.contentElements[i], element.classList[oldStatus][1]);
      Util.addClass(element.items[i], element.classList[newStatus][0]);
      Util.addClass(element.contentElements[i], element.classList[newStatus][1]);
    }
  };

  //initialize the GridSwitch objects
	var gridSwitch = document.getElementsByClassName('js-grid-switch');
	if( gridSwitch.length > 0 ) {
		for( var i = 0; i < gridSwitch.length; i++) {
			(function(i){new GridSwitch(gridSwitch[i]);})(i);
    }
  }
}());
// File#: _2_points-of-interest
// Usage: codyhouse.co/license
(function() {
  function initPoi(element) {
    element.addEventListener('click', function(event){
      var poiItem = event.target.closest('.js-poi__item');
      if(poiItem) Util.addClass(poiItem, 'poi__item--visited');
    });
  };

  var poi = document.getElementsByClassName('js-poi');
  for(var i = 0; i < poi.length; i++) {
    (function(i){initPoi(poi[i]);})(i);
  }
}());
// File#: _2_image-zoom
// Usage: codyhouse.co/license

(function() {
  var ImageZoom = function(element, index) {
    this.element = element;
    this.lightBoxId = 'img-zoom-lightbox--'+index;
    this.imgPreview = this.element.getElementsByClassName('js-image-zoom__preview')[0];
    
    initImageZoomHtml(this); // init markup
    
    this.lightbox = document.getElementById(this.lightBoxId);
    this.imgEnlg = this.lightbox.getElementsByClassName('js-image-zoom__fw')[0];
    this.input = this.element.getElementsByClassName('js-image-zoom__input')[0];
    this.animate = this.element.getAttribute('data-morph') != 'off';
    
    initImageZoomEvents(this); //init events
  };

  function initImageZoomHtml(imageZoom) {
    // get zoomed image url
    var url = imageZoom.element.getAttribute('data-img');
    if(!url) url = imageZoom.imgPreview.getAttribute('src');

    var lightBox = document.createElement('div');
    Util.setAttributes(lightBox, {class: 'image-zoom__lightbox js-image-zoom__lightbox', id: imageZoom.lightBoxId, 'aria-hidden': 'true'});
    lightBox.innerHTML = '<img src="'+url+'" class="js-image-zoom__fw"></img>';
    document.body.appendChild(lightBox);
    
    var keyboardInput = '<input aria-hidden="true" type="checkbox" class="image-zoom__input js-image-zoom__input"></input>';
    imageZoom.element.insertAdjacentHTML('afterbegin', keyboardInput);

  };

  function initImageZoomEvents(imageZoom) {
    // toggle lightbox on click
    imageZoom.imgPreview.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, true);
      imageZoom.input.checked = true;
    });
    imageZoom.lightbox.addEventListener('click', function(event){
      toggleFullWidth(imageZoom, false);
      imageZoom.input.checked = false;
    });
    // detect swipe down to close lightbox
    new SwipeContent(imageZoom.lightbox);
    imageZoom.lightbox.addEventListener('swipeDown', function(event){
      toggleFullWidth(imageZoom, false);
      imageZoom.input.checked = false;
    });
    // keyboard accessibility
    imageZoom.input.addEventListener('change', function(event){
      toggleFullWidth(imageZoom, imageZoom.input.checked);
    });
    imageZoom.input.addEventListener('keydown', function(event){
      if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
        imageZoom.input.checked = !imageZoom.input.checked;
        toggleFullWidth(imageZoom, imageZoom.input.checked);
      }
    });
  };

  function toggleFullWidth(imageZoom, bool) {
    if(animationSupported && imageZoom.animate) { // start expanding animation
      window.requestAnimationFrame(function(){
        animateZoomImage(imageZoom, bool);
      });
    } else { // show lightbox without animation
      Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible', bool);
    }
  };

  function animateZoomImage(imageZoom, bool) {
    // get img preview position and dimension for the morphing effect
    var rect = imageZoom.imgPreview.getBoundingClientRect(),
      finalWidth = imageZoom.lightbox.getBoundingClientRect().width;
    var init = (bool) ? [rect.top, rect.left, rect.width] : [0, 0, finalWidth],
      final = (bool) ? [-rect.top, -rect.left, parseFloat(finalWidth/rect.width)] : [rect.top + imageZoom.lightbox.scrollTop, rect.left, parseFloat(rect.width/finalWidth)];
    
    if(bool) {
      imageZoom.imgEnlg.setAttribute('style', 'top: '+init[0]+'px; left:'+init[1]+'px; width:'+init[2]+'px;');
    }
    
    // show modal
    Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
    Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');

    imageZoom.imgEnlg.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(!bool) Util.removeClass(imageZoom.lightbox, 'image-zoom__lightbox--is-visible');
      Util.addClass(imageZoom.lightbox, 'image-zoom__lightbox--no-transition');
      imageZoom.imgEnlg.removeAttribute('style');
      imageZoom.imgEnlg.removeEventListener('transitionend', cb);
    });
    
    // animate image and bg
    imageZoom.imgEnlg.style.transform = 'translateX('+final[1]+'px) translateY('+final[0]+'px) scale('+final[2]+')';
    Util.toggleClass(imageZoom.lightbox, 'image-zoom__lightbox--animate-bg', bool);
  };

  // init ImageZoom object
  var imageZoom = document.getElementsByClassName('js-image-zoom'),
    animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
  if( imageZoom.length > 0 ) {
    var imageZoomArray = [];
    for( var i = 0; i < imageZoom.length; i++) {
      imageZoomArray.push(new ImageZoom(imageZoom[i], i));
    }

    // close Zoom Image lightbox on Esc
    window.addEventListener('keydown', function(event){
      if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'esc')) {
        for( var i = 0; i < imageZoomArray.length; i++) {
          imageZoomArray[i].input.checked = false;
          if(Util.hasClass(imageZoomArray[i].lightbox, 'image-zoom__lightbox--is-visible')) toggleFullWidth(imageZoomArray[i], false);
        }
      }
    });
  }
}());
// File#: _2_main-header-v3
// Usage: codyhouse.co/license
(function() {
	var mainHeader = document.getElementsByClassName('js-header-v3');
	if(mainHeader.length > 0) {
		var menuTrigger = mainHeader[0].getElementsByClassName('js-toggle-menu')[0],
			searchTrigger = mainHeader[0].getElementsByClassName('js-toggle-search'),
			navigation = mainHeader[0].getElementsByClassName('header-v3__nav')[0];

		// we'll use these to store the node that needs to receive focus when the mobile menu/search input are closed 
		var focusSearch = false,
			focusMenu = false;
			
		// set delays for list items inside navigation -> mobile animation
		var navItems = Util.getChildrenByClassName(navigation.getElementsByClassName('header-v3__nav-list')[0], 'header-v3__nav-item');
		for(var i = 0; i < navItems.length; i++) {
			setTransitionDelay(navItems[i], i);
		}
		// toggle navigation on mobile
		menuTrigger.addEventListener('switch-icon-clicked', function(event){ // toggle menu visibility an small devices
			toggleNavigation(event.detail);
		});
		// toggle search on desktop
		if(searchTrigger.length > 0) {
			searchTrigger[0].addEventListener('switch-icon-clicked', function(event){ // toggle menu visibility an small devices
				toggleSearch(event.detail);
			});
		}
		
		window.addEventListener('keyup', function(event){
			// listen for esc key events
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
				// close search if open
				if(searchTrigger.length > 0 && searchTrigger[0].getAttribute('aria-expanded') == 'true' && isVisible(searchTrigger[0])) {
					focusSearch = searchTrigger[0]; // move focus to search trigger when search is close
					searchTrigger[0].click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-header-v3')) menuTrigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 300);
		});

		function toggleNavigation(bool) {
			Util.addClass(navigation, 'header-v3__nav--is-visible');
			Util.addClass(menuTrigger, 'switch-icon--disabled');
			menuTrigger.setAttribute('aria-expanded', bool);
			// animate navigation height
			var finalHeight = bool ? window.innerHeight: 0,
				initHeight = bool ? 0 : window.innerHeight; 
			navigation.style.height = initHeight+'px';

			setTimeout(function(){
				navigation.style.height = finalHeight+'px';
				Util.toggleClass(navigation, 'header-v3__nav--animate-children', bool);
			}, 50);

			navigation.addEventListener('transitionend', function cb(event){
				if (event.propertyName !== 'height') return;
				if(finalHeight > 0) {
					var firstFocusableElement = getMenuFirstFocusable();
					firstFocusableElement.focus(); // move focus to first focusable element
				} else {
					Util.removeClass(navigation, 'header-v3__nav--is-visible header-v3__nav--animate-children');
					if(focusMenu) { // we may need to move the focus to a new element
						focusMenu.focus();
						focusMenu = false;
					}
				}
				
				navigation.removeEventListener('transitionend', cb);
				navigation.removeAttribute('style');
				Util.removeClass(menuTrigger, 'switch-icon--disabled');
			});
			// toggle expanded class to header
			Util.toggleClass(mainHeader[0], 'header-v3--expanded', bool);
		};

		function toggleSearch(bool){
			Util.addClass(searchTrigger[0], 'switch-icon--disabled');
			Util.toggleClass(mainHeader[0], 'header-v3--show-search', bool);
			searchTrigger[0].setAttribute('aria-expanded', bool);
			mainHeader[0].addEventListener('transitionend', function cb(){
				mainHeader[0].removeEventListener('transitionend', cb);
				Util.removeClass(searchTrigger[0], 'switch-icon--disabled');
				if(bool) mainHeader[0].getElementsByClassName('header-v3__nav-item--search-form')[0].getElementsByTagName('input')[0].focus();
				else if(focusSearch) {// move focus to a new element when closing the search
					focusSearch.focus();
					focusSearch = false;
				}
			});

			// toggle expanded class to header
			Util.toggleClass(mainHeader[0], 'header-v3--expanded', bool);
		};

		function doneResizing() {
			// check if main nav is visible (small devices only)
			if( !isVisible(menuTrigger) && menuTrigger.getAttribute('aria-expanded') == 'true') menuTrigger.click();
			// check if search input is visible
			if( searchTrigger.length > 0 && !isVisible(searchTrigger[0]) && searchTrigger[0].getAttribute('aria-expanded') == 'true') searchTrigger[0].click();
		};

		function getMenuFirstFocusable() {
			var focusableEle = mainHeader[0].getElementsByClassName('header-v3__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
		};

		function setTransitionDelay(element, index) {
			element.style.transitionDelay = parseFloat((index/20) + 0.1).toFixed(2)+'s';
		};

		function isVisible(element) {
			return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		};
	}
}());
// File#: _2_modal-video
// Usage: codyhouse.co/license
(function() {
	var ModalVideo = function(element) {
		this.element = element;
		this.modalContent = this.element.getElementsByClassName('js-modal-video__content')[0];
		this.media = this.element.getElementsByClassName('js-modal-video__media')[0];
		this.contentIsIframe = this.media.tagName.toLowerCase() == 'iframe';
		this.modalIsOpen = false;
		this.initModalVideo();
	};

	ModalVideo.prototype.initModalVideo = function() {
		var self = this;
		// reveal modal content when iframe is ready
		this.addLoadListener();
		// listen for the modal element to be open -> set new iframe src attribute
		this.element.addEventListener('modalIsOpen', function(event){
			self.modalIsOpen = true;
			self.media.setAttribute('src', event.detail.closest('[aria-controls]').getAttribute('data-url'));
		});
		// listen for the modal element to be close -> reset iframe and hide modal content
		this.element.addEventListener('modalIsClose', function(event){
			self.modalIsOpen = false;
			Util.addClass(self.element, 'modal--is-loading');
			self.media.setAttribute('src', '');
		});
	};

	ModalVideo.prototype.addLoadListener = function() {
		var self = this;
		if(this.contentIsIframe) {
			this.media.onload = function () {
				self.revealContent();
			};
		} else {
			this.media.addEventListener('loadedmetadata', function(){
				self.revealContent();
			});
		}
		
	};

	ModalVideo.prototype.revealContent = function() {
		if( !this.modalIsOpen ) return;
		Util.removeClass(this.element, 'modal--is-loading');
		this.contentIsIframe ? this.media.contentWindow.focus() : this.media.focus();
	};

	//initialize the ModalVideo objects
	var modalVideos = document.getElementsByClassName('js-modal-video__media');
	if( modalVideos.length > 0 ) {
		for( var i = 0; i < modalVideos.length; i++) {
			(function(i){new ModalVideo(modalVideos[i].closest('.js-modal'));})(i);
		}
	}
}());
// File#: _2_morphing-image-modal
// Usage: codyhouse.co/license
(function() {
  var MorphImgModal = function(opts) {
    this.options = Util.extend(MorphImgModal.defaults, opts);
    this.element = this.options.element;
    this.modalId = this.element.getAttribute('id');
    this.triggers = document.querySelectorAll('[aria-controls="'+this.modalId+'"]');
    this.selectedImg = false;
    // store morph elements
    this.morphBg = document.getElementsByClassName('js-morph-img-bg');
    this.morphImg = document.getElementsByClassName('js-morph-img-clone');
    // store modal content
    this.modalContent = this.element.getElementsByClassName('js-morph-img-modal__content');
    this.modalImg = this.element.getElementsByClassName('js-morph-img-modal__img');
    this.modalInfo = this.element.getElementsByClassName('js-morph-img-modal__info');
    // store close btn element
    this.modalCloseBtn = document.getElementsByClassName('js-morph-img-close-btn');
    // animation duration
    this.animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--morph-img-modal-transition-duration'))*1000 || 300;
    // morphing animation should run
    this.animating = false;
    this.reset = false;
    initMorphModal(this);
  };

  function initMorphModal(element) {
    if(element.morphImg.length < 1) return;
    element.morphEl = element.morphImg[0].getElementsByTagName('image');
    element.morphRect  = element.morphImg[0].getElementsByTagName('rect');
    initMorphModalMarkup(element);
    initMorphModalEvents(element);
  };

  function initMorphModalMarkup(element) {
    // append the clip path + <image> elements to use to morph the image
    element.morphImg[0].innerHTML = '<svg><defs><clipPath id="'+element.modalId+'-clip"><rect/></clipPath></defs><image height="100%" width="100%" clip-path="url(#'+element.modalId+'-clip)"></image></svg>';
  };

  function initMorphModalEvents(element) {
    // morph modal was open
    element.element.addEventListener('modalIsOpen', function(event){
      var target = event.detail.closest('[aria-controls="'+element.modalId+'"]');
      setModalImg(element, target);
      setModalContent(element, target);
      toggleModalCloseBtn(element, true);
    });

    // morph modal was closed
    element.element.addEventListener('modalIsClose', function(event){
      element.reset = false;
      element.animating = true;
      Util.addClass(element.modalContent[0], 'opacity-0');
      animateImg(element, false, function() {
        if(element.reset) return; // user opened a new modal before the animation was complete - no need to reset the modal
        element.selectedImg = false;
        resetMorphModal(element, false);
        element.animating = false;
      });
      toggleModalCloseBtn(element, false);
    });

    // close modal clicking on close btn
    if(element.modalCloseBtn.length > 0) {
      element.modalCloseBtn[0].addEventListener('click', function(event) {
        element.element.click();
      });
    }
  };

  function setModalImg(element, target) {
    if(!target) return;
    element.selectedImg = (target.tagName.toLowerCase() == 'img') ? target : target.querySelector('img');
    var src = element.selectedImg.getAttribute('data-modal-src') || element.selectedImg.getAttribute('src');
    // update url modal image + morph
    if(element.modalImg.length > 0) element.modalImg[0].setAttribute('src', src);
    Util.setAttributes(element.morphEl[0], {'xlink:href': src, 'href': src});
    element.reset = false;
    element.animating = true;  
    // wait for image to be loaded, then animate
    loadImage(element, src, function() {
      animateImg(element, true, function() {
        if(element.reset) return; // user closed the modal before the animation was complete - no need to reset the modal
        resetMorphModal(element, true);
        element.animating = false;
      });
    });
  };

  function loadImage(element, src, cb) {
    var image = new Image();
    var loaded = false;
    image.onload = function () {
      if(loaded) return;
      cb();
    }
    image.src = src;
    if(image.complete) {
      loaded = true;
      cb();
    }
  };

  function setModalContent(element, target) {
    // load the modal info details - using the searchData custom function the user defines
    if(element.modalInfo.length < 1) return;
    element.options.searchData(target, function(data){
      element.modalInfo[0].innerHTML = data;
    });
  };

  function toggleModalCloseBtn(element, bool) {
    if(element.modalCloseBtn.length > 0) {
      Util.toggleClass(element.modalCloseBtn[0], 'morph-img-close-btn--is-visible', bool);
    }
  };

  function animateImg(element, isOpening, cb) {
    Util.removeClass(element.morphImg[0], 'is-hidden');

    var galleryImgRect = element.selectedImg.getBoundingClientRect(),
      modalImgRect = element.modalImg[0].getBoundingClientRect();

    runClipAnimation(element, galleryImgRect, modalImgRect, isOpening, cb);
  };

  function runClipAnimation(element, startRect, endRect, isOpening, cb) {
    // retrieve all animation params
    // main element animation (<div>)
    var elInitHeight = startRect.height,
      elIntWidth = startRect.width,
      elInitTop = startRect.top,
      elInitLeft = startRect.left;
    
    var elScale = Math.max(endRect.height/startRect.height, endRect.width/startRect.width);

    var elTranslateX = endRect.left - startRect.left + (endRect.width - startRect.width*elScale)*0.5,
      elTranslateY = endRect.top - startRect.top + (endRect.height - startRect.height*elScale)*0.5;

    // clip <rect> animation
    var rectScaleX = endRect.width/(startRect.width*elScale),
      rectScaleY = endRect.height/(startRect.height*elScale);

    element.morphImg[0].style = 'height:'+elInitHeight+'px; width:'+elIntWidth+'px; top:'+elInitTop+'px; left:'+elInitLeft+'px;';

    element.morphRect[0].setAttribute('transform', 'scale('+1+','+1+')');

    // init morph bg
    element.morphBg[0].style.height = startRect.height + 'px';
    element.morphBg[0].style.width = startRect.width + 'px';
    element.morphBg[0].style.top = startRect.top + 'px';
    element.morphBg[0].style.left = startRect.left + 'px';

    Util.removeClass(element.morphBg[0], 'is-hidden');
    
    animateRectScale(element, elInitHeight, elIntWidth, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb);
  };

  function animateRectScale(element, height, width, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb) {
    var isMobile = getComputedStyle(element.element, ':before').getPropertyValue('content').replace(/\'|"/g, '') == 'mobile';

    var currentTime = null,
      duration =  element.animationDuration;

    var startRect = element.selectedImg.getBoundingClientRect(),
      endRect = element.modalContent[0].getBoundingClientRect();
    
    var scaleX = endRect.width/startRect.width,
      scaleY = endRect.height/startRect.height;
  
    var translateX = endRect.left - startRect.left,
      translateY = endRect.top - startRect.top;

    var animateScale = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      
      // main element values
      if(isOpening) {
        var elScalePr = Math.easeOutQuart(progress, 1, elScale - 1, duration),
        elTransXPr = Math.easeOutQuart(progress, 0, elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, 0, elTranslateY, duration);
      } else {
        var elScalePr = Math.easeOutQuart(progress, elScale, 1 - elScale, duration),
        elTransXPr = Math.easeOutQuart(progress, elTranslateX, - elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, elTranslateY, - elTranslateY, duration);
      }
      
      // rect values
      if(isOpening) {
        var rectScaleXPr = Math.easeOutQuart(progress, 1, rectScaleX - 1, duration),
          rectScaleYPr = Math.easeOutQuart(progress, 1, rectScaleY - 1, duration);
      } else {
        var rectScaleXPr = Math.easeOutQuart(progress, rectScaleX,  1 - rectScaleX, duration),
          rectScaleYPr = Math.easeOutQuart(progress, rectScaleY, 1 - rectScaleY, duration);
      }

      element.morphImg[0].style.transform = 'translateX('+elTransXPr+'px) translateY('+elTransYPr+'px) scale('+elScalePr+')';

      element.morphRect[0].setAttribute('transform', 'translate('+(width/2)*(1 - rectScaleXPr)+' '+(height/2)*(1 - rectScaleYPr)+') scale('+rectScaleXPr+','+rectScaleYPr+')');

      if(isOpening) {
        var valScaleX = Math.easeOutQuart(progress, 1, (scaleX - 1), duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, 1, (scaleY - 1), duration): rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, 0, translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, 0, translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      } else {
        var valScaleX = Math.easeOutQuart(progress, scaleX, 1 - scaleX, duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, scaleY, 1 - scaleY, duration) : rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, translateX, - translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, translateY, - translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      }

      // morph bg
      element.morphBg[0].style.transform = 'translateX('+valTransX+'px) translateY('+valTransY+'px) scale('+valScaleX+','+valScaleY+')';

      if(progress < duration) {
        window.requestAnimationFrame(animateScale);
      } else if(cb) {
        cb();
      }
    };
    
    window.requestAnimationFrame(animateScale);
  };
  
  function resetMorphModal(element, isOpening) {
    // reset modal at the end of an opening/closing animation
    Util.toggleClass(element.modalContent[0], 'opacity-0', !isOpening);
    Util.toggleClass(element.modalInfo[0], 'opacity-0', !isOpening);
    Util.addClass(element.morphBg[0], 'is-hidden');
    Util.addClass(element.morphImg[0], 'is-hidden');
    if(!isOpening) {
      element.modalImg[0].removeAttribute('src');
      element.modalInfo[0].innerHTML = '';
      element.morphEl[0].removeAttribute('xlink:href');
      element.morphEl[0].removeAttribute('href');
      element.morphBg[0].removeAttribute('style');
      element.morphImg[0].removeAttribute('style');
    }
  };

  window.MorphImgModal = MorphImgModal;

  MorphImgModal.defaults = {
    element : '',
    searchData: false, // function used to return results
  };
}());
// File#: _2_off-canvas-navigation
// Usage: codyhouse.co/license
(function() {
  var OffCanvasNav = function(element) {
    this.element = element;
    this.panel = this.element.getElementsByClassName('js-off-canvas__panel')[0];
    this.trigger = document.querySelectorAll('[aria-controls="'+this.panel.getAttribute('id')+'"]')[0];
    this.svgAnim = this.trigger.getElementsByTagName('circle');
    initOffCanvasNav(this);
  };

  function initOffCanvasNav(canvas) {
    if(transitionSupported) {
      // do not allow click on menu icon while the navigation is animating
      canvas.trigger.addEventListener('click', function(event){
        canvas.trigger.style.setProperty('pointer-events', 'none');
      });
      canvas.panel.addEventListener('openPanel', function(event){
        canvas.trigger.style.setProperty('pointer-events', 'none');
      });
      canvas.panel.addEventListener('transitionend', function(event){
        if(event.propertyName == 'visibility') {
          canvas.trigger.style.setProperty('pointer-events', '');
        }
      });
    }

    if(canvas.svgAnim.length > 0) { // create the circle fill-in effect
      var circumference = (2*Math.PI*canvas.svgAnim[0].getAttribute('r')).toFixed(2);
      canvas.svgAnim[0].setAttribute('stroke-dashoffset', circumference);
      canvas.svgAnim[0].setAttribute('stroke-dasharray', circumference);
      Util.addClass(canvas.trigger, 'offnav-control--ready-to-animate');
    }
    
    canvas.panel.addEventListener('closePanel', function(event){
      // if the navigation is closed using keyboard or a11y close btn -> change trigger icon appearance (from arrow to menu icon) 
      if(event.detail == 'key' || event.detail == 'close-btn') {
        canvas.trigger.click();
      }
    });
  };

  // init OffCanvasNav objects
  var offCanvasNav = document.getElementsByClassName('js-off-canvas--nav'),
    transitionSupported = Util.cssSupports('transition');
	if( offCanvasNav.length > 0 ) {
		for( var i = 0; i < offCanvasNav.length; i++) {
			(function(i){new OffCanvasNav(offCanvasNav[i]);})(i);
		}
	}
}());
// File#: _2_page-transition-v1
// Usage: codyhouse.co/license
(function() {
  var pageTransitionWrapper = document.getElementsByClassName('js-page-trans');
  if(pageTransitionWrapper.length < 1) return;
  
  var transPanel = document.getElementsByClassName('page-trans-v1'),
    loaderScale = '--page-trans-v1-loader-scale',
    timeoutId = false,
    loaderScaleDown = 0.2;

  var timeLeaveAnim = 0;
  
  new PageTransition({
    leaveAnimation: function(initContent, link, cb) {
      timeLeaveAnim = 0;
      Util.addClass(transPanel[0], 'page-trans-v1--is-visible');
      transPanel[0].addEventListener('transitionend', function cbLeave(){
        transPanel[0].removeEventListener('transitionend', cbLeave);
        setTimeout(function(){
          animateLoader(300, 1, loaderScaleDown, function(){
            Util.addClass(initContent, 'is-hidden');
            timeLeaveAnim = new Date().getTime();
            cb();
          });
        }, 100);
      });
    },
    enterAnimation: function(initContent, newContent, link, cb) {
      if(timeoutId) {
        window.cancelAnimationFrame(timeoutId);
        timeoutId = false;
      }

      // set a minimum loader animation duration of 0.75s
      var duration = Math.max((750 - new Date().getTime() + timeLeaveAnim), 300);
  
      // complete page-trans-v1__loader scale animation
      animateLoader(duration, parseFloat(getComputedStyle(transPanel[0]).getPropertyValue(loaderScale)), 1, function() {
        Util.removeClass(transPanel[0], 'page-trans-v1--is-visible');
        transPanel[0].addEventListener('transitionend', function cbEnter(){
          transPanel[0].removeEventListener('transitionend', cbEnter);
          cb();
        });
      });
    },
    progressAnimation: function(link) {
      animateLoader(3000, loaderScaleDown, 0.9);
    }
  });

  function animateLoader(duration, startValue, finalValue, cb) {
    // takes care of animating the loader element
    var currentTime = false;

    var animateScale = function(timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var val = Math.easeInOutQuart(progress, startValue, finalValue - startValue, duration);
      transPanel[0].style.setProperty(loaderScale, val);
      if(progress < duration) {
        timeoutId = window.requestAnimationFrame(animateScale);
      } else {
        // reveal page content
        if(cb) cb();
      }
    };
    timeoutId = window.requestAnimationFrame(animateScale);
  };
}());
// File#: _2_pricing-table-v2
// Usage: codyhouse.co/license
(function() {
	var pTable = document.getElementsByClassName('js-p-table-v2');
	if(pTable.length > 0) {
		for(var i = 0; i < pTable.length; i++) {
			(function(i){ addPTableEvent(pTable[i]);})(i);
		}

		function addPTableEvent(element) {
			// switcher monthly/yearly plan
      var pSwitch = element.getElementsByClassName('js-p-table-v2__switch');
			if(pSwitch.length > 0) {
				pSwitch[0].addEventListener('change', function(event) {
          Util.toggleClass(element, 'p-table-v2--monthly-plan', (event.target.value == 'monthly'));
				});
			}

			// volume selector for multiple-users plan
			var pSelect = element.getElementsByClassName('js-p-table-v2__select'),
				pVolumeBtn = element.getElementsByClassName('js-p-table-v2__btn-volume');
			if(pSelect.length > 0 && pVolumeBtn.length > 0) {
				var volumeOptions = pVolumeBtn[0].querySelectorAll('[data-value]');
				updatePTableTeam(volumeOptions, pSelect[0].value); // init multiple-users plan price
				pSelect[0].addEventListener('change', function(event) {
          updatePTableTeam(volumeOptions, pSelect[0].value);
				});
			}
		}

		function updatePTableTeam(volumeOpt, value) {
			for(var i = 0; i < volumeOpt.length; i++) {
				volumeOpt[i].getAttribute('data-value') == value
					? volumeOpt[i].removeAttribute('style')
					: volumeOpt[i].setAttribute('style', 'display: none;');
			}
		};
	}
}());
// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
	var Slideshow = function(opts) {
		this.options = Util.extend(Slideshow.defaults , opts);
		this.element = this.options.element;
		this.items = this.element.getElementsByClassName('js-slideshow__item');
		this.controls = this.element.getElementsByClassName('js-slideshow__control'); 
		this.selectedSlide = 0;
		this.autoplayId = false;
		this.autoplayPaused = false;
		this.navigation = false;
		this.navCurrentLabel = false;
		this.ariaLive = false;
		this.moveFocus = false;
		this.animating = false;
		this.supportAnimation = Util.cssSupports('transition');
		this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
		this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
		this.animatingClass = 'slideshow--is-animating';
		initSlideshow(this);
		initSlideshowEvents(this);
		initAnimationEndEvents(this);
	};

	Slideshow.prototype.showNext = function() {
		showNewItem(this, this.selectedSlide + 1, 'next');
	};

	Slideshow.prototype.showPrev = function() {
		showNewItem(this, this.selectedSlide - 1, 'prev');
	};

	Slideshow.prototype.showItem = function(index) {
		showNewItem(this, index, false);
	};

	Slideshow.prototype.startAutoplay = function() {
		var self = this;
		if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
			self.autoplayId = setInterval(function(){
				self.showNext();
			}, self.options.autoplayInterval);
		}
	};

	Slideshow.prototype.pauseAutoplay = function() {
		var self = this;
		if(this.options.autoplay) {
			clearInterval(self.autoplayId);
			self.autoplayId = false;
		}
	};

	function initSlideshow(slideshow) { // basic slideshow settings
		// if no slide has been selected -> select the first one
		if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
		slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
		// create an element that will be used to announce the new visible slide to SR
		var srLiveArea = document.createElement('div');
		Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		slideshow.element.appendChild(srLiveArea);
		slideshow.ariaLive = srLiveArea;
	};

	function initSlideshowEvents(slideshow) {
		// if slideshow navigation is on -> create navigation HTML and add event listeners
		if(slideshow.options.navigation) {
			// check if navigation has already been included
			if(slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
				var navigation = document.createElement('ol'),
					navChildren = '';

				var navClasses = 'slideshow__navigation js-slideshow__navigation';
				if(slideshow.items.length <= 1) {
					navClasses = navClasses + ' is-hidden';
				} 
				
				navigation.setAttribute('class', navClasses);
				for(var i = 0; i < slideshow.items.length; i++) {
					var className = (i == slideshow.selectedSlide) ? 'class="slideshow__nav-item slideshow__nav-item--selected js-slideshow__nav-item"' :  'class="slideshow__nav-item js-slideshow__nav-item"',
						navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
					navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
				}
				navigation.innerHTML = navChildren;
				slideshow.element.appendChild(navigation);
			}
			
			slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0]; 
			slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

			var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];

			dotsNavigation.addEventListener('click', function(event){
				navigateSlide(slideshow, event, true);
			});
			dotsNavigation.addEventListener('keyup', function(event){
				navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
			});
		}
		// slideshow arrow controls
		if(slideshow.controls.length > 0) {
			// hide controls if one item available
			if(slideshow.items.length <= 1) {
				Util.addClass(slideshow.controls[0], 'is-hidden');
				Util.addClass(slideshow.controls[1], 'is-hidden');
			}
			slideshow.controls[0].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showPrev();
				updateAriaLive(slideshow);
			});
			slideshow.controls[1].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showNext();
				updateAriaLive(slideshow);
			});
		}
		// swipe events
		if(slideshow.options.swipe) {
			//init swipe
			new SwipeContent(slideshow.element);
			slideshow.element.addEventListener('swipeLeft', function(event){
				slideshow.showNext();
			});
			slideshow.element.addEventListener('swipeRight', function(event){
				slideshow.showPrev();
			});
		}
		// autoplay
		if(slideshow.options.autoplay) {
			slideshow.startAutoplay();
			// pause autoplay if user is interacting with the slideshow
			if(!slideshow.options.autoplayOnHover) {
				slideshow.element.addEventListener('mouseenter', function(event){
					slideshow.pauseAutoplay();
					slideshow.autoplayPaused = true;
				});
				slideshow.element.addEventListener('mouseleave', function(event){
					slideshow.autoplayPaused = false;
					slideshow.startAutoplay();
				});
			}
			
			slideshow.element.addEventListener('focusin', function(event){
				slideshow.pauseAutoplay();
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('focusout', function(event){
				slideshow.autoplayPaused = false;
				slideshow.startAutoplay();
			});
		}
		// detect if external buttons control the slideshow
		var slideshowId = slideshow.element.getAttribute('id');
		if(slideshowId) {
			var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
			for(var i = 0; i < externalControls.length; i++) {
				(function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
			}
		}
		// custom event to trigger selection of a new slide element
		slideshow.element.addEventListener('selectNewItem', function(event){
			// check if slide is already selected
			if(event.detail) {
				if(event.detail - 1 == slideshow.selectedSlide) return;
				showNewItem(slideshow, event.detail - 1, false);
			}
		});

		// keyboard navigation
		slideshow.element.addEventListener('keydown', function(event){
			if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
				slideshow.showNext();
			} else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
				slideshow.showPrev();
			}
		});
	};

	function navigateSlide(slideshow, event, keyNav) { 
		// user has interacted with the slideshow navigation -> update visible slide
		var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
		if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
			slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
			slideshow.moveFocus = true;
			updateAriaLive(slideshow);
		}
	};

	function initAnimationEndEvents(slideshow) {
		// remove animation classes at the end of a slide transition
		for( var i = 0; i < slideshow.items.length; i++) {
			(function(i){
				slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
				slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
			})(i);
		}
	};

	function resetAnimationEnd(slideshow, item) {
		setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
			if(Util.hasClass(item,'slideshow__item--selected')) {
				if(slideshow.moveFocus) Util.moveFocus(item);
				emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
				slideshow.moveFocus = false;
			}
			Util.removeClass(item, 'slideshow__item--'+slideshow.animationType+'-out-left slideshow__item--'+slideshow.animationType+'-out-right slideshow__item--'+slideshow.animationType+'-in-left slideshow__item--'+slideshow.animationType+'-in-right');
			item.removeAttribute('aria-hidden');
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass); 
		}, 100);
	};

	function showNewItem(slideshow, index, bool) {
		if(slideshow.items.length <= 1) return;
		if(slideshow.animating && slideshow.supportAnimation) return;
		slideshow.animating = true;
		Util.addClass(slideshow.element, slideshow.animatingClass); 
		if(index < 0) index = slideshow.items.length - 1;
		else if(index >= slideshow.items.length) index = 0;
		// skip slideshow item if it is hidden
		if(bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
			slideshow.animating = false;
			index = bool == 'next' ? index + 1 : index - 1;
			showNewItem(slideshow, index, bool);
			return;
		}
		// index of new slide is equal to index of slide selected item
		if(index == slideshow.selectedSlide) {
			slideshow.animating = false;
			return;
		}
		var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
		var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
		// transition between slides
		if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
		Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
		slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
		if(slideshow.animationOff) {
			Util.addClass(slideshow.items[index], 'slideshow__item--selected');
		} else {
			Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
		}
		// reset slider navigation appearance
		resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
		slideshow.selectedSlide = index;
		// reset autoplay
		slideshow.pauseAutoplay();
		slideshow.startAutoplay();
		// reset controls/navigation color themes
		resetSlideshowTheme(slideshow, index);
		// emit event
		emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
		if(slideshow.animationOff) {
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass);
		}
	};

	function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-out-right' : 'slideshow__item--'+slideshow.animationType+'-out-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-out-left' : 'slideshow__item--'+slideshow.animationType+'-out-right';
		}
		return className;
	};

	function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-in-right' : 'slideshow__item--'+slideshow.animationType+'-in-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-in-left' : 'slideshow__item--'+slideshow.animationType+'-in-right';
		}
		return className;
	};

	function resetSlideshowNav(slideshow, newIndex, oldIndex) {
		if(slideshow.navigation) {
			Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
			Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
			slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
			slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
		}
	};

	function resetSlideshowTheme(slideshow, newIndex) {
		var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
		if(dataTheme) {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
		} else {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
		}
	};

	function emitSlideshowEvent(slideshow, eventName, detail) {
		var event = new CustomEvent(eventName, {detail: detail});
		slideshow.element.dispatchEvent(event);
	};

	function updateAriaLive(slideshow) {
		slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
	};

	function externalControlSlide(slideshow, button) { // control slideshow using external element
		button.addEventListener('click', function(event){
			var index = button.getAttribute('data-index');
			if(!index || index == slideshow.selectedSlide + 1) return;
			event.preventDefault();
			showNewItem(slideshow, index - 1, false);
		});
	};

	Slideshow.defaults = {
    element : '',
    navigation : true,
    autoplay : false,
		autoplayOnHover: false,
    autoplayInterval: 5000,
    swipe: false
  };

	window.Slideshow = Slideshow;
	
	//initialize the Slideshow objects
	var slideshows = document.getElementsByClassName('js-slideshow');
	if( slideshows.length > 0 ) {
		for( var i = 0; i < slideshows.length; i++) {
			(function(i){
				var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
					autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
					autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
					autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
					swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false;
				new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayOnHover: autoplayOnHover, autoplayInterval : autoplayInterval, swipe : swipe});
			})(i);
		}
	}
}());
// File#: _2_sticky-sharebar
// Usage: codyhouse.co/license
(function() {
  var StickyShareBar = function(element) {
    this.element = element;
    this.contentTarget = document.getElementsByClassName('js-sticky-sharebar-target');
    this.showClass = 'sticky-sharebar--on-target';
    this.threshold = '50%'; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
    initShareBar(this);
  };

  function initShareBar(shareBar) {
    if(shareBar.contentTarget.length < 1) {
      Util.addClass(shareBar.element, shareBar.showClass);
      return;
    }
    if(intersectionObserverSupported) {
      initObserver(shareBar); // update anchor appearance on scroll
    } else {
      Util.addClass(shareBar.element, shareBar.showClass);
    }
  };

  function initObserver(shareBar) {
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        Util.toggleClass(shareBar.element, shareBar.showClass, entries[0].isIntersecting);
      }, 
      {rootMargin: "0px 0px -"+shareBar.threshold+" 0px"}
    );
    observer.observe(shareBar.contentTarget[0]);
  };

  //initialize the StickyShareBar objects
  var stickyShareBar = document.getElementsByClassName('js-sticky-sharebar'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  
	if( stickyShareBar.length > 0 ) {
		for( var i = 0; i < stickyShareBar.length; i++) {
			(function(i){ new StickyShareBar(stickyShareBar[i]); })(i);
    }
	}
}());
// File#: _2_table-of-contents
// Usage: codyhouse.co/license
(function() {
  var Toc = function(element) {
		this.element = element;
    this.list = this.element.getElementsByClassName('js-toc__list')[0];
    this.anchors = this.list.querySelectorAll('a[href^="#"]');
    this.sections = getSections(this);
    this.controller = this.element.getElementsByClassName('js-toc__control');
    this.controllerLabel = this.element.getElementsByClassName('js-toc__control-label');
    this.content = getTocContent(this);
    this.clickScrolling = false;
    this.intervalID = false;
    this.staticLayoutClass = 'toc--static';
    this.contentStaticLayoutClass = 'toc-content--toc-static';
    this.expandedClass = 'toc--expanded';
    this.isStatic = Util.hasClass(this.element, this.staticLayoutClass);
    this.layout = 'static';
    initToc(this);
  };

  function getSections(toc) {
    var sections = [];
    // get all content sections
    for(var i = 0; i < toc.anchors.length; i++) {
      var section = document.getElementById(toc.anchors[i].getAttribute('href').replace('#', ''));
      if(section) sections.push(section);
    }
    return sections;
  };

  function getTocContent(toc) {
    if(toc.sections.length < 1) return false;
    var content = toc.sections[0].closest('.js-toc-content');
    return content;
  };

  function initToc(toc) {
    checkTocLayour(toc); // switch between mobile and desktop layout
    if(toc.sections.length > 0) {
      // listen for click on anchors
      toc.list.addEventListener('click', function(event){
        var anchor = event.target.closest('a[href^="#"]');
        if(!anchor) return;
        // reset link apperance 
        toc.clickScrolling = true;
        resetAnchors(toc, anchor);
        // close toc if expanded on mobile
        toggleToc(toc, true);
      });

      // check when a new section enters the viewport
      var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
      if(intersectionObserverSupported) {
        var observer = new IntersectionObserver(
          function(entries, observer) { 
            entries.forEach(function(entry){
              if(!toc.clickScrolling) { // do not update classes if user clicked on a link
                getVisibleSection(toc);
              }
            });
          }, 
          {
            threshold: [0, 0.1],
            rootMargin: "0px 0px -70% 0px"
          }
        );

        for(var i = 0; i < toc.sections.length; i++) {
          observer.observe(toc.sections[i]);
        }
      }

      // detect the end of scrolling -> reactivate IntersectionObserver on scroll
      toc.element.addEventListener('toc-scroll', function(event){
        toc.clickScrolling = false;
      });
    }

    // custom event emitted when window is resized
    toc.element.addEventListener('toc-resize', function(event){
      checkTocLayour(toc);
    });

    // collapsed version only (mobile)
    initCollapsedVersion(toc);
  };

  function resetAnchors(toc, anchor) {
    if(!anchor) return;
    for(var i = 0; i < toc.anchors.length; i++) Util.removeClass(toc.anchors[i], 'toc__link--selected');
    Util.addClass(anchor, 'toc__link--selected');
  };

  function getVisibleSection(toc) {
    if(toc.intervalID) {
      clearInterval(toc.intervalID);
    }
    toc.intervalID = setTimeout(function(){
      var halfWindowHeight = window.innerHeight/2,
      index = -1;
      for(var i = 0; i < toc.sections.length; i++) {
        var top = toc.sections[i].getBoundingClientRect().top;
        if(top < halfWindowHeight) index = i;
      }
      if(index > -1) {
        resetAnchors(toc, toc.anchors[index]);
      }
      toc.intervalID = false;
    }, 100);
  };

  function checkTocLayour(toc) {
    if(toc.isStatic) return;
    toc.layout = getComputedStyle(toc.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(toc.element, toc.staticLayoutClass, toc.layout == 'static');
    if(toc.content) Util.toggleClass(toc.content, toc.contentStaticLayoutClass, toc.layout == 'static');
  };

  function initCollapsedVersion(toc) { // collapsed version only (mobile)
    if(toc.controller.length < 1) return;
    
    // toggle nav visibility
    toc.controller[0].addEventListener('click', function(event){
      var isOpen = Util.hasClass(toc.element, toc.expandedClass);
      toggleToc(toc, isOpen);
    });

    // close expanded version on esc
    toc.element.addEventListener('keydown', function(event){
      if(toc.layout == 'static') return;
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape') ) {
        toggleToc(toc, true);
        toc.controller[0].focus();
      }
    });
  };

  function toggleToc(toc, bool) { // collapsed version only (mobile)
    // toggle mobile version
    Util.toggleClass(toc.element, toc.expandedClass, !bool);
    bool ? toc.controller[0].removeAttribute('aria-expanded') : toc.controller[0].setAttribute('aria-expanded', 'true');
    if(!bool && toc.anchors.length > 0) {
      toc.anchors[0].focus();
    }
  };
  
  var tocs = document.getElementsByClassName('js-toc');

  var tocsArray = [];
	if( tocs.length > 0) {
		for( var i = 0; i < tocs.length; i++) {
			(function(i){ tocsArray.push(new Toc(tocs[i])); })(i);
    }

    // listen to window scroll -> reset clickScrolling property
    var scrollId = false,
      resizeId = false,
      scrollEvent = new CustomEvent('toc-scroll'),
      resizeEvent = new CustomEvent('toc-resize');
      
    window.addEventListener('scroll', function() {
      clearTimeout(scrollId);
      scrollId = setTimeout(doneScrolling, 100);
    });

    window.addEventListener('resize', function() {
      clearTimeout(resizeId);
      scrollId = setTimeout(doneResizing, 100);
    });

    function doneScrolling() {
      for( var i = 0; i < tocsArray.length; i++) {
        (function(i){tocsArray[i].element.dispatchEvent(scrollEvent)})(i);
      };
    };

    function doneResizing() {
      for( var i = 0; i < tocsArray.length; i++) {
        (function(i){tocsArray[i].element.dispatchEvent(resizeEvent)})(i);
      };
    };
  }
}());
// File#: _3_main-header-v2
// Usage: codyhouse.co/license
(function() {
	var Submenu = function(element) {
		this.element = element;
		this.trigger = this.element.getElementsByClassName('header-v2__nav-link')[0];
		this.dropdown = this.element.getElementsByClassName('header-v2__nav-dropdown')[0];
		this.triggerFocus = false;
		this.dropdownFocus = false;
		this.hideInterval = false;
		this.prevFocus = false; // nested dropdown - store element that was in focus before focus changed
		initSubmenu(this);
		initNestedDropdown(this);
	};

	function initSubmenu(list) {
		initElementEvents(list, list.trigger);
		initElementEvents(list, list.dropdown);
	};

	function initElementEvents(list, element, bool) {
		element.addEventListener('focus', function(){
			bool = true;
			showDropdown(list);
		});
		element.addEventListener('focusout', function(event){
			bool = false;
			hideDropdown(list, event);
		});
	};

	function showDropdown(list) {
		if(list.hideInterval) clearInterval(list.hideInterval);
		Util.addClass(list.dropdown, 'header-v2__nav-list--is-visible');
		resetDropdownStyle(list.dropdown, true);
	};

	function hideDropdown(list, event) {
		if(list.hideInterval) clearInterval(this.hideInterval);
		list.hideInterval = setTimeout(function(){
			var submenuFocus = document.activeElement.closest('.header-v2__nav-item--main'),
				inFocus = submenuFocus && (submenuFocus == list.element);
			if(!list.triggerFocus && !list.dropdownFocus && !inFocus) { // hide if focus is outside submenu
				Util.removeClass(list.dropdown, 'header-v2__nav-list--is-visible');
				resetDropdownStyle(list.dropdown, false);
				hideSubLevels(list);
				list.prevFocus = false;
			}
		}, 100);
	};

	function initNestedDropdown(list) {
		var dropdownMenu = list.element.getElementsByClassName('header-v2__nav-list');
		for(var i = 0; i < dropdownMenu.length; i++) {
			var listItems = dropdownMenu[i].children;
			// bind hover
	    new menuAim({
	      menu: dropdownMenu[i],
	      activate: function(row) {
	      	var subList = row.getElementsByClassName('header-v2__nav-dropdown')[0];
	      	if(!subList) return;
	      	Util.addClass(row.querySelector('a.header-v2__nav-link'), 'header-v2__nav-link--hover');
	      	showLevel(list, subList);
	      },
	      deactivate: function(row) {
	      	var subList = row.getElementsByClassName('header-v2__nav-dropdown')[0];
	      	if(!subList) return;
	      	Util.removeClass(row.querySelector('a.header-v2__nav-link'), 'header-v2__nav-link--hover');
	      	hideLevel(list, subList);
	      },
	      exitMenu: function() {
	        return true;
	      },
	      submenuSelector: '.header-v2__nav-item--has-children',
	    });
		}
		// store focus element before change in focus
		list.element.addEventListener('keydown', function(event) { 
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				list.prevFocus = document.activeElement;
			}
		});
		// make sure that sublevel are visible when their items are in focus
		list.element.addEventListener('keyup', function(event) {
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				// focus has been moved -> make sure the proper classes are added to subnavigation
				var focusElement = document.activeElement,
					focusElementParent = focusElement.closest('.header-v2__nav-dropdown'),
					focusElementSibling = focusElement.nextElementSibling;

				// if item in focus is inside submenu -> make sure it is visible
				if(focusElementParent && !Util.hasClass(focusElementParent, 'header-v2__nav-list--is-visible')) {
					showLevel(list, focusElementParent);
				}
				// if item in focus triggers a submenu -> make sure it is visible
				if(focusElementSibling && !Util.hasClass(focusElementSibling, 'header-v2__nav-list--is-visible')) {
					showLevel(list, focusElementSibling);
				}

				// check previous element in focus -> hide sublevel if required 
				if( !list.prevFocus) return;
				var prevFocusElementParent = list.prevFocus.closest('.header-v2__nav-dropdown'),
					prevFocusElementSibling = list.prevFocus.nextElementSibling;
				
				if( !prevFocusElementParent ) return;
				
				// element in focus and element prev in focus are siblings
				if( focusElementParent && focusElementParent == prevFocusElementParent) {
					if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
					return;
				}

				// element in focus is inside submenu triggered by element prev in focus
				if( prevFocusElementSibling && focusElementParent && focusElementParent == prevFocusElementSibling) return;
				
				// shift tab -> element in focus triggers the submenu of the element prev in focus
				if( focusElementSibling && prevFocusElementParent && focusElementSibling == prevFocusElementParent) return;
				
				var focusElementParentParent = focusElementParent.parentNode.closest('.header-v2__nav-dropdown');
				
				// shift tab -> element in focus is inside the dropdown triggered by a siblings of the element prev in focus
				if(focusElementParentParent && focusElementParentParent == prevFocusElementParent) {
					if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
					return;
				}
				
				if(prevFocusElementParent && Util.hasClass(prevFocusElementParent, 'header-v2__nav-list--is-visible')) {
					hideLevel(list, prevFocusElementParent);
				}
			}
		});
	};

	function hideSubLevels(list) {
		var visibleSubLevels = list.dropdown.getElementsByClassName('header-v2__nav-list--is-visible');
		if(visibleSubLevels.length == 0) return;
		while (visibleSubLevels[0]) {
			hideLevel(list, visibleSubLevels[0]);
	 	}
	 	var hoveredItems = list.dropdown.getElementsByClassName('header-v2__nav-link--hover');
	 	while (hoveredItems[0]) {
			Util.removeClass(hoveredItems[0], 'header-v2__nav-link--hover');
	 	}
	};

	function showLevel(list, level, bool) {
		if(bool == undefined) {
			//check if the sublevel needs to be open to the left
			Util.removeClass(level, 'header-v2__nav-dropdown--nested-left');
			var boundingRect = level.getBoundingClientRect();
			if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) Util.addClass(level, 'header-v2__nav-dropdown--nested-left');
		}
		Util.addClass(level, 'header-v2__nav-list--is-visible');
	};

	function hideLevel(list, level) {
		if(!Util.hasClass(level, 'header-v2__nav-list--is-visible')) return;
		Util.removeClass(level, 'header-v2__nav-list--is-visible');
		
		level.addEventListener('transition', function cb(){
			level.removeEventListener('transition', cb);
			Util.removeClass(level, 'header-v2__nav-dropdown--nested-left');
		});
	};

	var mainHeader = document.getElementsByClassName('js-header-v2');
	if(mainHeader.length > 0) {
		var menuTrigger = mainHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){ // toggle menu visibility an small devices
			Util.toggleClass(document.getElementsByClassName('header-v2__nav')[0], 'header-v2__nav--is-visible', event.detail);
			Util.toggleClass(mainHeader[0], 'header-v2--expanded', event.detail);
			menuTrigger.setAttribute('aria-expanded', event.detail);
			if(event.detail) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		});

		// take care of submenu
		var mainList = mainHeader[0].getElementsByClassName('header-v2__nav-list--main');
		if(mainList.length > 0) {
			for( var i = 0; i < mainList.length; i++) {
				(function(i){
					new menuAim({ // use diagonal movement detection for main submenu
			      menu: mainList[i],
			      activate: function(row) {
			      	var submenu = row.getElementsByClassName('header-v2__nav-dropdown');
			      	if(submenu.length == 0 ) return;
			      	Util.addClass(submenu[0], 'header-v2__nav-list--is-visible');
			      	resetDropdownStyle(submenu[0], true);
			      },
			      deactivate: function(row) {
			      	var submenu = row.getElementsByClassName('header-v2__nav-dropdown');
			      	if(submenu.length == 0 ) return;
			      	Util.removeClass(submenu[0], 'header-v2__nav-list--is-visible');
			      	resetDropdownStyle(submenu[0], false);
			      },
			      exitMenu: function() {
			        return true;
			      },
			      submenuSelector: '.header-v2__nav-item--has-children',
			      submenuDirection: 'below'
			    });

			    // take care of focus event for main submenu
					var subMenu = mainList[i].getElementsByClassName('header-v2__nav-item--main');
					for(var j = 0; j < subMenu.length; j++) {(function(j){if(Util.hasClass(subMenu[j], 'header-v2__nav-item--has-children')) new Submenu(subMenu[j]);})(j);};
				})(i);
			}
		}

		// if data-animation-offset is set -> check scrolling
		var animateHeader = mainHeader[0].getAttribute('data-animation');
		if(animateHeader && animateHeader == 'on') {
			var scrolling = false,
				scrollOffset = (mainHeader[0].getAttribute('data-animation-offset')) ? parseInt(mainHeader[0].getAttribute('data-animation-offset')) : 400,
				mainHeaderHeight = mainHeader[0].offsetHeight,
				mainHeaderWrapper = mainHeader[0].getElementsByClassName('header-v2__wrapper')[0];

			window.addEventListener("scroll", function(event) {
				if( !scrolling ) {
					scrolling = true;
					(!window.requestAnimationFrame) ? setTimeout(function(){checkMainHeader();}, 250) : window.requestAnimationFrame(checkMainHeader);
				}
			});

			function checkMainHeader() {
				var windowTop = window.scrollY || document.documentElement.scrollTop;
				Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--is-fixed', windowTop >= mainHeaderHeight);
				Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--slides-down', windowTop >= scrollOffset);
				scrolling = false;
			};
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-header-v2')) menuTrigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(mainHeader[0], 'header-v2--expanded')) menuTrigger.click();
		};

		function getMenuFirstFocusable() {
			var focusableEle = mainHeader[0].getElementsByClassName('header-v2__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
		};
	}

	function resetDropdownStyle(dropdown, bool) {
		if(!bool) {
			dropdown.addEventListener('transitionend', function cb(){
				dropdown.removeAttribute('style');
				dropdown.removeEventListener('transitionend', cb);
			});
		} else {
			var boundingRect = dropdown.getBoundingClientRect();
			if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) {
				var left = parseFloat(window.getComputedStyle(dropdown).getPropertyValue('left'));
				dropdown.style.left = (left + window.innerWidth - boundingRect.right - 5) + 'px';
			}
		}
	};

	function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};
}());