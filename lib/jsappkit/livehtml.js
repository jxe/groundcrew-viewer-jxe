var This = { first_responders: [{}, {}], user: { tag: 'Person__Anon'} };

LiveHTML = {
  shiftOn: false,
    
  widgets: [],
  
  init: function() {
    $(document).keydown(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
    }).keyup(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
    });
    $('[reveal]').live('click', function(){
      var reveal = $(this).attr('reveal').split(' ');
      if (reveal[0] == '#') { $.unreveal(); return false; }
      $('#' + reveal[0]).toggle_reveal(reveal[1], reveal[2], $(this));
      return false;
    });
    $('[scrollr]').live('click', function(){
      var thing = $($(this).attr('scrollr'));
      thing.animate({scrollLeft:thing[0].scrollLeft + 800}, 200);
      return false;
    });

    $('[scrolll]').live('click', function(){
      var thing = $($(this).attr('scrolll'));
      thing.animate({scrollLeft:thing[0].scrollLeft - 800}, 200);
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
    $(".button_dropdown .dropdown dl, .button_dropdown .dropdown li").live('click', function(){
      $(".button_dropdown button.selected").each(function(){
        $(this).removeClass('selected').addClass('idle');
        $(this).parent().children('.dropdown').fadeOut('fast');
      });
      return true;
    });
    
    $('a[href],img[href],dl[href],li[href],div[href]').live('click', function(){
      var href = $(this).attr('href');
      if (!href || href[0] != "#") return true;
      go(href.slice(1));
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
    if (!data[method]) 
      data[method] = This[method] ||
        dispatch(method, This);
    if (data[method]) {
      if (attr) obj.attr(attr, data[method]);
      else      obj.html(data[method]);
    }
  });
  this.find('[if]').each(function(){
    var obj = $(this);
    var method = obj.attr('if');
    if (!data[method]) 
      data[method] = This[method] ||
        dispatch(method, This);
    if (data[method]) obj.show();
    else obj.hide();
  });
  this.find('form').enable().unbind('submit').submit(function(){
    var action = $(this).attr('action');
    if (action && action[0] != '#') return true;
    $(this).disable();
    if (this.id)
      dispatch(this.id + "_submitted", $(this).form_values(), This, this);
    if (action) go(action.slice(1), $(this).form_values());
    return false;
  });
  this.find('[observe]').each(function(){
    var obj = $(this);
    var method = obj.attr('observe');
    obj.change(function(){
      dispatch(method, obj.val());
      return true;
    });
    obj.keypress(function(e){
      var ch = String.fromCharCode(e.which);
      dispatch(method, obj.val(), ch);
      return true;
    });
  });
  this.find('input[hint],textarea[hint]').each(function(){
    var self = $(this);
    if (!self.val()) self.val(self.attr('hint')).addClass('prompting');
    self.focus(function(){ self.val('').removeClass('prompting'); });
    self.blur(function(){ if (!self.val()) self.val(self.attr('hint')).addClass('prompting'); });
  });
  return this;
};


function go(url, form_data) {
  if (url == '#' || url == '' || url == '@') return;    
  if (url[0] == '#') return dispatch(url.slice(1), This);
  if (url[0] == '@') {
    if (LiveHTML.shiftOn) return Selection.toggle(url.slice(1));
    else return go('mode=;tool=;item=' + url.slice(1));
  }
  
  console.log('go('+url+')');
  This.form_data = form_data;
  This.changed = {};
  This.prev_url = This.url;
  This.url = url;
  $.each(url.split(';'), function(){
    var part = this.split('=');
    set(part[0], part[1]);
  });
  App.update && App.update(This.changed);
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
