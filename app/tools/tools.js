App.tools.add_landmark = {
  
  tool_template: function() { return '#new_landmark'; },

  map_clicked: function() {
    if (App.zoomed_out()) return alert("Please zoom to a city.");
    go('tool=');
    var window_type = this.tool_template();
    Map.latlng_open(This.click_latlng, window_type, $.template(window_type).app_paint()[0]);
    $('#action_list').hide(); // This window is opened outside of the normal flow and bypasses change_state so we have to put this extra logic here
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
  tool_template: function() { return '#new_mission_landmark'; }
});

App.tools.add_question_landmark = $.extend({}, App.tools.add_landmark, {
  tool_template: function() { return '#new_question_landmark'; }
});

go.push({
  // the next four are used in new mission landmark tool
  expand_extra: function (a) {
    $('.' + a).show();
    $(This.clicked).parent().hide();
  },
  selected_agents_count: function () {
    return String(Selection.count());
  },
  show_anyone_agentpicker: function () {
    var ap = $(This.clicked).parents('.agentpicker');
    $('.nearest_agentpicker', ap).removeClass('active');
    $('.anyone_agentpicker', ap).addClass('active');
  },
  show_nearest_agentpicker: function () {
    var ap = $(This.clicked).parents('.agentpicker');
    $('.anyone_agentpicker', ap).removeClass('active');
    $('.nearest_agentpicker', ap).addClass('active');
  },
  // This is used in the ask a question tool
  selected_count_or_all_available: function () {
    var c = Selection.count();
    return String( c || "all available") + ' agent' + (c == 1 ? '' : 's');
  }
});

