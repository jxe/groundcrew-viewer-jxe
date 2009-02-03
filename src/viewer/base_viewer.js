var components = [];

////
// This is the "Application" controller and selection model
//
Viewer = {
  loc: '',
  apps: {},
  current_app: { state: { app: 'mobilize' }},
  prev_agents: null,
  rendered: false,

  open: function(tag) {
    $('#welcome').remove();
    unreveal();
    [Viewer.current_app, Viewer].dispatch('marker_clicked', tag, Viewer.current_app.state);
  },
  
  marker_clicked: function(tag) {
    Viewer.go('/organize/your_personal_squad/:city/' + tag);
  },

  breadcrumb_change: function(new_url, state) {
    Viewer.go(new_url);
  },

  dispatch: function(method, args) {
    var args = $.makeArray(arguments);
    var method = args.shift();
    return [Viewer.current_app, Viewer].dispatch(method, args[0], args[1], args[2], args[3]);
  },
  
  parse_url: function(url) {
    if (url == '..')   return Viewer.loc.slice(0, Viewer.loc.lastIndexOf('/'));
    if (url[0] != '/') return Viewer.loc + '/' + url;
    return url.replace(/\/:(\w+)/g, function(x, attr){ 
      if (Viewer.current_app.state[attr]) return '/' + Viewer.current_app.state[attr];
      return '';
    });
  },

  go: function(url) {
    // adjust url
    if (url[0] == '#') return Viewer.dispatch(url.slice(1), Viewer.current_app.state);
    url = Viewer.loc = Viewer.parse_url(url);
    var parts = url.slice(1).split('/');
    var app_name = parts.shift();
    
    // switch apps if necessary
    if (!Viewer.apps[app_name]) { alert('invalid url: ' + url); return; }
    if (app_name != Viewer.current_app_name) {
      $('body').removeClass(Viewer.current_app_name + "_app").addClass(app_name + "_app");
      Viewer.apps[app_name].state = { first: true, app: app_name };
      Viewer.current_app_name = app_name;
    }
    var app = Viewer.current_app = Viewer.apps[app_name];

    // extract url part info into state
    var state = app.state;
    var renderer = "show_root";
    $.each(app.url_part_labels, function(i, label){
      var x = parts[i];
      if (state[label] != x || state.first) {
        state[label] = x;
        Viewer.dispatch("set_" + label, x, state);
      }
      if (x) renderer = "show_" + label;
    });
    
    // update agents, facebar, and map city
    if (Viewer.prev_agents != state.agents || !Viewer.prev_agents) {
      if (!state.agents)
        state.agents = state.city ? Agents.in_city(state.city) : Agents.all;
      MapMarkers.display(state.city, state.agents);
      Frame.populate_flexbar_agents(state.agents);
      Viewer.prev_agents = state.agents;
    }
    
    // run renderer
    Viewer.rendered = false;
    app[renderer] && app[renderer](state);
    if (!Viewer.rendered) Viewer.render(renderer);
    
    // clean up
    $('#breadcrumbs').html(Viewer.breadcrumbs()).val(url);
    delete state.first;
  },
  
  breadcrumbs: function() {
    var app_name = Viewer.current_app_name;
    var app = Viewer.current_app;
    var state = app.state;
    var breadcrumbs = [];
    var breadcrumb_url = '/' + app_name;
    
    $.each(app.url_part_labels, function(i, label){
      var x = state[label];
      if (x) {
        breadcrumb_url += "/" + x;
        var breadcrumb_label = state[label + "_label"] || x;
        breadcrumbs.push(tag('option', {value:breadcrumb_url, content:breadcrumb_label}));
      }
    });
    return breadcrumbs.join(' ');
  },
  
  render: function(renderer) {
    var app_name = Viewer.current_app_name;
    var app = Viewer.current_app;
    var state = app.state;
    
    // Map.Gmap && Map.Gmap.closeInfoWindow();
    if (Viewer.prev_renderer) $('body').removeClass(Viewer.prev_renderer);
    
    Viewer.prev_renderer = renderer;
    $('body').addClass(renderer);
    $('.palette').app_paint();
    $('#' + app_name + "_" + renderer).app_paint();
    Viewer.rendered = true;
  },
  
  set_city: function(city, state) {
    delete state.agents;
    if (!city) CityChooser.update();
    if (city) state.city_label = cities[city.split('__')[1]];
    Viewer.selected_city = city && city.resource_id();
    components.trigger('city_changed', city);
  },

  set_item: function(item, state) {
    Viewer.item = item;
    if (!item) return state.agents = null;
    state.item_r = item && item.resource();
    if (!state.item_r) alert("no item lookup for: " + item);
    state.item_label = state.item_r.title;
  },

      
  // functions
  
  zoom_out: function(){ Viewer.go('/'); return false; },
  
  
  // dyn fills
  
  blank:       function(){ return ''; }

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
  return this.feature_paint();
};
