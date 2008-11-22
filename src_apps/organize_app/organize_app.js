Viewer.apps.organize = {
  url_part_labels: $w('squad city item'),
  
  marker_clicked: function(tag, state) {
    squad = state.squad || 'your_personal_squad';
    Viewer.go('/organize/'+ squad +'/:city/' + tag);
  },
  
  set_item: function(item, state) {
    if (!item) state.agents = null;
  },
  
  show_item: function(state) {
    MapMarkers.open(state.item, $.template('#organize_agent_iw').app_paint()[0], 17);
  },
  
  item_status: function(state)     { return "This agent is available."; },
  item_believesin: function(state) { return " "; },
  item_celebrates: function(state) { return " "; },
  item_helpwith: function(state)   { return " "; },
  item_didrecent: function(state)  { return " "; }
  
};
