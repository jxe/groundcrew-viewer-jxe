LiveHTML = {
  
  init: function(args) {
    $('[reveal]').live('click', function(){
      $('#' + $(this).attr('reveal')).toggle_reveal();
      return false;
    });
    $('a').live('click', function(){
      var href = $(this).attr('href');
      if (href[0] != "#") return true;
      Viewer.go(href.slice(1)); 
      return false;
    });
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
    if (!data[method] && Viewer.current_app.state[method]) 
      data[method] = Viewer.current_app.state[method];
    if (!data[method]) {
      var f = Viewer.current_app[method] || Viewer[method];
      if (f) data[method] = f(Viewer.current_app.state);
      else   alert('missing fill method: ' + method);
    }
    if (data[method]) {
      if (attr) obj.attr(attr, data[method]);
      else      obj.html(data[method]);
    }
  });
  this.find('form').enable().unbind('submit').submit(function(){
    try {
      $(this).disable();
      var method = this.id + "_submitted";
      if (!Viewer.current_app[method]) alert('unusual form submit!');
      Viewer.current_app[method]($(this).form_values(), Viewer.current_app.state, this);
    } catch (err) {
      alert('form error!');
      console.log(err);
      return false;
    }
    return false;
  });
  this.find('[observe]').each(function(){
    var obj = $(this);
    var method = obj.attr('observe');
    obj.change(function(){
      Viewer.dispatch(method, obj.val(), Viewer.current_app.state);
      return true;
    });
  });
  return this;
};
