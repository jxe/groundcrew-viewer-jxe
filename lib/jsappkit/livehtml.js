LiveHTML = {
  
  widgets: [],
  
  init: function(args) {
    $('[reveal]').live('click', function(){
      var reveal = $(this).attr('reveal').split(' ');
      $('#' + reveal[0]).toggle_reveal(reveal[1], reveal[2], $(this));
      return false;
    });
    $('.menu a').live('click', function(){
      $(this).blink();
    });
    $('a').live('click', function(){
      var href = $(this).attr('href');
      if (href[0] != "#") return true;
      Viewer.go(href.slice(1)); 
      return false;
    });
  },

  dispatch: function(method, args) {
    things = [Viewer.current_app].concat(LiveHTML.widgets, [Viewer]);
    return things.dispatch.apply(things, arguments);
  },

  trigger: function(method, args) {
    things = [Viewer.current_app].concat(LiveHTML.widgets, [Viewer]);
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
      data[method] = Viewer.current_app.state[method] ||
        LiveHTML.dispatch(method, Viewer.current_app.state);
    if (data[method]) {
      if (attr) obj.attr(attr, data[method]);
      else      obj.html(data[method]);
    }
  });
  this.find('[if]').each(function(){
    var obj = $(this);
    var method = obj.attr('if');
    if (!data[method]) 
      data[method] = Viewer.current_app.state[method] ||
        LiveHTML.dispatch(method, Viewer.current_app.state);
    if (data[method]) obj.show();
    else obj.hide();
  });
  this.find('form').enable().unbind('submit').submit(function(){
    $(this).disable();
    LiveHTML.trigger(this.id + "_submitted", $(this).form_values(), Viewer.current_app.state, this);
    var action = $(this).attr('action');
    if (action) Viewer.go(action.slice(1), $(this).form_values());
    return false;
  });
  this.find('[observe]').each(function(){
    var obj = $(this);
    var method = obj.attr('observe');
    obj.change(function(){
      LiveHTML.dispatch(method, obj.val(), Viewer.current_app.state);
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
