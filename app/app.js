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
      if (!This.mode) set('mode', 'mobilize');
      
      if (!This.item) set('city', null);
      else if (This.item.startsWith('City__')) set('city', This.item);
      else {
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
      This.first_responders[1] = App.modes[This.mode] || {};

      if (!changed.tool) set('tool', App.most_recent_tool[This.mode] || Console.tools[This.mode] && Console.tools[This.mode][0].split('//')[0]);
    }
    
    if (changed.tool) {
      App.most_recent_tool[This.mode] = This.tool;
      $('.' + This.tool + '_tool').activate('tool');
      This.first_responders[0] = App.tools[This.tool] || {};
    }
    
    dispatch('render', changed);
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
