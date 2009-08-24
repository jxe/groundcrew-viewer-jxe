////
// This is the "Application" controller
//
Viewer = App = {
  modes: {},
  tools: {},
  most_recent_tool: {},
  
  search_form_submitted: function(data, state, form) {
    go('q=' + data.q);
    $(form).enable();
  },
  
  clear_query: function() {
    $('#search').val('');
    go('q=');
  },
  
  query: function() {
    return This.q;
  },
    
  update: function(changed) {
    if (changed.tool && This.tool && This._item && !changed.item) set('item', This.city);
    
    if (changed.item) {
      if (!This.item) {
        This._item = null;
        set('city', null);
      } else if (This.item.startsWith('City__')) {
        This._item = null;
        set('city', This.item);
      } else {
        This._item = This.item && This.item.resource();
        set('city', 'City__' + This._item.city_id);
      }
    }
    
    if (changed.city || changed.q) {
      This.city_id = This.city && This.city.resource_id();
      set('agents', Agents.here());
      if (This.city) $('body').removeClass('zoomed_out');
      else $('body').addClass('zoomed_out');
    }
    
    if (changed.city) Map.clear_layer('landmarks');

    if (changed.agents) {
      Frame.populate_flexbar_agents(This.agents);
      trigger('city_changed', This.city);
      Map.clear_layer('agents');
    }
    
    if (changed.mode) {
      if (This.mode != '') $('#modetray').app_paint().show();
      else $('#modetray').hide();
      $('.' + This.mode + '_mode').activate('mode');
      Frame.resize();

      This.first_responders[0] = {};
      This.first_responders[1] = App.modes[This.mode.toLowerCase()] || {};

      // if (!changed.tool) set('tool', App.most_recent_tool[This.mode] || Console.tools[This.mode] && Console.tools[This.mode][0].split('//')[0]);
      
      // trigger(This.mode + "_mode_activated");
    }
    
    if (changed.tool) {
      App.most_recent_tool[This.mode] = This.tool;
      $('.' + This.tool + '_tool').activate('tool');
      This.first_responders[0] = App.tools[This.tool] || {};
      // trigger(This.tool + "_tool_activated");
    }
    
    set('map_layers', Console.map_layers_for_current_settings());
    
    var map_unfocused = changed.city;
    $.each($w('cities agents landmarks wishes'), function(){
      if (This.map_layers.contains(this)) {
        Map.show_layer(this, map_unfocused);
        map_unfocused = false;
      } else {
        Map.hide_layer(this);
      }
    });
    
    if (changed.item || changed.tool) App.refresh_mapwindow();
    
    $('.magic').app_paint();
    $('.hud:visible').app_paint();

  },
  
  refresh_mapwindow: function() {
    if (!This._item) {
      Map.Gmap.closeInfoWindow();
    }
    else {
      var thing = This.item.split('__')[0].toLowerCase();
      var best_mapwindow_template = $.template('#' + thing + '_for_' + This.tool + '_tool') || $.template('#' + thing + '_for_' + This.mode.toLowerCase() + '_mode') || $.template('#' + thing + '_for_any_mode');
      if (best_mapwindow_template) MapMarkers.window(best_mapwindow_template);
      else {
        //TODO:  if there's no template, there should be no selection
        Map.Gmap.closeInfoWindow();
      }
    }
  },
  
  map_clicked: function() {
    return;
  },
  
  did_add_events: function(state) {
    App.refresh_mapwindow();
  },

  live_event_info: function (state) {
    return Actions.event_t.tt(This._item.children);
  },
  
  
  // ======================
  // = App initialization =
  // ======================
  
  init: function() {
    // init the UI
    Frame.init();
    LiveHTML.init();
    $('body').removeClass('loading');
    Map.establish();

    // start communication with server
    Ajax.init();
    
    if (window.location.hash) Ajax.go_on_load = window.location.hash.slice(1);
    else Ajax.go_on_load = 'squad=demo;city=';
    
    Ajax.maybe_trigger_load();
    
    // set up app state
    // CEML.parse($('#idea_bank').html());
  },
    
  go_to_self: function() {
    go('@' + This.user.tag);
  },
  
  radial_invite_form_submitted: function(data, state) {
    Operation.invite(This.item, data.title, data.assignment, function(operation){
      go('@' + operation.id);
    });
  },
  
  setmode: function(mode) {
    if (This.mode != mode) return go('mode=' + mode);
    else {
      if (mode == 'dispatch') return;
      $('#modetray').toggle();
      Frame.resize();
    }
  },  
  
  go_where: function() {
    var where = prompt("Find:");
    if (!where) return;
    var tabAccuracy = new Array(2,4,6,10,12,13,16,16,17);
    var geocoder = new GClientGeocoder();
    geocoder.getLocations(where, function(response) {
      if(response.Status.code==200){
        place = response.Placemark[0];
        accuracy = place.AddressDetails.Accuracy;
        map.setCenter(new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]), tabAccuracy[accuracy]); 
        go('city=' + City.closest());
      }
    });
  },
  
  
  assess_mode: function() { App.setmode('assess'); },
  manage_mode: function() { App.setmode('manage'); },
  dispatch_mode: function() { App.setmode(''); },
};
