$.templates = {};
$.template = function(sel){
  if ($.templates[sel] === null) {
    // console.log("no template " + sel);
    return;
  }
  if ($.templates[sel]) {
    // console.log("returning template " + sel);
    return $.templates[sel].clone();
  }
  
  var template = $(sel).remove();
  if (template[0]) $.templates[sel] = template;
  else $.templates[sel] = null;

  return $.template(sel);
};

$.fn.form_values = function() {
  var obj = {};
  $(this[0].elements).each(function(){
    if (this.name) obj[this.name] = $(this).val();
  });
  $(this[0]).find('input[type=radio]:checked').each(function(){
    if (this.name) obj[this.name] = $(this).val();
  });
  return obj;
};

$.fn.onscreen = function(where){
  if (where) {
    $(where).children().offscreen();
    return $(where).append(this);
  } else {
    var x = this.appendTo("#screen");
    if (x.is('.divcenter')) x.center();
    return x;
  }
};

$.fn.select = function(){
  this.siblings().removeClass('selected');
  return this.addClass('selected');
};

var jqplus_activations = {};

$.fn.activate = function(space){
  if (jqplus_activations[space]) jqplus_activations[space].removeClass('active');
  jqplus_activations[space] = this.addClass('active');
  this.filter('.hud').center();
  return this;
  // return this.app_paint();
};

$.fn.blink = function(after){
  var self = this;
	var i = 0;
	var iid;
  self.toggleClass('trigger');
	iid = setInterval(function(){
		self.toggleClass('trigger');
		if (i++ < 3) return;
		clearInterval(iid);
		self.removeClass('trigger');
		if (after) after();
	}, 75);
	return self;
};

$.fn.offscreen = function(){
  return this.appendTo("#offscreen");
};

$.fn.center = function(){
  var window_width = window.innerWidth || window.document.body.clientWidth;
  return this.each(function(){
    var $e = $(this);
    $e.css('left', window_width/2 - $e.width()/2);
  });
};

$.fn.scrollDown = function(){
  return this.each(function(){ this.scrollTop = this.scrollHeight; });
};

$.fn.position = function(position, where, anchor){
  if (position == 'vtop'){
    this.css('top', anchor.offset().top - $(where).offset().top);
  }
  if (position == 'subm'){
    this.css('top', anchor.offset().top - $(where).offset().top + 25);
    this.css('left', anchor.offset().left - $(where).offset().left + 20);
  }
  if (position == 'spinner'){
    this.css('top', anchor.offset().top - $(where).offset().top - 20);
    this.css('right',  $(where).width() - (anchor.offset().left - $(where).offset().left));
  };
};

(function(){

  var revealed_element = null;
  
  $.fn.reveal = function(where, position, anchor){
    revealed_element && $(revealed_element).offscreen();
    this.onscreen(where);
    if (position) this.position(position, where, anchor);
    this.app_paint();
    if (this.is('select')) { 
      var sel = this[0];
      // sel.size = sel.options.length;
      // sel.click();
    }
    $('body').addClass('has_reveal');
    revealed_element = this[0];
  };
  
  $.fn.toggle_reveal = function(where, position, anchor){
    if (this[0] == revealed_element) return $.unreveal();
    this.reveal(where, position, anchor);
  };

  $.unreveal = function(){
    if (!revealed_element) return;
    $(revealed_element).offscreen();
    $('body').removeClass('has_reveal');
    revealed_element = null;
  };
  
})();


// ==========================
// = pre-blit configurators =
// ==========================

$.fn.disable = function(){
  this.find('button,input,select,textarea').attr('disabled', true);
  var subm = this.find('[type=submit]:first')[0];
  return this;
};

$.fn.enable = function(){
  this.find(':disabled').attr('disabled', false);
  return this;
};


// descends from Klaus Hartl's "cookie plugin"
$.cookie = function(name, value) {
  if (typeof value != 'undefined') { 
    // name and value given, set cookie
    document.cookie = [name, '=', encodeURIComponent(value)].join('');
  } else { 
    // only name given, get cookie
    if (!document.cookie || document.cookie == '') return null;
    var cookies = document.cookie.split('; ');
    for (var i in cookies) {
      if (cookies[i].split) {
        var part = cookies[i].split('=');
        if (part[0] == name) return decodeURIComponent(part[1].replace(/\+/g, ' '));
      }
    }
    return null;
  }
};
