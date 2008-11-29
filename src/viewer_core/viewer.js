////
// This is the "Application" controller and selection model
//
Viewer = {
  loc: '',
  apps: {},
  current_app: { state: { app: 'mobilize' }},
  prev_agents: null,

  go: function(url) {
    // adjust url
    url = url.replace(/\/:(\w+)/g, function(x, attr){ 
      if (Viewer.current_app.state[attr]) return '/' + Viewer.current_app.state[attr];
      return '';
    });
    if (url == '..') return Viewer.go(Viewer.loc.slice(0, Viewer.loc.lastIndexOf('/')));
    if (url[0] == '#') {
      var method = url.slice(1);
      var f = Viewer.current_app[method] || Viewer[method];
      return f(Viewer.current_app.state);
    }
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
      app.state = { first: true, app: app_name };
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
    $('#' + app_name + "_" + renderer).app_paint();
    
    // clean up
    delete state.first;
  },
    
  set_city: function(city, state, changed) {
    delete state.agents;
    if (!state.city) CityChooser.update();
  },

  set_item: function(item, state, changed) {
    state.item_r = item && item.resource();
    state.item_label = item && state.item_r.title;
  },

  new_landmark: function(state) {
    if (!logged_in) return Viewer.join_please();
    $.template('#new_landmark_dialog').show_dialog(function(form){
      Ajax.fetch('/gc/create_landmark', form, function(ev){
        EventDb.add(ev);
        Viewer.go('');
      });
    });
  },
  
  limit_ltype: function(state, how) {
    if (state.ltype == how) how = null;
    state.ltype = how;
    $('#lm_limits').attr('limit', how || 'all');
    $('select[fill=lm_select]').html(Viewer.lm_select(state));
  },
  
  lm_select: function(state) { 
    if (!state.ltype) return Landmarks.in_city(state.city).as_option_list();
    return Landmarks.in_city(state.city, ":ltypes " + state.ltype).as_option_list();
  },
  
  limit_park: function(state)   { Viewer.limit_ltype(state, 'park'); },
  limit_cafe: function(state)   { Viewer.limit_ltype(state, 'cafe'); },
  limit_street: function(state) { Viewer.limit_ltype(state, 'street'); },
  limit_room: function(state)   { Viewer.limit_ltype(state, 'room'); },
  

  open: function(tag) {
    if (Viewer.current_app.marker_clicked)
      if (Viewer.current_app.marker_clicked(tag, Viewer.current_app.state))
        return;
    Viewer.go('/organize/your_personal_squad/:city/' + tag);
  },
  
  // functions
  
  zoom_out: function(){ Viewer.go('/'); return false; },

  join_please: function() {
    $.facebox($('#join_fbox').html());
  },
  
  
  // dyn fills
  ag_ct:          function(state) { return pluralize(state.agents.length, 'agent'); },
  item_thumb_url: function(state) { return state.item_r.thumb_url; },
  item_title:     function(state) { return state.item_r.title; },
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
  this.find('[observe]').each(function(){
    var obj = $(this);
    var method = obj.attr('observe');
    obj.change(function(){
      Viewer.current_app[method](obj.val(), Viewer.current_app.state);
      return true;
    });
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
  if (this.is('.divcenter')) this.center();
  return this.feature_paint();
};
