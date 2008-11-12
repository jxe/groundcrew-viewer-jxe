////
// This is the "Application" controller and selection model
//
Viewer = {
  loc: '',
  apps: {},
  current_app: null,
  prev_agents: null,

  go: function(url) {
    // adjust url
    url = url.replace(/:(\w+)/g, function(x, attr){ return Viewer.current_app.state[attr]; });
    if (url == '..') return Viewer.go(Viewer.loc.slice(0, Viewer.loc.lastIndexOf('/')));
    if (url[0] == '#') return Viewer.current_app[url.slice(1)](Viewer.current_app.state);
    if (!url.startsWith('/')) url = Viewer.loc + '/' + url;
    if (url == '/') url = "/mobilize";
    Viewer.loc = url;
    Map.Gmap && Map.Gmap.closeInfoWindow();
    
    // check some components
    var part = url.slice(1).split('/');
    var app_name = part.shift();
    var app = Viewer.apps[app_name];
    if (!app) { alert('invalid url: ' + url); return; }
    
    // configure application with url data, choose renderer, build breadcrumbs
    if (Viewer.current_app != app) {
      app.state = { first: true };
      $('body').removeClass(Viewer.current_app_name + "_app").addClass(app_name + "_app");
    }
    Viewer.current_app_name = app_name;
    Viewer.current_app = app;
    var state = app.state;
    var changed = {};
    var renderer;
    var breadcrumbs = [];
    var breadcrumb_url = '#/' + app_name;
    $.each(app.url_part_labels, function(i, label){
      var x = part[i];
      if (state[label] != x || state.first) {
        state[label] = x;
        changed[label] = true;
        if (Viewer["set_" + label]) Viewer["set_" + label](x, state, changed);
        if (app["set_" + label]) app["set_" + label](x, state, changed);
      }
      if (!x && !renderer) renderer = label + "_index";
      if (x) {
        var breadcrumb_label = state[label + "_label"];
        if (!breadcrumb_label && label == 'city') breadcrumb_label = cities[x.split('__')[1]];
        if (!breadcrumb_label) breadcrumb_label = x;
        breadcrumb_url += "/" + x;
        breadcrumbs.push(" &raquo;");
        breadcrumbs.push(tag('a', {href:breadcrumb_url, content:breadcrumb_label}));
      }
    });
    if (!renderer) renderer = "show_" + app.url_part_labels.last();
    if (Viewer.prev_renderer) $('body').removeClass(Viewer.prev_renderer);
    Viewer.prev_renderer = renderer;

    // fill in breadcrumbs
    // breadcrumbs.pop().pop();
    $('#more_breadcrumbs').html(breadcrumbs.join(' ')).feature_paint();
    
    // update agents, facebar, and map city
    Viewer.selected_city = state.city && state.city.resource_id();
    Viewer.item = state.item;
    if (Viewer.prev_agents != state.agents || !Viewer.prev_agents) {
      if (!state.agents)
        state.agents = state.city ? Agents.in_city(state.city) : Agents.all;
      MapMarkers.display(state.city, state.agents);
      Facebar.populate(state.agents);
      Viewer.prev_agents = state.agents;
    }
    
    // run renderer
    app[renderer] && app[renderer](state);
    $('body').addClass(renderer);
        
    // clean up
    delete state.first;
  },
    
  set_city: function(city, state, changed) {
    delete state.agents;
    if (!state.city) CityChooser.update();
  },

  open: function(tag) {
    Viewer.current_app.marker_clicked(tag, Viewer.current_app.state);
  },
  
  
  // functions
  
  zoom_out: function(){ Viewer.go('/'); return false; },

  join_please: function() {
    $.facebox($('#join_fbox').html());
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
    if (!data[method]) data[method] = Viewer.current_app[method](Viewer.current_app.state);
    if (attr) obj.attr(attr, data[method]);
    else obj.html(data[method]);
  });
  this.find('form').unbind('submit').submit(function(){
    try {
      var form = $(this);
      Viewer.current_app.form_submit(form.form_values(), Viewer.current_app.state, form);
    } catch (err) {
      alert('form error!');
      console.log(err);
      return false;
    }
    return false;
  });
  return this.feature_paint();
};
