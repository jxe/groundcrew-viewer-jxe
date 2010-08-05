// ===================
// = poppyseed stuff =
// ===================

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
    if (this.name && !$(this).is('.prompting')) {
      switch(this.type) {
        case "radio": // fall through
        case "checkbox":
          if (this.checked) obj[this.name] = $(this).val();
          break;
        case "file":
          // TODO: handle file uploads
          break;
        default:
          obj[this.name] = $(this).val();
      }
    }
  });
  return obj;
};

var jqplus_activations = {};

$.fn.activate = function(space){
  if (jqplus_activations[space]) jqplus_activations[space].removeClass('active');
  jqplus_activations[space] = this.addClass('active');
  return this;
  // return this.app_paint();
};

function _ajax_request(url, data, callback, type, method) {
  if (jQuery.isFunction(data)) {
      callback = data;
      data = {};
  }
  return jQuery.ajax({
      type: method,
      url: url,
      data: data,
      success: callback,
      dataType: type
      });
}

jQuery.extend({
  put: function(url, data, callback, type) {
      return _ajax_request(url, data, callback, type, 'PUT');
  },
  delete_: function(url, data, callback, type) {
      return _ajax_request(url, data, callback, type, 'DELETE');
  }
});


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


// =======
// = etc =
// =======

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

