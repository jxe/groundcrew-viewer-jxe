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
    url = url.replace(/:(\w+)/, function(x, attr){ return Viewer.current_app.state[attr]; });
    if (url == '..') return Viewer.go(Viewer.loc.slice(0, Viewer.loc.lastIndexOf('/')));
    if (!url.startsWith('/')) url = Viewer.loc + '/' + url;
    if (url == '/') url = "/mobilize";
    Viewer.loc = url;
    
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
    $('#more_breadcrumbs').html(breadcrumbs.join(' '));
    
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
    
    // update body classes and blit
    $(document).blit();
    $('.divcenter').center();
    
    // clean up
    delete state.first;
  },
    
  set_city: function(city, state, changed) {
    delete state.agents;
    if (!state.city) CityChooser.update();
  },


  // functions

  zoom_out: function(){ Viewer.go('/'); return false; },

  join_please: function() {
    $.facebox($('#join_fbox').html());
  }

};
