////
// This is the "Application" controller
//
Viewer = App = {
  modes: {},
  
  update: function(changed) {
    if (changed.squad) {
      if (This.squad == 'demo') {
        $.ajaxSetup({async: false});
        $.getScript('/data/demo.js');
        $.ajaxSetup({async: true});
      }
    }
    
    if (changed.item) {
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
    }
    
    if (changed.agents) {
      MapMarkers.display(This.city, This.agents);
      Frame.populate_flexbar_agents(This.agents);
      components.trigger('city_changed', This.city);
    }
    
    if (changed.mode) {
      $('#mode_tray').attr('mode', This.mode || '');
      This.first_responders[0] = {};
      This.first_responders[1] = App.modes[This.mode];
    }
    
    if (changed.tool) {
      This.first_responders[0] = App.tools[This.tool];
    }
    
    dispatch('render', changed);
    $('.magic').app_paint();
  },
    
  
  // ======================
  // = App initialization =
  // ======================
  
  init: function() {
    // init the UI
    Frame.init();
    LiveHTML.init();
    $('body').addClass( This.user.logged_in ? 'logged_in' : 'logged_out' );
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
  }
    
};
