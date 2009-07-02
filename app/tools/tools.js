App.tools.approve_deputies = {
  
  map_clicked: function() {
    alert("You clicked the fuckin map, at "+This.click_lat+", "+This.click_lng+".");
  }
  
};

App.tools.add_landmark = {
  
  map_clicked: function() {
    map.openInfoWindow(This.click_latlng, $.template('#new_landmark_template')[0]);
  },
  
  reveal: function(changed) {
    if (changed.item) {
      alert('display item here!');
    }
  }
  
};

App.modes.dispatch = {
  
  did_add_events: function(state) {
    App.refresh_mapwindow();
  },

  live_event_info: function (state) {
    return Actions.event_t.tt(This._item.children);
  }
  
};

App.tools.assign_agents = {
    
  make_it_happen_form_submitted: function(data) {
    Operation.assign(This.item, data.assign, function(operation){
      go('@' + operation.id);
    });
  }
  
};
