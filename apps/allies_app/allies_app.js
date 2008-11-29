Viewer.apps.allies = {
  url_part_labels: $w('city wish'),
  
  wishes: function(state) {
    var wishes = Agents.find('=city_id ' + state.city.resource_id() + " ;helpwith");
    return $keys(wishes).map(function(x){ return x.replace(/\bmy\b/g, 'our'); }).join(', ');
  },
  
  helpwith_form_submitted: function(data, state, form) {
    Ajax.fetch('/agent/push', {key:'helpwith', val:data.helpwith}, function(me){
      Agents.add_or_update(me);
      $('#allies_show_city').app_paint();
    });
  }
  
};
