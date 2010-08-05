// jspoppyseed

var This = { first_responders: [{}, {}], user: { tag: 'pAnon'} };

$(function(){
  $('a[href],img[href],dl[href],li[href],div[href],h2[href]').live('click', function(){
    var href = $(this).attr('href');
    if (!href || href.charAt(0) != "#") {
      if (this.nodeName == 'A') return true;
      else return window.location = href;
    }
    if ($(this).is('.toggles.active')) {
      go('tool=');
      return false;
    }
    go(href.slice(1), null, this);
    return false;
  });
});

LiveHTML = { widgets: [] };

$.fn.app_paint = function(){
  var data = {};
  function value_for(method){
    if (!data[method]) {
      data[method] = This[method] || dispatch(method, This);
    }
    return data[method] || window[method];
  };
  this.find('[fill]').each(function(){
    var obj = $(this);
    var parts = obj.attr('fill').split(' ');
    var method = parts[0];
    var attr = parts[1];
    var value = value_for(method);
    if (!value) return;
    if (attr) obj.attr(attr, value);
    else      obj.html(value);
  });
  this.find('[if]').each(function(){
    var obj = $(this);
    var method = obj.attr('if');
    var reverse = false;
    if (method.charAt(0) == '!') {
      method = method.slice(1);
      reverse = true;
    }
    var value = value_for(method);
    if (reverse) value = !value;
    if (value) obj.show();
    else obj.hide();
  });
  this.find('form').enable().unbind('submit').submit(function(){
    var data = $(this).form_values();
    $(this).disable();
    var result = dispatch(this.id + "_submitted", data, This, this);
    if (result == "redo") {
      $(this).enable();
    } else {
      $(this).find('input[type=text],textarea').each(function(){ this.value = null; });
    }
    return false;
  });
  this.find('[observe]').each(function(){
    var obj = $(this);
    var methods = obj.attr('observe').split(' METHOD_SPACER ');
    obj.change(function(){
      $.each(methods, function(i, method) { dispatch(method, obj.val(), null, obj); });
      return true;
    });
    obj.keydown(function(e){
      var ch = String.fromCharCode(e.which);
      $.each(methods, function(i, method) { dispatch(method, obj.val(), ch, obj); });
      return true;
    });
  });
  this.find('input[hint],textarea[hint]').each(function(){
    var self = $(this);
    var hint = self.attr('hint');
    if (hint.charAt(0) == '#') hint = dispatch(hint.slice(1));
    self.val(hint).addClass('prompting');
    self.focus(function(){ 
      if (self.is('.prompting')) self.val('').removeClass('prompting'); 
    });
    self.blur(function(){ if (!self.val()) self.val(hint).addClass('prompting'); });
  });
  this.find('input.focus').focus();
  return this;
};


function go(url, form_data, elem) {
  try {

    if (url == '#' || url == '' || url == '@') return;    
    if (url.charAt(0) == '#') {
      var parts = url.slice(1).split('?');
      return dispatch(parts[0], unescape(parts[1]), elem);
    }
    if (url.charAt(0) == '@') {
      if (LiveHTML.metaOn && url.startsWith('@p')) return Selection.toggle(url.slice(1));
      else return go('tool=;item=' + url.slice(1));
    }

    console.log('go('+url+')');

    This.form_data = form_data;
    var changed = This.changed = {};
    This.prev_url = This.url;
    This.url = url;
    $.each(url.split(';'), function(){
      var part = this.split('=');
      set(part[0], unescape(part[1]));
    });
        
    if (!This.prev_url) changed.tool = true;
    if (changed.tool) {
      $('.' + This.tool + '_tool').activate('tool');
      go('#tool_unselected');
      This.first_responders[0] = App.tools[This.tool] || {};
      go('#tool_selected');
    }
    $('.hud:visible').app_paint();
    $('.magic').app_paint();
    
    App.update && App.update(This.changed);
    App.loaded = true;

  } catch(e) {
    App.report_error('error during go(url): ' + url, e);
  }
};


function set(key, value) {
  if (This[key] != value) {
    This.changed[key] = true;
    This[key] = value;
  }
};

function dispatch(method, args) {
  var chain = [].concat(This.first_responders, LiveHTML.widgets, App);
  return chain.dispatch.apply(chain, arguments);
};

function trigger(method, args) {
  var chain = [].concat(This.first_responders, LiveHTML.widgets, App);
  return chain.trigger.apply(chain, arguments);
};
