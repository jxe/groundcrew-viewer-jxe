App.tools.lat_lng = {
  
  map_clicked: function() {
    alert("You clicked the map, at "+This.click_lat+", "+This.click_lng+".");
  }
  
};

App.tools.add_landmark = {
  
  map_clicked: function() {
    map.openInfoWindow(This.click_latlng, $.template('#new_landmark_template').app_paint()[0]);
  },
  
  reveal: function(changed) {
    if (changed.item) {
      alert('display item here!');
    }
  }
  
};

