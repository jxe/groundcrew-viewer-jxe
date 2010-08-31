App.tools.add_landmark = {
  
  tool_template: function() { return '#new_landmark'; },

  map_clicked: function() {
    if (App.zoomed_out()) return alert("Please zoom to a city.");
    go('tool=');
    return map.openInfoWindow(This.click_latlng, $.template(this.tool_template()).app_paint()[0]);
  }
};

App.tools.welcome = {
  tool_selected: function() { $('body').addClass('fogged'); },  
  tool_unselected: function() { $('body').removeClass('fogged'); }  
};

App.tools.join_squad = {
  tool_selected: function() { $('body').addClass('fogged'); },  
  tool_unselected: function() { $('body').removeClass('fogged'); }  
};

App.tools.add_mission_landmark = $.extend({}, App.tools.add_landmark, {
  tool_template: function() { return '#new_mission_landmark'; }
});

App.tools.add_question_landmark = $.extend({}, App.tools.add_landmark, {
  tool_template: function() { return '#new_question_landmark'; }
});

