var components = [];

////
// This is the "Application" controller and selection model
//
Viewer = {
  loc: '',
  prev_loc: null,
  apps: {},
  current_app: { state: { app: 'mobilize' }},
  prev_agents: null,
  rendered: false,

  open: function(tag) {
    $.unreveal();
    if (!Viewer.selected_city) {
      var city_id = tag.resource().city_id;
      Viewer.go('/organize/your_personal_squad/City__' + city_id + '/' + tag);
    } else {
      [Viewer.current_app, Viewer].dispatch('marker_clicked', tag, Viewer.current_app.state);
    }
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
    if (url.startsWith('../')) return Viewer.loc.slice(0, Viewer.loc.lastIndexOf('/')) + url.slice(2);
    if (url[0] != '/') return Viewer.loc + '/' + url;

    return url.replace(/\/:(\w+)/g, function(x, attr){ 
      if (Viewer.current_app.state[attr]) return '/' + Viewer.current_app.state[attr];
      return '';
    });
  },

  back: function() {
    Viewer.go(Viewer.prev_loc);
  },

  go: function(url, form_data) {
    // adjust url
    if (url[0] == '#') return Viewer.dispatch(url.slice(1), Viewer.current_app.state);
    Viewer.prev_loc = Viewer.loc;
    url = Viewer.loc = Viewer.parse_url(url);
    console.log('Viewer.go('+url+')');
    var parts = url.slice(1).split('/');
    var app_name = parts.shift();
    
    // switch apps if necessary
    if (!Viewer.apps[app_name]) { alert('invalid url: ' + url); return; }
    if (app_name != Viewer.current_app_name) {
      $('body').removeClass(Viewer.current_app_name + "_app").addClass(app_name + "_app");
      Viewer.apps[app_name].state = { first: true, app: app_name, agents: Viewer.current_app.state.agents };
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
    state.form_data = form_data;
    
    // update agents, facebar, and map city
    if (!state.agents) state.agents = state.city ? Agents.in_city(state.city) : Agents.all;
    if (Viewer.prev_agents != state.agents || !Viewer.prev_agents) {
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

    // push World
    breadcrumbs.push(tag('option', {value:'/welcome', content:'World'}));

    $.each(app.url_part_labels, function(i, label){
      var x = state[label];
      if (x) {
        breadcrumb_url += "/" + x;
        var breadcrumb_label = state[label + "_label"] || x;
        var label_max = 25;
        if (breadcrumb_label.length > label_max) {
          breadcrumb_label = breadcrumb_label.slice(0, label_max) + ' ...';
        }
        breadcrumbs.push(tag('option', {value:breadcrumb_url, content:breadcrumb_label}));
      }
    });
    return breadcrumbs.join(' ');
  },

  render: function(renderer) {
    var app_name = Viewer.current_app_name;
    var app = Viewer.current_app;
    var state = app.state;
    
    $.unreveal();
    if (Viewer.renderer) $('body').removeClass(Viewer.renderer);
    if (Viewer.painted_elements) Viewer.painted_elements.offscreen();
    
    Viewer.renderer = renderer;
    Viewer.painted_elements = $("." + app_name + "." + Viewer.renderer);
    
    Viewer.painted_elements.onscreen().app_paint();
    $('body').addClass(renderer);

    Viewer.rendered = true;
  },
  
  render_item: function(template_name, min_zoom) {
    if (Viewer.renderer) $('body').removeClass(Viewer.renderer);
    if (Viewer.painted_elements) Viewer.painted_elements.offscreen();
    Viewer.renderer = null;
    Viewer.painted_elements = null;    
    MapMarkers.open(Viewer.current_app.state.item, $.template('#' + template_name + '_iw').app_paint()[0], min_zoom);
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
