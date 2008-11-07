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
    url = url.replace('CITY', Viewer.current_app && Viewer.current_app.state.city);
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
    if (Viewer.prev_agents != state.agents || !Viewer.prev_agents) {
      ItemDb.agents_by_city = ItemDb.index_all_items_by(['city_id']);
      if (!state.agents) {
        if (state.city) state.agents = City.agents_in_city(state.city);
        else            state.agents = ItemDb.all_items();
      }
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





  
  open: function(thing) {
    var item_and_type = Viewer.resolve(thing);
    var item = item_and_type[0];
    var type = item_and_type[1];
    if (!type) return;
    var city_id = item.city_id || (type == 'city' && item);
    if (city_id && Number(city_id) != Number(Viewer.selected_city)) Viewer.select_city(city_id);
    MapMarkers.open(item, type);
    if (type == 'agent') Facebar.selected_agent(item);
  },
  

  // functions

  city_summary: function() {
    Viewer.open(Viewer.selected_city);
    return false;
  },

  zoom_out: function(){ 
    Viewer.go('/');
    return false;
  },

  go_to_self: function() {
    Viewer.open(person_item);
    return false;
  },

  join_please: function() {
    $.facebox($('#join_fbox').html());
  },



  // old!!
  
  close: function(thing) {
    if (this.iw_item_type == 'agent') Facebar.selected_agent(null);
    MapMarkers.close(thing);
  },

  resolve: function(item) {
    if (item[0] == 'P') return [ItemDb.items[item], 'agent'];
    if (item[0] == 'L') {
      return [LandmarkDb.find_by_tag(item), 'lmark'];
      // if (readyto) {
      //   var i = Initiative.createLocal('gathering', readyto, {landmark_tag:item});
      //   return [i, 'gathering'];
      // }
    }
    if (item[0] == 'A') return [Initiatives.all[item], 'gathering'];
    if (Number(item)) return [item, 'city'];
    alert('unrecognized viewer object:  ' + item);
    console.log(item);
    return [false, false];
  }

};
