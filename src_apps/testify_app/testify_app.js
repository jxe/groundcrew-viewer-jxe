Viewer.apps.testify = {
  url_part_labels: $w('city belief'),
    
  belief_index: function(state) {
    // var atag_counts = Agents.find('=city_id ' + state.city.resource_id() + " :atags");
    // $('.categories div').decorate_categories(atag_counts);
    $('#belief_index').app_paint().center();
  },
  
  beliefs: function(state) {
    var beliefs = Agents.find('=city_id ' + state.city.resource_id() + " ;believesin");
    return $keys(beliefs).join(', ');
  },
  
  form_submit: function(data, state, form) {
    if (data.belief) {
      form.find('button,input').attr('disabled', true);
      Ajax.fetch('/agent/push', {key:'believesin', val:data.belief}, function(me){
        Agents.add_or_update(me);
        $('#belief_index').app_paint();
        form.find('button,input').attr('disabled', false);
        form.find('input').val('').focus();
      });
    }
  }
  
};
