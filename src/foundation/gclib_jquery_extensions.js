$.templates = {};
$.template = function(sel){
  if ($.templates[sel]) return $.templates[sel].clone();
  $.templates[sel] = $(sel).remove();
  if (!$.templates[sel]) alert("No template for " + sel);
  return $.template(sel);
};

$.fn.form_values = function() {
  var obj = {};
  $(this[0].elements).each(function(){
    if (this.name) obj[this.name] = $(this).val();
  });
  return obj;
};

$.fn.show_dialog = function(f){
  this.find('form').submit(function(ev){
    f($(this).form_values());
    $.facebox.close();
    return false;
  });
  $.facebox(this);
  this.find('input:first').focus();
};

$.fn.onscreen = function(){
  var x = this.appendTo("#screen");
  if (x.is('.divcenter')) x.center();
  return x;
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

(function(){

  var revealed_element = null;
  
  $.fn.reveal = function(){
    revealed_element && $(revealed_element).offscreen();;
    this.onscreen();
    $('body').addClass('has_reveal');
    revealed_element = this[0];
  };
  
  $.fn.toggle_reveal = function(){
    if (this[0] == revealed_element) return $.unreveal();
    this.reveal();
  };

  $.unreveal = function(){
    if (!revealed_element) return;
    $(revealed_element).offscreen();
    $('body').removeClass('has_reveal');
    revealed_element = null;
  }
  
})();


// ==========================
// = pre-blit configurators =
// ==========================

$.fn.showhide = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    if (v){
      self.find(k).show();
    } else {
      self.find(k).remove();
    }
  });
  return self;
};

$.fn.forms = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    var form = self.find(k);
    // if (form.length == 1) alert(k + ' found one form');
    // if (form.length > 1) alert(k + ' found many forms');
    // if (form.length < 1) alert(k + ' found no forms');
    form.unbind('submit').submit(function(){
      v($(this).form_values());
      return false;
    });
  });
  return self;
};

$.fn.fillout = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    if (k.indexOf(' //') >= 0) {
      var tmp = k.split(' //');
      self.find(tmp[0]).attr(tmp[1], v);
    } else {
      if (v instanceof Array) {
        self.find(k).append(v);
      } else {
        self.find(k).html(v || ' ');
      }
    }
  });
  return self;
};

$.fn.clicks = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    self.find(k).unbind('click').click(function(){ v(this); return false; });
  });
  return self;
};


$.fn.disable = function(){
  this.find('button,input,select').attr('disabled', true);
  var subm = this.find('[type=submit]:first')[0];
  return this;
};

$.fn.enable = function(){
  this.find(':disabled').attr('disabled', false);
  this.find('input[blank],input[prompt]').each(function(){
    var input = $(this);
    var prompt = input.attr('prompt');
    if (prompt) {
      if (!input.hasClass('prompted')) {
        var blank = input.attr('blank');
        if (!blank) {
          blank = input.val();
          input.attr('blank', blank);
        }
        input.click(function(){ input.focus(); return true; });
        input.focus(function(){
          input.is('.prompting') && input.val(blank).removeClass('prompting');
          return true;
        });
        input.blur(function(){
          (input.val() == blank) && input.addClass('prompting').val(prompt);
          return true;
        });
      }
      input.addClass('prompting prompted').val(prompt);
    } else {
      var blank = input.attr('blank');
      if (blank) input.val(blank);
    }
  });
  // this.find('input[type=text]:first').focus();
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
