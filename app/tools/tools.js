App.tools.add_landmark = {

  map_clicked: function() {
    if (App.zoomed_out()) return alert("Please zoom to a city.");
    go('tool=');
    map.openInfoWindow(This.click_latlng, $.template('#new_landmark').app_paint()[0]);
  }

};

App.tools.add_mission_landmark = {

  map_clicked: function() {
    if (App.zoomed_out()) return alert("Please zoom to a city.");
    go('tool=');
    map.openInfoWindow(This.click_latlng, $.template('#new_mission_landmark').app_paint()[0]);
  }

};

App.tools.add_question_landmark = {

  map_clicked: function() {
    if (App.zoomed_out()) return alert("Please zoom to a city.");
    go('tool=');
    map.openInfoWindow(This.click_latlng, $.template('#new_question_landmark').app_paint()[0]);
  }

};

