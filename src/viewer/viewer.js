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
    if (Viewer.current_app.marker_clicked)
      if (Viewer.current_app.marker_clicked(tag, Viewer.current_app.state))
        return;
    Viewer.go('/organize/your_personal_squad/:city/' + tag);
  },

  dispatch: function(method, args) {
    var args = $.makeArray(arguments);
    var method = args.shift();
    var f = Viewer.current_app[method];
    if (f) f.apply(Viewer.current_app, args);
    if (Viewer[method]) Viewer[method].apply(Viewer, args);
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
      Facebar.populate(state.agents);
      Viewer.prev_agents = state.agents;
    }
    
    // run renderer
    Viewer.rendered = false;
    app[renderer] && app[renderer](state);
    if (!Viewer.rendered) Viewer.render(renderer);
    
    // clean up
    $('#more_breadcrumbs').html(Viewer.breadcrumbs()).feature_paint();
    delete state.first;
  },
  
  breadcrumbs: function() {
    var app_name = Viewer.current_app_name;
    var app = Viewer.current_app;
    var state = app.state;
    var breadcrumbs = [];
    var breadcrumb_url = '#/' + app_name;
    
    $.each(app.url_part_labels, function(i, label){
      var x = state[label];
      if (x) {
        breadcrumb_url += "/" + x;
        var breadcrumb_label = state[label + "_label"] || x;
        breadcrumbs.push(" &rsaquo;");
        breadcrumbs.push(tag('a', {href:breadcrumb_url, content:breadcrumb_label}));
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
    $('.nh').app_paint();
    $('#' + app_name + "_" + renderer).app_paint();
    Viewer.rendered = true;
  },
  
    
  set_city: function(city, state) {
    delete state.agents;
    if (!city) CityChooser.update();
    if (city) state.city_label = cities[city.split('__')[1]];
    Viewer.selected_city = city && city.resource_id();
  },

  set_item: function(item, state) {
    state.item_r = item && item.resource();
    state.item_label = item && state.item_r.title;
    Viewer.item = item;
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
  
  toggle_paddle: function(state) {
    $('.nh').toggleClass('extended');
  },
  
  
  adventures: function(state) {
    var projects = wishes.map(function(a){ return Viewer.apps.hero.proj_t.t(a); }).join('');
    
    return adventures.map(function(a){ return Viewer.apps.hero.adventure_t.t(a); }).join('') + projects;
  },
  

  agents_to_guide: function(state) {
    var agents = Agents.find("=city_id " + Viewer.selected_city);
      
    return agents.map(function(a){ 
      a.wants = agent_wants(a);
      a.time = ['20 MIN', '1 HR', '5 MIN'].choose_random();
      return Viewer.apps.hero.agent_t.t(a);
    }).join('');
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
    
  // functions
  
  zoom_out: function(){ Viewer.go('/'); return false; },

  join_please: function() {
    $.facebox($('#join_fbox').html());
  },
  
  
  // dyn fills
  ag_ct:          function(state) { return pluralize(state.agents.length, 'agent'); },
  item_thumb_url: function(state) { return "http://groundcrew.us/"+state.item_r.thumb_url; },
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
