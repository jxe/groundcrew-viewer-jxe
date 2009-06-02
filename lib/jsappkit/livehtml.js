LiveHTML = {
  shiftOn: false,
  
  widgets: [],
  
  init: function(args) {
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
    $('a,img').live('click', function(){
      var href = $(this).attr('href');
      if (!href || href[0] != "#") return true;
      Viewer.go(href.slice(1));
      return false;
    });
  },

  dispatch: function(method, args) {
    things = [This.mode].concat(LiveHTML.widgets, [Viewer]);
    return things.dispatch.apply(things, arguments);
  },

  trigger: function(method, args) {
    things = [This.mode].concat(LiveHTML.widgets, [Viewer]);
    return things.trigger.apply(things, arguments);
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
        LiveHTML.dispatch(method, This);
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
        LiveHTML.dispatch(method, This);
    if (data[method]) obj.show();
    else obj.hide();
  });
  this.find('form').enable().unbind('submit').submit(function(){
    $(this).disable();
    if (this.id)
      LiveHTML.dispatch(this.id + "_submitted", $(this).form_values(), This, this);
    var action = $(this).attr('action');
    if (action) Viewer.go(action.slice(1), $(this).form_values());
    return false;
  });
  this.find('[observe]').each(function(){
    var obj = $(this);
    var method = obj.attr('observe');
    obj.change(function(){
      LiveHTML.dispatch(method, obj.val(), This);
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
