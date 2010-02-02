var This = { first_responders: [{}, {}], user: { tag: 'Person__Anon'} };

LiveHTML = {
  shiftOn: false,
  metaOn: false,
  
  widgets: [],
  
  init: function() {
    $(document).keydown(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
     	LiveHTML.metaOn = e.metaKey || e.altKey;
    }).keyup(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
     	LiveHTML.metaOn = e.metaKey || e.altKey;
    }).mousedown(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
     	LiveHTML.metaOn = e.metaKey || e.altKey;
    });
    $('[scrollr]').live('click', function(){
      var thing = $($(this).attr('scrollr'));
      var end = $(this).attr('scroll_end') ? $($(this).attr('scroll_end')) : null;
      if (end && (end.offset().left + 100) < thing.width()) return false;
      thing.animate({scrollLeft:thing[0].scrollLeft + 800}, 200);
      return false;
    });

    $('[scrolll]').live('click', function(){
      var thing = $($(this).attr('scrolll'));
      thing.animate({scrollLeft:thing[0].scrollLeft - 800}, 200);
      return false;
    });

    $('[mousewheel]').live('mousewheel', function(event){
      var scroll_delta = event.normalized_delta * -20;
      var thing = $($(this).attr('mousewheel'));
      if (scroll_delta > 0) {
        var end = $(this).attr('scroll_end') ? $($(this).attr('scroll_end')) : null;
        if (end && (end.offset().left + 100) < thing.width()) return false;
      }
      thing.animate({scrollLeft:thing[0].scrollLeft + scroll_delta}, 0);
      return false;
    });

    $('.selectable').live('click', function(){
      $(this).closest('.select_one').find('.selected').removeClass('selected');
      $(this).addClass('selected');
      return false;
    });
    $('.menu div').live('click', function(){
      var item = $(this);
      item.blink(function(){
        var set = item.attr('set');
        if (set) $('#' + set).html(item.html());
        $.unreveal();
      });
    });
    
    
    // open dropdowns
    $(".button_dropdown button").live('click', function(){

      var theButton = $(this);
      var theDropdown = theButton.parent().children(".dropdown");
      var wasIdle = theButton.hasClass("idle");

      // close any open dropdowns
      $(".button_dropdown button.selected").each(function(){
        $(this).removeClass('selected').addClass('idle');
        $(this).parent().children('.dropdown').fadeOut('fast');
      });

      if (wasIdle) {
        theButton.removeClass("idle").addClass("selected");
        theDropdown.show();
      };

    });
    
    // close dropdowns when links are clicked
    $(".button_dropdown .dropdown dl, .button_dropdown .dropdown li, .button_dropdown .dropdown a").live('click', function(){
      $(".button_dropdown button.selected").each(function(){
        $(this).removeClass('selected').addClass('idle');
        $(this).parent().children('.dropdown').fadeOut('fast');
      });
      return true;
    });
    
    $('a[href],img[href],dl[href],li[href],div[href],h2[href]').live('click', function(){
      var href = $(this).attr('href');
      if (!href || href.charAt(0) != "#") {
        if (this.nodeName == 'A') return true;
        else return window.location = href;
      }
      go(href.slice(1), null, this);
      return false;
    });
  },
    
  back: function() {
    // go(This.prev_url);
    go('mode=;tool=');
  }

};


$.fn.app_paint = function(){
  var data = {};
  this.find('[fill]').each(function(){
    var obj = $(this);
    var method = obj.attr('fill');
    var attr = false;
    if (method.contains(" ")) {
      var parts = method.split(' ');
      method = parts[0];
      attr = parts[1];
    }
    if (!data[method]) {
      data[method] = This[method] ||
        dispatch(method, This);
    }
    value = data[method] || window[method];
    if (value) {
      if (attr) obj.attr(attr, value);
      else      obj.html(value);
    }
  });
  this.find('[if]').each(function(){
    var obj = $(this);
    var method = obj.attr('if');
    var reverse = false;
    if (method.charAt(0) == '!') {
      method = method.slice(1);
      reverse = true;
    }
    if (!data[method]) 
      data[method] = This[method] ||
        dispatch(method, This);


    var value = data[method];
    if (reverse) value = !value;
    if (value) obj.show();
    else obj.hide();
  });
  this.find('form').enable().unbind('submit').submit(function(){
    var action = $(this).attr('action');
    if (action && action.charAt(0) != '#') return true;
    var data = $(this).form_values();
    $(this).disable();
    if (this.id) {
      var result = dispatch(this.id + "_submitted", data, This, this);
      if (result == "redo") {
        $(this).enable();
      } else {
        $(this).find('input[type=text],textarea').each(function(){ this.value = null; });
      }
      return false;
    }
    $(this).find('input[type=text],textarea').each(function(){ this.value = null; });
    if (action) go(action.slice(1), $(this).form_values());
    return false;
  });
  this.find('[observe]').each(function(){
    var obj = $(this);
    var method = obj.attr('observe');
    obj.change(function(){
      dispatch(method, obj.val(), null, obj);
      return true;
    });
    obj.keydown(function(e){
      var ch = String.fromCharCode(e.which);
      dispatch(method, obj.val(), ch, obj);
      return true;
    });
  });
  this.find('input[hint],textarea[hint]').each(function(){
    var self = $(this);
    var hint = self.attr('hint');
    if (hint.charAt(0) == '#') hint = dispatch(hint.slice(1));
    // if (!self.val()) 
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
      if (LiveHTML.metaOn && url.startsWith('@Person__')) return Selection.toggle(url.slice(1));
      else return go('mode=;tool=;item=' + url.slice(1));
    }

    console.log('go('+url+')');

    This.form_data = form_data;
    This.changed = {};
    This.prev_url = This.url;
    This.url = url;
    $.each(url.split(';'), function(){
      var part = this.split('=');
      set(part[0], unescape(part[1]));
    });
    App.update && App.update(This.changed);

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
  var chain = [].concat(This.first_responders, LiveHTML.widgets, App, LiveHTML);
  return chain.dispatch.apply(chain, arguments);
};

function trigger(method, args) {
  var chain = [].concat(This.first_responders, LiveHTML.widgets, App, LiveHTML);
  return chain.trigger.apply(chain, arguments);
};
