Viewer.apps.organize = {
  url_part_labels: $w('squad city item'),
  
  marker_clicked: function(tag, state) {
    squad = state.squad || 'your_personal_squad';
    Viewer.go('/organize/'+ squad +'/:city/' + tag);
  },
    
  show_item: function(state) {
    if (state.item.startsWith('Person'))
      MapMarkers.open(state.item, $.template('#organize_agent_iw').app_paint()[0], 16);
    if (state.item.startsWith('Landmark'))
      MapMarkers.open(state.item, $.template('#organize_landmark_iw').app_paint()[0], 16);
  },
  
  display_assignment_editor: function(state) {
    return MapMarkers.open(state.item, $.template('#assignment_editor').app_paint()[0], 16);
  },
  
  build_pos_form_submitted: function(data, state) {
    return MapMarkers.open(state.item, $.template('#assignment_editor').app_paint()[0], 16);
  },
  
  item_status: function(state)     { return "This agent is available."; },
  item_believesin: function(state) { return " "; },
  item_celebrates: function(state) { return " "; },
  item_helpwith: function(state)   { return " "; },
  item_didrecent: function(state)  { return " "; },
  
  everyone_will: function(state) {
    return "Smile mischeviously/Make hand signals/Caress yourself/Hum quietly/Look mysterious".split('/').map(function(x){
      return "<option>" + x + "</option>";
    }).join('');
  }
  
};
