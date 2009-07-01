////
// This is the "Application" controller
//
Viewer = App = {
  modes: {},
  tools: {},
  most_recent_tool: {},
  
  update: function(changed) {
    if (changed.squad) {
      if (This.squad == 'demo') {
        $.ajaxSetup({async: false});
        $.getScript('/data/demo.js');
        $.ajaxSetup({async: true});
      }
    }
    
    if (changed.item) {
      if (!This.mode) set('mode', 'Dispatch');
      
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
    
    if (changed.city) {
      This.city_id = This.city && This.city.resource_id();
      set('agents', Agents.here());
      if (This.city) $('body').removeClass('zoomed_out');
      else $('body').addClass('zoomed_out');
    }
    
    if (changed.agents) {
      MapMarkers.display(This.city, This.agents);
      Frame.populate_flexbar_agents(This.agents);
      components.trigger('city_changed', This.city);
    }
    
    if (changed.mode) {
      $('#modetray').app_paint().show();
      $('.' + This.mode + '_mode').activate('mode');
      // if (This.mode == 'plan') $('#flexbar_banner').hide();
      // else $('#flexbar_banner').show();
      Frame.resize();

      This.first_responders[0] = {};
      This.first_responders[1] = App.modes[This.mode.toLowerCase()] || {};

      if (!changed.tool) set('tool', App.most_recent_tool[This.mode] || Console.tools[This.mode] && Console.tools[This.mode][0].split('//')[0]);
    }
    
    if (changed.tool) {
      App.most_recent_tool[This.mode] = This.tool;
      $('.' + This.tool + '_tool').activate('tool');
      This.first_responders[0] = App.tools[This.tool] || {};
    }
    
    if (changed.item || changed.tool || changed.mode) App.refresh_mapwindow();
    
    dispatch('render', changed);
  },
  
  refresh_mapwindow: function() {
    if (!This._item) Map.Gmap.closeInfoWindow();
    else {
      var thing = This.item.split('__')[0].toLowerCase();
      var best_mapwindow_template = $.template('#' + thing + '_for_' + This.tool + '_tool') || $.template('#' + thing + '_for_' + This.mode.toLowerCase() + '_mode') || $.template('#' + thing + '_for_any_mode');
      if (best_mapwindow_template) MapMarkers.window(best_mapwindow_template);
      else Map.Gmap.closeInfoWindow();
    }
  },
  
  map_clicked: function() {
    return;
  },
  
  
  // ======================
  // = App initialization =
  // ======================
  
  init: function() {
    // init the UI
    Frame.init();
    LiveHTML.init();
    $('body').removeClass('loading');

    // set up app state
    CEML.parse($('#idea_bank').html());
    if (window.location.hash) go(window.location.hash.slice(1));
    else go('squad=demo;city=');
    
    // start communication with server
    Ajax.init();
  },
  
  render: function(changed) {
    //...
  },
  
  go_to_self: function() {
    go('@' + This.user.tag);
  },
  
  setmode: function(mode) {
    if (This.mode != mode) return go('mode=' + mode);
    else {
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
  
  
  plan_mode: function() { App.setmode('plan'); },
  listen_mode: function() { App.setmode('listen'); },
  coordinate_mode: function() { App.setmode('coordinate'); }
};
