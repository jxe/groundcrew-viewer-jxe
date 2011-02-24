App.tools.add_landmark = {
  
  tool_template: function() { return '#new_landmark'; },

  map_clicked: function() {
    if (App.zoomed_out()) return alert("Please zoom to a city.");
    go('tool=');
    var type = this.tool_template();
    Map.latlng_open(This.click_latlng, type, $.template(type).app_paint()[0]);
    // go.trigger('selection_changed');
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
/*   tool_template: function() { return '#new_mission_landmark'; } */
  tool_template: function() { return '#new_mission_landmark2'; }

});

App.tools.add_question_landmark = $.extend({}, App.tools.add_landmark, {
  tool_template: function() { return '#new_question_landmark'; }
});



