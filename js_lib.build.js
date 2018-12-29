// @name: js_lib
// @version: 3.0.1b
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

var js_lib = {
	version: '3.0.1b',
	timestamp: '2006-11-01 19:29:52',
	website: 'http://neo-geek.net/js_lib/',
	author: {
		name: 'Neo Geek',
		email: 'neo@neo-geek.net',
		website: 'http://neo-geek.net/'
	}
};

// @name: Object.extend
// @syntax: Object.extend(object destination, function source);
// @dependencies: none

Object.extend = function(destination, source) {
	for (property in source) { destination[property] = source[property]; }
	return destination;
};

// @name: addLoadEvent
// @syntax: addLoadEvent(function func);
// @dependencies: addEvent

var addLoadEvent = function(func) {
	return addEvent('load', function() { func(); }, window);
};

// @name: addEvent
// @syntax: addEvent(string method, function func [, object object]);
// @dependencies: none

function addEvent(method, func, object) {
	object = object || document;
	if (object.addEventListener) { return object.addEventListener(method, func, false); }
	else if (object.attachEvent) { return object.attachEvent('on' + method, func); }
	else { return object['on' + method] = func; }
	return false;
}

// @name: removeEvent
// @syntax: removeEvent(string method, function func [, object object]);
// @dependencies: none

function removeEvent(method, func, object) {
	object = object || document;
	if (object.removeEventListener) { object.removeEventListener(method, func, false);	 }
	else if (object.detachEvent) { return object.detachEvent('on' + method, func); }
	else { return object['on' + method] = function() { }; }
	return false;
}

// @name: $
// @syntax: $(string object [, object container]);
// @dependencies: getElementsByAttribName

function $(object, container) {

	container = container || document;

	if (typeof(object) == 'string' && container.getElementById && container.getElementById(object)) { return container.getElementById(object); }
	else if (typeof(object) == 'string' && getElementsByAttribName(object, 'name', container)) { return getElementsByAttribName(object, 'name', container)[0]; }
	else if (typeof(object) == 'string' && getElementsByAttribName(object, 'class', container)) { return getElementsByAttribName(object, 'class', container)[0]; }
	else if (typeof(object) == 'object') { return object; }

	return false;

};

// @name: $$
// @syntax: $$(array objects [, object container]);
// @dependencies: getElementsByAttribName

function $$(objects, container) {

	var elements = Array();
	if (typeof(objects) != 'object') { objects = Array(objects); }
	container = container || document;

	for (var i = 0; i < objects.length; i++) {
		if (typeof(objects[i]) == 'string' && container.getElementById && container.getElementById(objects[i])) { elements = elements.concat(container.getElementById(objects[i])); }
		else if (typeof(objects[i]) == 'string' && getElementsByAttribName(objects[i], 'name', container)) { elements = elements.concat(getElementsByAttribName(objects[i], 'name', container)); }
		else if (typeof(objects[i]) == 'string' && getElementsByAttribName(objects[i], 'class', container)) { elements = elements.concat(getElementsByAttribName(objects[i], 'class', container)); }
	 	else if (typeof(objects[i]) == 'object') { return objects[i]; }
	}

	return elements.length?elements:false;

};

// @name: getElementsByAttribName
// @syntax: getElementsByAttribName(string value [, string attrib, object container]);
// @dependencies: none

function getElementsByAttribName(value, attrib, container) {

	attrib = attrib || 'name';
	container = container || document;

	var children = container.getElementsByTagName('*') || container.all;
	var elements = Array();

	if (Browser.Type() == 'ie' && attrib == 'class') { attrib = 'className'; }

	for (var i = 0; i < children.length; i++) {
		if (children[i].getAttribute(attrib) && children[i].getAttribute(attrib).split(' ').search(value, true)) { elements.push(children[i]); }
	}

	return elements.length?elements:false;

};

// @name: setStyleAttribute
// @syntax: setStyleAttribute(object object, string value);
// @dependencies: forEach, String.trim, String.camelize

function setStyleAttribute(object, value) {

	forEach(value.split(';'), function(key, value) { object.style[value.split(':')[0].trim().camelize()] = value.split(':')[1].trim(); });

	return false;

};

// @name: forEach
// @syntax: forEach(array array, function func);
// @dependencies: Array.search

function forEach(array, func) {

	for (var key in array) {
		if (Array('string', 'number', 'object').search(typeof(array[key])) && array[key]) { func(key, array[key]); }
	}

	return false;

};

// @name: hitTest
// @syntax: hitTest(object object, function func);
// @dependencies: Object.get_pos

function hitTest(object, func) {

	object = $(object);

	if (!object && typeof(func) != 'function') { return false; }

	var pos = object.get_pos();

	if (document.mouseX > pos[0] && document.mouseX < pos[0] + object.get('width') &&
	    document.mouseY > pos[1] && document.mouseY < pos[1] + object.get('height')) { return func(); }

	return false;

};

var Elements = new Object();

Object.extend(Elements, {

	// @name: Object.create
	// @syntax: Object.create(string tag);
	// @dependencies: none

	create: function(tag) {
		var element = document.createElement(tag);
		this.appendChild(element);
		return element;
	},

	// @name: Object.empty
	// @syntax: Object.empty();
	// @dependencies: none

	empty: function() {
		return this.innerHTML = '';
	},

	// @name: Object.get
	// @syntax: Object.get(string type [, string value]);
	// @dependencies: Object.get, Array.search, Object.get_style, Object.get_pos

	get: function(type, value) {
		if (type == 'width') { return parseInt(this.get('innerWidth')) || 0; }
		else if (type == 'height') { return parseInt(this.get('innerHeight')) || 0; }
		else if (type == 'class' && !value) { return this.className.split(' '); }
		else if (type == 'class' && value) { return this.className.split(' ').search(value)?true:false; }
		else if (type == 'opacity') { if (Browser.Type() == 'ie') { return parseInt(this.style.filter.substring(this.style.filter.indexOf('opacity'), this.style.filter.indexOf(')', this.style.filter.indexOf('opacity') + 8))) || 100; } else { return this.get_style('opacity') * 100; } }
		else if (type == 'offsetWidth') { return parseInt(this.offsetWidth); }
		else if (type == 'offsetHeight') { return parseInt(this.offsetHeight); }
		else if (type == 'top') { var pos = this.get_pos(); return parseInt(pos[1]) - parseInt(this.get_style('margin-top')) || 0; }
		else if (type == 'left') { var pos = this.get_pos(); return parseInt(pos[0]) - parseInt(this.get_style('margin-left')) || 0; }
		else if (type == 'margin-top') { return parseInt(this.get_style('margin-top')) || 0; }
		else if (type == 'margin-left') { return parseInt(this.get_style('margin-left')) || 0; }
		else if (type == 'position') { return this.style.position || 'relative'; }
		else if (type == 'background') { return String(this.get_style('background-color')) != 'transparent'?this.get_style('background-color').substring(4).substring(0, this.get_style('background-color').substring(4).length - 1).split(', '):this.parentNode.get_style('background-color'); }
		else if (type == 'innerWidth') { return this.get('offsetWidth') - parseInt(this.get_style('padding-left')) - parseInt(this.get_style('padding-right')) - parseInt(this.get_style('border-left-width')) - parseInt(this.get_style('border-left-width')); }
		else if (type == 'innerHeight') { return this.get('offsetHeight') - parseInt(this.get_style('padding-top')) - parseInt(this.get_style('padding-bottom')) - parseInt(this.get_style('border-top-width')) - parseInt(this.get_style('border-bottom-width')); }
		else if (type == 'type') { return String(this).substr(String(this).indexOf(' ') + 1, String(this).length - String(this).indexOf(' ') - 2).toLowerCase(); }
		else { return this.get_style(type); }
	},

	// @name: Object.get_pos
	// @syntax: Object.get_pos();
	// @dependencies: none
	// @note: The warning caused by this function is unavoidable to achieve what this function does.

	get_pos: function() {

		var object = this;

		var x = object.offsetLeft;
		var y = object.offsetTop;

		if (object.offsetParent) {
			while (object = object.offsetParent) {
				x += object.offsetLeft;
				y += object.offsetTop;
			}
		}

		return [x,y];

	},

	// @name: Object.get_style
	// @syntax: Object.get_style(string name);
	// @dependencies: String.camelize

	get_style: function(name) {
		if (this.currentStyle) { return this.currentStyle[name.camelize()] || ''; }
		else if (this.style && this.style[name.camelize()]) { return this.style[name.camelize()]; }
		else if (document.defaultView) { return document.defaultView.getComputedStyle(this, null).getPropertyValue(name) || ''; }
		else { return 0; }
	},

	// @name: Object.hide
	// @syntax: Object.hide();
	// @dependencies: none

	hide: function() {
		if (!this.style) { this.style = ''; }
		return this.style.display = 'none';
	},

	// @name: Object.remove
	// @syntax: Object.remove();
	// @dependencies: none

	remove: function() {
		return this.parentNode?this.parentNode.removeChild(this):false;
	},

	// @name: Object.remove
	// @syntax: Object.remove();
	// @dependencies: none

	replaceNode: function(object) {
		return this.parentNode?this.parentNode.replaceChild(object, this):false;
	},

	// @name: Object.scroll
	// @syntax: Object.scroll(integer offset);
	// @dependencies: none

	scroll: function(offset) {
		var pos = this.get_pos();
		return window.scrollTo(0, Math.abs(pos[1] + parseInt(offset || 0)));
	},

	// @name: Object.show
	// @syntax: Object.show();
	// @dependencies: none

	show: function() {
		if (!this.style) { this.style = ''; }
		return this.style.display = '';
	},

	// @name: Object.set
	// @syntax: Object.set(string type, string value);
	// @dependencies: Object.get, Browser.Type, Array.rgbtohex

	set: function(type, value) {
		if (!type || !value) { return false; }
		if (type == 'width') { return this.style.width = parseInt(value) + 'px'; }
		else if (type == 'height') { return this.style.height = parseInt(value) + 'px'; }
		else if (type == 'class') { return !this.get(type, value)?this.className += ' ' + value:false; }
		else if (type == 'opacity') { if (Browser.Type() == 'ie') { return this.style.filter = 'alpha(opacity:' + value + ')'; } else { return this.style.opacity = parseInt(String(value)) / 100; } }
		else if (type == 'top') { return this.style.top = value + 'px'; }
		else if (type == 'left') { return this.style.left = value + 'px'; }
		else if (type == 'margin-left') { return this.style.marginLeft = value + 'px'; }
		else if (type == 'margin-top') { return this.style.marginTop = value + 'px'; }
		else if (type == 'background') { if (typeof(value) == 'object') { value = value.rgbtohex(); } return this.style.backgroundColor = value; }
		else if (type == 'font-color') { if (typeof(value) == 'object') { value = value.rgbtohex(); } return this.style.color = value; }
		else if (type == 'position') { return this.style.position = value; }
		else if (type == 'visibility') { return this.style.visibility = value; }
		else if (type == 'overflow') { return this.style.overflow = value; }
		return false;
	},

	// @name: Object.toggle
	// @syntax: Object.toggle();
	// @dependencies: Object.visible, Object.hide, Object.show

	toggle: function() {
		return this.visible()?this.hide():this.show();
	},

	// @name: Object.visible
	// @syntax: Object.visible();
	// @dependencies: none

	visible: function() {
		return !this.style.display || this.style.display != 'none'?true:false;
	}

});

Object.extend(Object.prototype, Elements);

addEvent('load', function() {

	if (Browser.Type() == 'ie') {
		var elements = document.getElementsByTagName('body')[0].getElementsByTagName('*');
		for (var i = 0; i < elements.length; i++) { Object.extend(elements[i], Elements); }
	}

}, window);

Object.extend(String.prototype, {

	// @name: String.camelize
	// @syntax: String.camelize();
	// @dependencies: String.ucwords

	camelize: function() {
		var subject = this.str_replace('-', ' ').ucwords().str_replace(' ', '');
		return subject.substring(0, 1).toLowerCase() + subject.substring(1);
	},

	// @name: String.hextorgb
	// @syntax: String.hextorgb();
	// @dependencies: String.str_split

	hextorgb: function() {
		var subject = this.toUpperCase().replace('#', '').str_split(2);
		return Array(parseInt(subject[0], 16), parseInt(subject[1], 16), parseInt(subject[2], 16));
	},

	// @name: String.strip_tags
	// @syntax: String.strip_tags();
	// @dependencies: none

	strip_tags: function() {
		return this.replace(/<(\/)?[^>]+( \/)?>/gi, '');
	},

	// @name: String.str_replace
	// @syntax: String.str_replace(array search, array replace);
	// @dependencies: none

	str_replace: function(search, replace) {

		var subject = this;

		if (typeof(search) == 'string') { search = Array(search); }
		if (typeof(replace) == 'string') { replace = Array(replace); }

		for (var i = 0; i < search.length; i++) {
			while (subject.indexOf(search[i]) > -1) { subject = subject.replace(search[i] || '', replace[i] || ''); }
		}

		return subject;

	},

	// @name: String.str_repeat
	// @syntax: String.str_repeat(integer length);
	// @dependencies: none

	str_repeat: function(length) {
		var subject = this;
		for (var i = 1; i < length; i++) { subject += this; }
		return subject;
	},

	// @name: String.str_pad
	// @syntax: String.str_pad(integer length, string string [, string type]);
	// @dependencies: String.str_repeat

	str_pad: function(length, string, type) {

		var subject = this;
		type = type || 'STR_PAD_RIGHT';

		if (subject.length < length) {
			length = length - subject.length;
			if (type == 'STR_PAD_LEFT') { subject = String(string).str_repeat(length) + subject; }
			else if (type == 'STR_PAD_RIGHT') { subject = subject + String(string).str_repeat(length); }
			else if (type == 'STR_PAD_BOTH') { subject = String(string).str_repeat(length / 2) + subject + String(string).str_repeat(length / 2); }
		}

		return subject;

	},

	// @name: String.str_split
	// @syntax: String.str_split(integer length);
	// @dependencies: none

	str_split: function(length) {

		var subject = this;
		var results = Array();

		while (subject) {
			if (subject.substring(0, length)) { results.push(subject.substring(0, length)); }
			subject = subject.substring(length);
		}

		return results;

	},

	// @name: String.trim
	// @syntax: String.trim();
	// @dependencies: none

	trim: function() {
		return this.replace(/^\s*|\s*$/g, '');
	},

	// @name: String.ucwords
	// @syntax: String.ucwords();
	// @dependencies: none

	ucwords: function() {
		var subject = this.split(' ');
		for (var i = 0; i < subject.length; i++) { subject[i] = subject[i].substring(0, 1).toUpperCase() + subject[i].substring(1); }
		return subject.join(' ');
	},

	// @name: String.urlencode
	// @syntax: String.urlencode();
	// @dependencies: none

	urlencode: function() {
		return encodeURIComponent(this);
	},

	// @name: String.urldecode
	// @syntax: String.urldecode();
	// @dependencies: none

	urldecode: function() {
		return decodeURIComponent(this);
	},

	// @name: String.validate
	// @syntax: String.validate(string type);
	// @dependencies: none

	validate: function(type) {
		if (type == 'empty') { return !String(this)?true:false; }
		else if (type == 'number') { return this.match(/^[.0-9]+$/)?true:false; }
		else if (type == 'email') { return this.match(/^([-.a-zA-Z0-9])+(@)+([-.a-zA-Z])+(.)+([a-zA-Z])$/)?true:false; }
		else if (type == 'website') { return this.match(/^(http:\/\/)+([-.a-zA-Z])/)?true:false; }
		return false;
	}

});

Object.extend(Array.prototype, {

	// @name: Array.add
	// @syntax: Array.add(string value [, boolean unique]);
	// @dependencies: Array.unique

	add: function(value, unique) {
		this.push(value);
		if (unique) { return this.unique(); }
		return this;
	},

	// @name: Array.clear
	// @syntax: Array.clear();
	// @dependencies: none

	clear: function() {
		return this.length = 0;
	},

	// @name: Array.first
	// @syntax: Array.first();
	// @dependencies: none

	first: function() {
		return this[0];
	},

	// @name: Array.last
	// @syntax: Array.last([integer offset]);
	// @dependencies: none

	last: function(offset) {
		return this[this.length - 1 + (offset || 0)];
	},

	// @name: Array.rgbtohex
	// @syntax: Array.rgbtohex();
	// @dependencies: Math.remainder

	rgbtohex: function() {
		var output = '';
		var hex = '0123456789ABCDEF'.str_split(1);
		for (var i = 0; i < this.length; i++) { output += hex[Math.floor(Math.round(this[i]) / 16)] + hex[Math.remainder(Math.round(this[i]) / 16) * 16]; }
		return output?'#' + output:false;
	},

	// @name: Array.remove
	// @syntax: Array.remove(string value);
	// @dependencies: none

	remove: function(value) {
		var array = Array();
		for (var i = 0; i < this.length; i++) {
			if (this[i] != value) { array.push(this[i]); }
		}
		return array;
	},

	// @name: Array.search
	// @syntax: Array.search(string value [, boolean strict]);
	// @dependencies: none

	search: function(value, strict) {
		var results = Array();
		strict = strict || true;
		for (var i = 0; i < this.length; i++) {
			if (typeof(this[i]) != 'object' && (strict && String(this[i]) == String(value) || !strict && String(this[i]).indexOf(String(value)) != -1)) { results.push(String(this[i])); }
			else if (typeof(this[i]) == 'object' && this[i].search(value)) { results.push(this[i].search(value)); }
		}
		return results.length?results:false;
	},

	// @name: Array.sum
	// @syntax: Array.sum();
	// @dependencies: none

	sum: function() {
		var output = 0;
		for (var i = 0; i < this.length; i++) { output += Number(this[i]); }
		return output;
	},

	// @name: Array.update
	// @syntax: Array.update(integer key, string value);
	// @dependencies: none

	update: function(key, value) {
		this[key] = value;
		return this;
	},

	// @name: Array.unique
	// @syntax: Array.unique();
	// @dependencies: Array.search

	unique: function() {
		var array = Array();
		for (var i = 0; i < this.length; i++) {
			if (!array.search(this[i], true)) { array.push(this[i]); }
		}
		return array;
	}

});

// @name: Math
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

Object.extend(Math, {

	// @name: Math.remainder
	// @syntax: Math.remainder(integer num)
	// @dependencies: none

	remainder: function(num) {
		return Number(num) % 1;
	}

});

// @name: AJAX
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var AJAX = {

	// @name: AJAX.options
	// @syntax: AJAX.options(array options);
	// @dependencies: none

	options: {
		method: 'get', // post
		asynchronous: true,
		contentType: 'text/plain', // application/x-www-form-urlencoded
		parameters: '',
		onstart: function(http) { },
		onload: function(http) { },
		onerror: function(http) { }
	},

	// @name: AJAX.Option
	// @syntax: AJAX.Option(string key, string value);
	// @dependencies: AJAX.options

	Option: function(key, value) { return value || this.options[key]; },

	// @name: AJAX.Request
	// @syntax: AJAX.Request(string url [, array options]);
	// @dependencies: AJAX.Option

	Request: function(url, options) {
		options = options || Array();
		var http = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
		http.onreadystatechange = function() {
			if (http.readyState == 1) { return AJAX.Option('onstart', options.onstart || '')(http); }
			else if (http.readyState == 4 && http.status == 200) { return AJAX.Option('onload', options.onload || '')(http); }
			else if (http.readyState == 4 && http.status == 404) { return AJAX.Option('onerror', options.onerror || '')(http); }
			return false;
		}
		http.open(AJAX.Option('method', options.method || ''), url, AJAX.Option('asynchronous', options.asynchronous || ''));
		http.setRequestHeader('Content-Type', AJAX.Option('contentType', options.contentType || ''));
		http.send(AJAX.Option('parameters', options.parameters || ''));
		return false;
	}

};

// @name: Browser
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var Browser = {

	nav: navigator.userAgent,

	// @name: Browser.Type
	// @syntax: Browser.Type();
	// @dependencies: none

	Type: function() {
		if (this.nav.indexOf('Firefox') != -1) { return 'moz'; }
		else if (this.nav.indexOf('Flock') != -1) { return 'moz'; }
		else if (this.nav.indexOf('Camino') != -1) { return 'moz'; }
		else if (this.nav.indexOf('Opera') != -1) { return 'opera'; }
		else if (this.nav.indexOf('MSIE') != -1) { return 'ie'; }
		else if (this.nav.indexOf('Safari') != -1) { return 'safari'; }
		else if (this.nav.indexOf('Netscape') != -1) { return 'netscape'; }
		else { return this.nav; }
	}

};

// @name: Cookies
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var Cookies = {

	// @name: Cookies.Create
	// @syntax: Cookies.Create(string name, string value [, integer days, string path]);
	// @dependencies: Cookies.Retrieve

	Create: function(name, value, days, path) {

		days = days || 1;
		path = path || '/';

		var date = new Date;
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		date = date.toGMTString();

		document.cookie = name + '=' + value + ';expires=' + date + ';path=' + path;

		return Cookies.Retrieve(name);

	},

	// @name: Cookies.Retrieve
	// @syntax: Cookies.Retrieve(string name);
	// @dependencies: forEach

	Retrieve: function(name) {

		var stored = Array();

		forEach(document.cookie.split(';'), function(key, value) { stored[value.substring(0, value.indexOf('=')).replace(/^\s*|\s*$/g,'')] = value.substring(value.indexOf('=') + 1); });

		return stored[name] || false;

	},

	// @name: Cookies.Remove
	// @syntax: Cookies.Remove(string name);
	// @dependencies: Cookies.Create

	Remove: function(name) { return Cookies.Create(name, '', 0); }

};

// @name: Date.BuildCalendar
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

Object.extend(Date, {

	months: Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	days: Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),

	// @name: Date.BuildCalendar
	// @syntax: Date.BuildCalendar([array options]);
	// @dependencies: String.str_pad

	BuildCalendar: function(options) {

		options = options || Array();
		var output = '';

		options.container = options.container || 'calendar';

		var now = options.date || new Date();
		var year = now.getFullYear();
		var month = now.getMonth();
		var date = now.getDate();
		var day_count = 32 - new Date(now.getFullYear(), now.getMonth(), 32).getDate();
		var week_start = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
		var day_count_live = 1;


		var table = document.createElement('table');
		var table_body = document.createElement('tbody');
		var table_header = document.createElement('tr');


		var table_column = document.createElement('th');
		var table_contents = document.createElement('a');

		table_contents.style.cursor = 'pointer';
		table_contents.onclick = function() {
			$(options.container).innerHTML = '';
			$(options.container).appendChild(Date.BuildCalendar({date:new Date(year - 1, month, 1), container:options.container, onclick:options.onclick || function() {}}));
			return false;
		};
		table_contents.innerHTML = '&#171;';

		table_column.appendChild(table_contents);
		table_header.appendChild(table_column);


		var table_column = document.createElement('th');
		var table_contents = document.createElement('a');

		table_contents.style.cursor = 'pointer';
		table_contents.onclick = function() {
			$(options.container).empty();
			$(options.container).appendChild(Date.BuildCalendar({date:new Date(year, month - 1, 1), container:options.container, onclick:options.onclick || function() {}}));
			return false;
		};
		table_contents.innerHTML = '&#8249;';

		table_column.appendChild(table_contents);
		table_header.appendChild(table_column);


		var table_column = document.createElement('th');
		var table_contents = document.createElement('span');

		table_column.colSpan = 3;
		table_contents.align = 'center';
		table_contents.innerHTML = this.months[month].substring(0, 3) + ' ' + year;

		table_column.appendChild(table_contents);
		table_header.appendChild(table_column);


		var table_column = document.createElement('th');
		var table_contents = document.createElement('a');

		table_contents.style.cursor = 'pointer';
		table_contents.onclick = function() {
			$(options.container).empty();
			$(options.container).appendChild(Date.BuildCalendar({date:new Date(year, month + 1, 1), container:options.container, onclick:options.onclick || function() {}}));
			return false;
		};
		table_contents.innerHTML = '&#8250;';

		table_column.appendChild(table_contents);
		table_header.appendChild(table_column);


		var table_column = document.createElement('th');
		var table_contents = document.createElement('a');

		table_contents.style.cursor = 'pointer';
		table_contents.onclick = function() {
			$(options.container).empty();
			$(options.container).appendChild(Date.BuildCalendar({date:new Date(year + 1, month, 1), container:options.container, onclick:options.onclick || function() {}}));
			return false;
		};
		table_contents.innerHTML = '&#187;';

		table_column.appendChild(table_contents);
		table_header.appendChild(table_column);

		table_body.appendChild(table_header);


		var table_header = document.createElement('tr');

		for (var i = 0; i < this.days.length; i++) {

			var table_column = document.createElement('th');
			var table_contents = document.createTextNode(this.days[i].substring(0, 3));

			table_column.appendChild(table_contents);
			table_header.appendChild(table_column);

		}

		table_body.appendChild(table_header);


		var table_header = document.createElement('tr');

		for (var i = 0; i < week_start; i++) {

			var table_column = document.createElement('td');
			var table_contents = document.createTextNode(' ');

			table_column.appendChild(table_contents);
			table_header.appendChild(table_column);

		}

		for (var i = week_start; i < 7; i++) {

			var table_column = document.createElement('td');
			var table_contents = document.createTextNode(day_count_live);

			table_column.dateID = year + '-' + String(month + 1).str_pad(2, '0', 'STR_PAD_LEFT') + '-' + String(day_count_live).str_pad(2, '0', 'STR_PAD_LEFT');
			table_column.onclick = options.onclick?function() { options.onclick(this.dateID); }:function() { };
			day_count_live++;

			table_column.appendChild(table_contents);
			table_header.appendChild(table_column);

		}

		table_body.appendChild(table_header);


		while (day_count_live < day_count) {

			var table_header = document.createElement('tr');

			for (var i = 0; i < 7; i++) {

				var table_column = document.createElement('td');

				if (day_count_live <= day_count) {

					var table_contents = document.createTextNode(day_count_live);

					table_column.dateID = year + '-' + String(month + 1).str_pad(2, '0', 'STR_PAD_LEFT') + '-' + String(day_count_live).str_pad(2, '0', 'STR_PAD_LEFT');
					table_column.onclick = options.onclick?function() { options.onclick(this.dateID); }:function() { };

					day_count_live++;

				} else { var table_contents = document.createTextNode(' '); }

				table_column.appendChild(table_contents);
				table_header.appendChild(table_column);

			}

			table_body.appendChild(table_header);

		}


		table.appendChild(table_body);

		return table;

	}

});

// @name: Form
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var Form = {

	// @name: Form.Capture
	// @syntax: Form.Capture(object object [, boolean updated]);
	// @dependencies: Array.search

	Capture: function(object, updated) {

		object = $(object);
		updated = updated || false;

		if (!object) { return false; }

		var query = '';
		var form = object.getElementsByTagName('*');

		for (var i = 0; i < form.length; i++) {

			if (Array('input', 'textarea').search(form[i].nodeName.toLowerCase()) && Array('checkbox', 'radiobox').search(form[i].type, true)) {

				if ((!updated || form[i].checked != form[i].defaultChecked) && !form[i].checked) { query += form[i].name + '=&'; }
				else if ((!updated || form[i].checked != form[i].defaultChecked) && form[i].checked) { query += form[i].name + '=' + encodeURIComponent(form[i].value) + '&'; }

			} else if (Array('input', 'textarea').search(form[i].nodeName.toLowerCase()) && form[i].name) {

				if (!updated || (updated && form[i].value != form[i].defaultValue)) { query += form[i].name + '=' + encodeURIComponent(form[i].value) + '&'; }

			} else if (Array('select').search(form[i].nodeName.toLowerCase())) {

				if (!updated || (updated && !form[i].options[form[i].selectedIndex].defaultSelected)) { query += form[i].name + '=' + encodeURIComponent(form[i].value) + '&'; }

			}

		}

		return query.substring(0, query.length - 1);

	},

	// @name: Form.Clear
	// @syntax: Form.Clear(object object);
	// @dependencies: Array.search

	Clear: function(object) {

		object = $(object);
		var form = object.getElementsByTagName('*');

		if (!object) { return false; }

		for (var i = 0; i < form.length; i++) {
			if (form[i].name && Array('input').search(form[i].nodeName.toLowerCase()) && Array('checkbox', 'radiobox').search(form[i].type)) { form[i].checked = false; }
			else if (form[i].name && Array('input', 'textarea').search(form[i].nodeName.toLowerCase())) { form[i].value = ''; }
			else if (form[i].name && Array('select').search(form[i].nodeName.toLowerCase())) { form[i].selectedIndex = 0; }
		}

		return false;

	},

	// @name: Form.CreateElement
	// @syntax: Form.CreateElement([string type , array options]);
	// @dependencies: Array.search
	// @todo: Multiple select on build is not working. Applying selected to each selected field, but it's not taking.

	CreateElement: function(type, options) {

		type = type || 'input';
		options = options || Array();

		var element = document.createElement(type);

		element.name = options.name || 'tmp';

		if (type == 'input') {

			element.type = options.type || 'text';
			element.value = element.defaultValue = options.value || '';

		} else if (type == 'textarea') {

			element.value = element.defaultValue = options.value || '';

		} else if (type == 'select') {

			options.options = options.options || Array(options.value || '');
			options.selected = options.selected || Array();

			if (typeof(options.selected) != 'object') { options.selected = Array(options.selected); }

			for (var i = 0; i < options.options.length; i++) {
				if (typeof(options.options[i]) != 'object') { options.options[i] = Array(options.options[i], options.options[i]); }
				element.options[i] = new Option(options.options[i][0], options.options[i][1]);
				if (options.selected.search(i)) { element.options[i].selected = 'selected'; }
			}

		} else if (type == 'button') {

			element.innerHTML = options.value || '';

		}

		if (options.attrib) {
			forEach(options.attrib, function(key, value) { if (key == 'style') { setStyleAttribute(element, value); } else { element.setAttribute(key, value); } });
		}

		if (!element.style.marginRight) { element.style.marginRight = '1px'; }

		return element;

	},

	// @name: Form.Insertion
	// @syntax: Form.Insertion(object object, string value);
	// @dependencies: none

	Insertion: function(object, value) {

		object = $(object);

		if (!object) { return false; }

		if (object.selectionStart != undefined) {

			var selection_start = object.selectionStart;
			var selection_end = object.selectionEnd;

			object.value = object.value.substring(0, selection_start) + value + object.value.substring(selection_end);
			object.focus();
			object.setSelectionRange(selection_start + 1, selection_start + 1);

		} else {

			object.focus();
			range = document.selection.createRange();
			range.text = value;
			range.moveStart('character', -value.length);

		}

		return false;

	},

	// @name: Form.MultipleSelect
	// @syntax: Form.MultipleSelect(object object);
	// @dependencies: Array.search, Array.add, Array.remove

	MultipleSelect: function(object) {

		object = $(object);

		if (!object) { return false; }
		if (!object.options) { return false; }

		if (!object.selectedIndexes) { object.selectedIndexes = Array(); }

		for (var i = 0; i < object.options.length; i++) {
			if (object.options[i].selected && !object.selectedIndexes.search(i, true)) { object.selectedIndexes.add(i, true); }
			else if (object.options[i].selected && object.selectedIndexes.search(i, true)) { object.selectedIndexes = object.selectedIndexes.remove(i); }
			object.options[i].selected = '';
		}

		for (var i = 0; i < object.selectedIndexes.length; i++) { object.options[object.selectedIndexes[i]].selected = 'selected'; }

		return false;

	},

	// @name: Form.Reset
	// @syntax: Form.Reset(object object);
	// @dependencies: none

	Reset: function(object) {

		object = $(object);

		if (!object) { return false; }

		object.reset();

		return false;

	},

	// @name: Form.SetFocus
	// @syntax: Form.SetFocus(object object [, array options]);
	// @dependencies: none

	SetFocus: function(object, options) {

		object = $(object);
		options = options || Array();

		if (!object) { return false; }

		options.tag = options.tag || 'input';
		options.offset = options.offset || 0;

		if (object.getElementsByTagName(options.tag)[options.offset]) { object.getElementsByTagName(options.tag)[options.offset].focus(); }

		return false;

	},

	// @name: Form.Update
	// @syntax: Form.Update(object object, string query);
	// @dependencies: forEach, getElementsByAttribName

	Update: function(object, query) {

		object = $(object);
		query = query.split('&') || Array();

		if (!object) { return false; }

		forEach(query, function(key, value) {
			var element = getElementsByAttribName(value.split('=')[0], 'name', object)[0];
			if (element) {
				element.value = element.defaultValue = value.split('=')[1];
				if (element.nodeName.toLowerCase() == 'select') { element[element.selectedIndex].defaultSelected = element.selectedIndex; }
				if (element.type == 'checkbox') { element.checked = element.defaultChecked = value.split('=')[1]; }
			}
		});

		return false;

	}

};

// @name: Form.Editable
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

Form.Editable = {

	// @name: Form.Editable.options
	// @syntax: Form.Editable.options(array options);
	// @dependencies: none

	options: {
		type: 'input',
		name: 'tmp',
		class_name: 'editable',
		options: Array(),
		selected: Array(),
		multiple: false,
		attrib: {},
		method: 'default',
		placeholder: 'click here to add text',
		onsave: function(name, value) { },
		oncancel: function() { }
	},

	// @name: Form.Editable.Option
	// @syntax: Form.Editable.Option(string key, string value);
	// @dependencies: Form.Editable.options

	Option: function(key, value) { return value || this.options[key]; },

	// @name: Form.Editable.Activate
	// @syntax: Form.Editable.Activate(object object, array options);
	// @dependencies: Form.CreateElement, Form.Editable.Option, Form.Editable.Revert, Array.search

	Activate: function(object, options) {

		object = $(object);
		options = options || Array();
		options.attrib = options.attrib || Array();

		if (!object) { return false; }

		if (object.innerHTML.toLowerCase() == this.Option('placeholder', options.placeholder || '').toLowerCase()) { object.innerHTML = ''; }

		var value = object.innerHTML;

		options.nodeCopy = object.cloneNode(true);
		options.attrib['class'] = this.Option('class_name', options.class_name || '');

		var stage = document.createElement(object.nodeName);
		object.parentNode.replaceChild(stage, object);
		object = stage;

		if (Array('input', 'textarea').search(this.Option('type', options.type || ''))) {
			var element = Form.CreateElement(this.Option('type', options.type || ''), {name:this.Option('name', options.name || ''), attrib:this.Option('attrib', options.attrib || ''), value:value});
		} else if (Array('select').search(this.Option('type', options.type || ''))) {
			var element = Form.CreateElement(this.Option('type', options.type || ''), {name:this.Option('name', options.name || ''), attrib:this.Option('attrib', options.attrib || ''), options:this.Option('options', options.options || ''), selected:this.Option('selected', options.selected || '')});
		}

		if (element) {

			object.appendChild(element);
			element.customOptions = options;

			if (Array('textarea').search(this.Option('type', options.type || '')) && this.Option('method', options.method || '') != 'blur') { object.appendChild(document.createElement('br')); }

			var button_save = Form.CreateElement('button', {value:'Save'});
			button_save.onclick = function() {
				Form.Editable.Option('onsave', element.customOptions.onsave || '')(Form.Editable.Option('name', element.customOptions.name || ''), element.value);
				object.parentNode.replaceChild(element.customOptions.nodeCopy, object);
				element.customOptions.nodeCopy.innerHTML = element.value || Form.Editable.Option('placeholder', element.customOptions.placeholder || '');
				return false;
			};

			if (this.Option('type', options.type || '') == 'input') {
				element.onkeyup = function() { if (Key.active == 13) { button_save.onclick(); } }
			}

			var text_cancel = document.createElement('a');
			text_cancel.appendChild(document.createTextNode('Cancel'));
			text_cancel.href = '#';
			text_cancel.onclick = function() {
				Form.Editable.Option('oncancel', element.customOptions.oncancel || '')();
				object.parentNode.replaceChild(element.customOptions.nodeCopy, object);
				element.customOptions.nodeCopy.innerHTML = element.defaultValue || Form.Editable.Option('placeholder', element.customOptions.placeholder || '');
				return false;
			};
			setStyleAttribute(text_cancel, 'font-size: x-small');

			var button_cancel = Form.CreateElement('button', {value:'Cancel'});
			button_cancel.onclick = function() {
				Form.Editable.Option('oncancel', element.customOptions.oncancel || '')();
				object.parentNode.replaceChild(element.customOptions.nodeCopy, object);
				element.customOptions.nodeCopy.innerHTML = element.defaultValue || Form.Editable.Option('placeholder', element.customOptions.placeholder || '');
				return false;
			};

			if (this.Option('method', options.method || '') == 'blur') { element.onfocus = function() { element.onblur = button_save.onclick; } }
			else if (this.Option('method', options.method || '') == 'change') { element.onchange = button_save.onclick; }
			else { object.appendChild(button_save);	object.appendChild(text_cancel); }

			element.focus();

		}

		return false;

	}

};

// @name: FX
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var FX = {

	// @name: FX.Animate
	// @syntax: FX.Animate(object [, array options]);
	// @dependencies: Object.get, Object.set

	Animate: function(object, options) {

		object = $(object);
		options = options || Array();
		options.start = options.start || Array();
		options.end = options.end || Array();

		if (!object) { return false; }

		if (object.get('position') == 'absolute') { var position_style = ''; } else { var position_style = 'margin-'; }

		var start = {width:parseInt(options.start.width || object.get('width') || object.get_style('width')),
		             height:parseInt(options.start.height || object.get('height') || object.get_style('height')),
					 left:parseInt(options.start.left || object.get(position_style + 'left')),
					 top:parseInt(options.start.top || object.get(position_style + 'top')),
		             opacity:parseInt(options.start.opacity || object.get('opacity'))};

		var end = {width:parseInt(options.end.width || start.width),
				   height:parseInt(options.end.height || start.height),
				   left:parseInt(options.end.left || start.left),
				   top:parseInt(options.end.top || start.top),
			       opacity:parseInt(options.end.opacity || start.opacity)};

		var speed = options.speed?parseInt(options.speed):8;

		if (options.onstart) { options.onstart(object); }

		object.set('overflow', 'hidden');
		object.set('visibility', 'visible');
		object.show();

		if (object.interval) { clearInterval(object.interval); }

		object.interval = setInterval(function() {

			start.width += (end.width - start.width) * (speed / 100);
			start.height += (end.height - start.height) * (speed / 100);
			start.left += (end.left - start.left) * (speed / 100);
			start.top += (end.top - start.top) * (speed / 100);
			start.opacity += (end.opacity - start.opacity) * (speed / 100);

			object.set('width', start.width);
			object.set('height', start.height);
			object.set(position_style + 'left', start.left);
			object.set(position_style + 'top', start.top);

			object.set('opacity', start.opacity);

			if (Math.round(start.width) == end.width &&
			    Math.round(start.height) == end.height &&
				Math.round(start.left) == end.left &&
				Math.round(start.top) == end.top &&
			    Math.round(start.opacity) == end.opacity) {
					if (Math.round(start.width) == 0 || Math.round(start.height) == 0) { object.set('visibility', 'hidden'); }
					clearInterval(object.interval);
					if (options.oncomplete) { options.oncomplete(object);
				}
			}

		}, speed);

		return false;

	},

	// @name: FX.FadeBG
	// @syntax: FX.FadeBG(object object, array options);
	// @dependencies: none

	FadeColor: function(object, options) {

		object = $(object);
		options = options || Array();
		options.method = options.method || 'background';

		var start = options.start || Array(255, 255, 0);
		var end = options.end || Array(255, 255, 255);

		if (typeof(start) == 'string') { start = start.hextorgb(); }
		if (typeof(end) == 'string') { end = end.hextorgb(); }

		var speed = options.speed || 2;

		if (object.interval) { clearInterval(object.interval); }

		object.interval = setInterval(function() {

			start[0] += (end[0] - start[0]) * (speed / 100);
			start[1] += (end[1] - start[1]) * (speed / 100);
			start[2] += (end[0] - start[2]) * (speed / 100);

			object.set(options.method, start.rgbtohex());

			if (start.rgbtohex() == end.rgbtohex()) {
				if (options.method == 'background') { object.set(options.method, 'transparent'); }
				clearInterval(object.interval);
				if (options.oncomplete) { options.oncomplete(object); }
			}

		}, speed);

		return false;

	},

	// @name: FX.ScrollTo
	// @syntax: FX.ScrollTo(array options);
	// @dependencies: none

	ScrollTo: function(options) {

		options = options || Array();

		return false;

	},

	// @name: FX.Toggle
	// @syntax: FX.Toggle(object [, array options]);
	// @dependencies: FX.Animate, Object.get

	Toggle: function(object, options) {

		object = $(object);
		options = options || Array();
		options.end = options.end || Array();

		if (!object) { return false; }

		if ((options.end.width && Math.floor(object.get('width')) != 0) ||
		    (options.end.height && Math.floor(object.get('height')) != 0) ||
			(options.end.opacity && Math.floor(object.get('opacity')) != 0)) {

				if (options.end.width) { options.end.width = '0'; }
				if (options.end.height) { options.end.height = '0'; }
				if (options.end.opacity) { options.end.opacity = '0'; }

		}

		FX.Animate(object, {end:{width:options.end.width, height:options.end.height, opacity:options.end.opacity}, speed:options.speed || '8', onstart:options.onstart || function() {}, oncomplete:options.oncomplete || function() {}});

		return false;

	}

};

FX.Custom = {

	// @name: FX.Custom.Wipe
	// @syntax: FX.Custom.Wipe(object object [, array options]);
	// @dependencies: FX.Animate

	Wipe: function(object, options) {

		object = $(object);
		options = options || Array();

		if (!object) { return false; }

		if (options.method == 'down' && options.end.height) { FX.Animate(object, {start:{height:'0', opacity:'0'}, end:{height:options.end.height, opacity:'100'}, speed:options.speed || '8'}); }
		else if (options.method == 'up' && options.end.height) { FX.Animate(object, {start:{height:options.end.height, opacity:'100'}, end:{height:'0', opacity:'0'}, speed:options.speed || '8'}); }
		else if (options.method == 'toggle' && options.end.height) { FX.Toggle(object, {start:{height:object.get('height') || '0', opacity:object.get('opacity') || '100'}, end:{height:options.end.height, opacity:'100'}, speed:options.speed || '8'}); }

		return false;

	},

	// @name: FX.Custom.Blink
	// @syntax: FX.Custom.Blink(object object);
	// @dependencies: FX.Animate

	Blink: function(object) {

		object = $(object);
		options = options || Array();

		if (!object) { return false; }

		FX.Animate(object, {start:{opacity:'100'}, end:{opacity:'0'}, speed:options.speed || '8', oncomplete: function() { FX.Animate(object, {start:{opacity:'0'}, end:{opacity:'100'}, speed:options.speed || '8'}); }});

		return false;

	}

};

// @name: Key
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var Key = {

	active: null,
	listeners: Array(),
	keys: {
		KEY_BACKSPACE: 8,
		KEY_TAB:       9,
		KEY_RETURN:   13,
		KEY_ESC:      27,
		KEY_LEFT:     37,
		KEY_UP:       38,
		KEY_RIGHT:    39,
		KEY_DOWN:     40,
		KEY_DELETE:   46,
		KEY_HOME:     36,
		KEY_END:      35,
		KEY_PAGEUP:   33,
		KEY_PAGEDOWN: 34
	},

	// @name: Key.Capture
	// @syntax: Key.Capture(event e);
	// @dependencies: none

	Capture: function(e) {
		e = e || window.event;
		if (Key.listeners[e.keyCode]) { Key.listeners[e.keyCode](); }
		return Key.active = e.keyCode;
	},

	// @name: Key.AddListener
	// @syntax: Key.AddListener(integer key, function func);
	// @dependencies: none

	AddListener: function(key, func) {
		Key.listeners[key] = func;
	},

	// @name: Key.RemoveListener
	// @syntax: Key.RemoveListener(integer key);
	// @dependencies: none

	RemoveListener: function(key) {
		Key.listeners[key] = function() { };
	}

};

addEvent('keydown', Key.Capture);
addEvent('keyup', function() { Key.active = null; });

// @name: Mouse
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var Mouse = {

	// @name: Mouse.GetCoords
	// @syntax: Mouse.GetCoords(event e);
	// @dependencies: none

	GetCoords: function(e) {
		e = e || window.event;
		document.mouseX = e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
		document.mouseY = e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
		return false;
	}

}; addEvent('mousemove', Mouse.GetCoords);

// @name: Drag
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

Object.extend(Object.prototype, {

	// @name: Object.drag()
	// @syntax: Object.drag([array options]);
	// @dependencies: Object.get, Object.set, Object.remove, Mouse.GetCoord, FX.Animate

	drag: function(options) {

		options = options || Array();
		var object = this;

		if (!object) { return false; }

		document.activeDrag = object;

		object.originalMouseX = document.mouseX;
		object.originalMouseY = document.mouseY;

		var interval = setInterval(function() {

			addEvent('mouseup', function() { clearInterval(interval); }, document);

			if (object.originalMouseX == document.mouseX && object.originalMouseY == document.mouseY) { return false; }

			clearInterval(interval);

			var clone = object.cloneNode(true);

			clone.set('position', 'absolute');
			clone.set('top', object.get('top'));
			clone.set('left', object.get('left'));

			object.parentNode.appendChild(clone);

			clone.set('opacity', '75');

			if (options.ghosting) { object.set('opacity', '10'); } else { object.set('opacity', '0'); }

			addEvent('mouseup', revert_drag, document);

			function revert_drag() {

				clearInterval(clone.interval);

				if (options.revert && options.revert != 'animate') {
					FX.Animate(object, {start:{opacity:'0'}, end:{opacity:'100'}, speed:10});
					clone.remove();
				} else if (options.revert && options.revert == 'animate') {
					FX.Animate(clone, {start:{opacity:'0'}, end:{opacity:'100', left:object.get('left'), top:object.get('top')}, speed:10, oncomplete:function() {

						object.set('opacity', '100');
						setTimeout(function() { clone.remove(); }, 1);

					}});
				} else {
					clone.set('opacity', '100');
					if (options.ghosting) { FX.Animate(object, {end:{opacity:'0'}, speed:10, oncomplete:function() { object.remove();  }}); } else { object.remove(); }
				}

				setTimeout(function() { document.activeDrag = null; }, 1);

				removeEvent('mouseup', revert_drag, document);

			}

			clone.offsetMouseX = document.mouseX - clone.get('left');
			clone.offsetMouseY = document.mouseY - clone.get('top');

			clone.interval = setInterval(function() {
				clone.set('position', 'absolute');
				clone.set('left', document.mouseX - clone.offsetMouseX);
				clone.set('top', document.mouseY - clone.offsetMouseY);
			}, 10);

			return false;

		}, 10);

		return false;

	}

});

// @name: Table
// @author: Neo Geek {neo@neo-geek.net}
// @website: http://neo-geek.net/
// @copyright: (c) 2006 Neo Geek, Neo Geek Labs

var Table = {

	// @name: Table.Initialize
	// @syntax: Table.Initialize(object object);
	// @dependencies: Table.History.Cache

	Initialize: function(object) {

		object = $(object);

		if (!object) { return false; }

		for (var i = 0; i < object.rows.length; i++) {
			for (var j = 0; j < object.rows[i].cells.length; j++) {
				object.rows[i].cells[j].rowNum = i;
				object.rows[i].cells[j].cellNum = j;
			}
		}

		return false;

	},

	// @name: Table.InsertRow
	// @syntax: Table.InsertRow(object object, array options);
	// @dependencies: Table.Initialize

	InsertRow: function(object, options) {

		object = $(object);
		options = options || Array();

		if (!object) { return false; }

		var row = object.insertRow(options.offset || object.rows.length);

		if (typeof(options.data) == 'object') {
			for (var i = 0; i < options.data.length; i++) { row.insertCell(i).innerHTML = options.data[i] || ''; }
		} else { return row; }

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.InsertColumn
	// @syntax: Table.InsertColumn(object object, array options);
	// @dependencies: Table.Initialize

	InsertColumn: function(object, options) {

		object = $(object);
		options = options || Array();

		if (!object) { return false; }

		options.data = options.data || Array();

		for (var i = 0; i < object.rows.length; i++) {
			object.rows[i].cells[0].parentNode.appendChild(document.createElement(object.rows[i].cells[0].nodeName.toLowerCase())).innerHTML = options.data[i] || '';
		}

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.RemoveRow
	// @syntax: Table.RemoveRow(object object, array options);
	// @dependencies: Table.Initialize

	RemoveRow: function(object, options) {

		object = $(object);
		options = options || Array();

		if (!object) { return false; }

		object.deleteRow(options.data || object.rows.length - 1);

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.RemoveColumn
	// @syntax: Table.RemoveColumn(object object, array options);
	// @dependencies: Table.Initialize

	RemoveColumn: function(object, options) {

		object = $(object);
		options = options || Array();

		if (!object) { return false; }

		for (var i = 0; i < object.rows.length; i++) {
			object.rows[i].cells[options.data || 0].parentNode.removeChild(object.rows[i].cells[options.data || 0]);
		}

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.MoveRow
	// @syntax: Table.MoveRow(object object, array options);
	// @dependencies: Table.GhostData, Table.Initialize, Array.search

	MoveRow: function(object, options) {

		object = $(object);
		options = options || Array()
		var table_data = this.GhostData(object);

		if (!object) { return false; }

		if (options.data && options.data[1] < 0 || options.data[1] > object.rows.length - 1) { return false; }

		if (options.locked && options.locked.search(options.data[1])) { return false; }

		for (var i = 0; i < object.rows.length; i++) {

			for (var j = 0; j < object.rows[i].cells.length; j++) {

				if (i == options.data[1]) { object.rows[i].cells[j].innerHTML = table_data[options.data[0]][j]; }
				else if (i < options.data[1] && i == options.data[0]) { object.rows[i].cells[j].innerHTML = table_data[options.data[0] + 1][j]; }
				else if (i > options.data[1] && i == options.data[0]) { object.rows[i].cells[j].innerHTML = table_data[options.data[0] - 1][j]; }

			}

		}

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.MoveColumn
	// @syntax: Table.MoveColumn(object object, array options);
	// @dependencies: Table.GhostData, Table.Initialize, Array.search

	MoveColumn: function(object, options) {

		object = $(object);
		options = options || Array();
		var table_data = this.GhostData(object);

		if (!object) { return false; }

		if (options.data && options.data[1] < 0 || options.data[1] > object.rows[0].cells.length - 1) { return false; }

		if (options.locked && options.locked.search(options.data[1])) { return false; }

		for (var i = 0; i < object.rows.length; i++) {

			for (var j = 0; j < object.rows[i].cells.length; j++) {

				if (j == options.data[1]) { object.rows[i].cells[j].innerHTML = table_data[i][options.data[0]]; }
				else if (j < options.data[1] && j == options.data[0]) { object.rows[i].cells[j].innerHTML = table_data[i][options.data[0] + 1]; }
				else if (j > options.data[1] && j == options.data[0]) { object.rows[i].cells[j].innerHTML = table_data[i][options.data[0] - 1]; }

			}

		}

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.SwitchRows
	// @syntax: Table.SwitchRows(object object, array options);
	// @dependencies: Table.GhostData, Table.Initialize

	SwitchRows: function(object, options) {

		object = $(object);
		options = options || Array();
		var table_data = this.GhostData(object);

		if (!object) { return false; }

		options.data = options.data || Array();

		for (var i = 0; i < object.rows[options.data[0] || 1].cells.length; i++) {
			object.rows[options.data[0] || 1].cells[i].innerHTML = table_data[options.data[1] || 2][i];
		}

		for (var i = 0; i < object.rows[options.data[1] || 2].cells.length; i++) {
			object.rows[options.data[1] || 2].cells[i].innerHTML = table_data[options.data[0] || 1][i];
		}

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.SwitchColumns
	// @syntax: Table.SwitchColumns(object object, array options);
	// @dependencies: Table.GhostData, Table.Initialize

	SwitchColumns: function(object, options) {

		object = $(object);
		options = options || Array();
		var table_data = this.GhostData(object);

		if (!object) { return false; }

		options.data = options.data || Array();

		for (var i = 0; i < object.rows.length; i++) {
			object.rows[i].cells[options.data[0] || 0].innerHTML = table_data[i][options.data[1] || 1];
			object.rows[i].cells[options.data[1] || 1].innerHTML = table_data[i][options.data[0] || 0];
		}

		Table.Initialize(object);

		if (options.oncomplete) { options.oncomplete(); }

		return false;

	},

	// @name: Table.GhostData
	// @syntax: Table.GhostData(object object);
	// @dependencies: none

	GhostData: function(object) {

		object = $(object);
		var table_data = Array();

		if (!object) { return false; }

		for (var i = 0; i < object.rows.length; i++) {
			table_data[i] = Array();
			for (var j = 0; j < object.rows[i].cells.length; j++) { table_data[i].push(object.rows[i].cells[j].innerHTML); }
		}

		return table_data || false;

	}

};
