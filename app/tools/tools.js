App.tools.add_landmark = {
  
  map_clicked: function() {
    map.openInfoWindow(This.click_latlng, $.template('#new_landmark').app_paint()[0]);
  }

};

