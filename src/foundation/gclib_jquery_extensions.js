$.templates = {};
$.template = function(sel){
  if ($.templates[sel]) return $.templates[sel].clone();
  $.templates[sel] = $(sel).remove().show();
  return $.template(sel);
};

$.fn.form_values = function() {
  var obj = {};
  $(this[0].elements).each(function(){
    if (this.name && !this.disabled) obj[this.name] = $(this).val();
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

$.fn.reset_prompts = function(){
  return this.find('input[prompt]').each(function(){
    $(this).val($(this).attr('prompt')).addClass('prompting');
  });
};

$.fn.promptify = function(){
  return this.each(function(){
    var obj = $(this);
    obj.attr('prompt', obj.val());
    obj.addClass('prompting');
    obj.click(function(){
      if (obj.hasClass('prompting')) obj.focus();
      return true;
    });
    obj.focus(function(){
      if (obj.hasClass('prompting')) {
        obj.val('');
        obj.removeClass('prompting');
      }
      return true;
    });

    obj.blur(function(){
      var val = obj.val();
      if (!val || val.length == 0) {
        obj.addClass('prompting');
        obj.val(obj.attr('prompt'));
      }
    });
  });
};
