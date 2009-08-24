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

App.tools.assign_agents = {
    
  make_it_happen_form_submitted: function(data) {
    Operation.assign(This.item, data.assign, function(operation){
      go('@' + operation.id);
    });
  }
  
};

App.tools.interact_selected = {
  
  group_interact_form_submitted: function(data, state, form) {
    Operation.group_assign($keys(Selection.current), data.assign, function(operation){
      $.each($keys(Selection.current), function(){
        Selection.toggle(this);
      });
      
      go('tool=assign_agents;item=' + operation.id);
    });
    
  }

};
