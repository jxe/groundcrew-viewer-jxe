Planner = {  

  current: null,

  new_suggestion: function(form) {
    var doing = $('#planner_doing').val();
    var atag = $('#planner_atag').val();
    var landmark = $('#planner_landmark_select').val();
    $.facebox.close();
    Viewer.start_suggestion(landmark, doing, atag);
    return false;
  },
  
  show: function(i) {
    var me = $.template('#plannerbox');
    Planner.current = i;
    me.fillout({
      '#planner_atag' : City.atags_ripe(),
      '#planner_landmark_select' : City.landmarks_options()
    }).forms({
      "form"                : Planner.new_suggestion
    });
    $.facebox(me);
    if (i.atag) $('#planner_atag').val(i.atag);
    $('#planner_doing').focus();
  }
  
};
