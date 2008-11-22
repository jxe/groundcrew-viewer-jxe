Viewer.apps.allies = {
  url_part_labels: $w('city wish'),
  
  wishes: function(state) {
    var wishes = Agents.find('=city_id ' + state.city.resource_id() + " ;helpwith");
    return $keys(wishes).map(function(x){ return x.replace(/\bmy\b/g, 'our'); }).join(', ');
  },
  
  form_submit: function(data, state, form) {
    if (data.helpwith) {
      form.find('button,input').attr('disabled', true);
      Ajax.fetch('/agent/push', {key:'helpwith', val:data.helpwith}, function(me){
        Agents.add_or_update(me);
        $('#allies_wish_index').app_paint();
        form.find('button,input').attr('disabled', false);
        form.find('input').val('').focus();
      });
    }
  }
  
};
