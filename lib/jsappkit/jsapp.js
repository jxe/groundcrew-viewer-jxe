This = { mode: {} };

function JSApp(subclass){
  $.extend(this, subclass);
}

$.extend(JSApp.prototype, {
  
  go: function(url, form_data) {
    if (!this.initted) { this.init(); this.initted = true; }
    if (url == '#' || url == '') return;
    if (url[0] == '@') return this.open(url.slice(1));
    if (url[0] == '#') return LiveHTML.dispatch(url.slice(1), This);
    This.prev_loc = This.loc;
    This.loc = this.normalize_url(url);
    This.form_data = form_data;
    console.log('App.go('+This.loc+')');
    This.url_parts = This.loc.slice(1).split('/');
    this.consume_url_parts(this.app_url_prefixes);
    this.consume_url_parts(This.mode.url_parts);
    this.render_state();
  },
  
  update: function(key, new_value) {
    var old_value = This[key];
    This[key] = new_value;
    if (old_value != new_value) LiveHTML.trigger("set_" + key, new_value);
  },
  
  set_mode_name: function(mode_name) {
    var mode = App.modes[This.mode_name];
    if (!mode) { alert('invalid url: ' + This.loc); return; }
    this.update('mode', mode);
  },
  
  consume_url_parts: function(args) {
    for (var i=0; i < args.length; i++)
      this.update(args[i], This.url_parts.shift());
  },
  
  normalize_url: function(url) {
    if (url == '..')   return This.loc.slice(0, This.loc.lastIndexOf('/'));
    if (url.startsWith('../')) return This.loc.slice(0, This.loc.lastIndexOf('/')) + url.slice(2);
    if (url.startsWith('//')) return this.normalize_url(this.base_url_prefix + url.slice(2));
    if (url[0] != '/') return This.loc + '/' + url;

    url = url.replace(/\/:(\w+)/g, function(x, attr){ 
      if (This[attr]) return '/' + This[attr];
      return '';
    });
    url = url.replace(/\/+/g, '/');
    return url;
  },
  
  render_state: function() {
    var renderer = "show_root";
    var parts = This.mode.url_parts;
    for (var i=0; i < parts.length; i++) {
      if (This[parts[i]]) renderer = "show_" + parts[i];
      else break;
    };

    This.rendered = false;
    if (This.mode[renderer]) This.mode[renderer]();
    if (!This.rendered) this.render(renderer);
  },
  
  back: function() {
    Viewer.go(This.prev_loc);
  }
  
});
