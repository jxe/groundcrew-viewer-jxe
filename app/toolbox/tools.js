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
    
  
};

App.tools.interact_selected = {

};
