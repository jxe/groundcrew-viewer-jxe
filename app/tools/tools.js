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
    
  make_it_happen_form_submitted: function(data, state) {
    Operation.assign(This.item, data.assign, function(operation){
      go('@' + operation.id);
    });
  },
  
  
  agent_assignable: function(state) {
    // return true;
    return This._item.availability_status != 'inaccessible';
  },

  agent_latched_and_assigned: function(state) {
    return This._item.availability_status == 'assigned';
  },
  
  agent_unlatched: function(state) {
    return true;
  },
  
  agent_assign_prompt: function() {
    if (This._item.availability_status == 'assigned') {
      return "Change this agent's assignment?";
    } else {
      return "What would you like this agent to do?";
    }
  },
  
  make_it_happen_form_submitted: function(data, state) {
    Operation.assign(This.item, data.assign, function(operation){
      // go('@' + operation.id);
      go("mode=Connect;tool=view_events");
    });
  },
  
  // TODO: make dynamic
  item_squad: function(state) {
    return "Demo Squad";
  },

  item_status: function(state) {
    return This._item.availability_status;
  },

  item_believesin: function(state) { 
    if (!This._item.believesin) return " ";
    return "believes in: <b>" + This._item.believesin.semisplit().join(', ')  + "</b>";
  },

  item_current_operation_title: function(state) {
    if (This._item.latch.startsWith('unlatched')) return " ";
    return This._item.latch.split(' ')[2].resource().title;
  },
  
  item_current_assignment: function(state) {
    if (This._item.latch.startsWith('unlatched')) return " ";
    return This._item.latch.split(' ')[2].resource().body;
  },
  
  is_latched: function(state) {
    return !This._item.latch.startsWith('unlatched');
  },

  
  item_celebrates: function(state) { return " "; },
  item_helpwith: function(state)   { return " "; },
  item_didrecent: function(state)  { return " "; }
  
};
