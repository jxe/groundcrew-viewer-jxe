Viewer.apps.testify = {
  url_part_labels: $w('city belief'),
    
  belief_index: function(state) {
    // var atag_counts = Agents.find('=city_id ' + state.city.resource_id() + " :atags");
    // $('.categories div').decorate_categories(atag_counts);
    $('#belief_index').app_paint().center();
  },
  
  beliefs: function(state) {
    return "nothing";
  }
  
};
