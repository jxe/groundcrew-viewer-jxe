Viewer.apps.stand = {
  url_part_labels: $w('city belief'),
  
  show_belief: function(state) {
    alert('thanks dude.');
  },  
  
  beliefs: function(state) {
    var beliefs = Agents.find('=city_id ' + state.city.resource_id() + " ;believesin");
    return $keys(beliefs).map(function(x){
      var agents = beliefs[x];
      var clss = (agents.length == 1 ? 's1' : agents.length < 4 ? 's2' : 's3');
      if (agents.contains(person_item)) clss += ".mine";
      return tag('a.' + clss, {content:x, href:"#"+x});
    }).join(', ') || ' ';
  },
  
  form_submit: function(data, state, form) {
    if (data.belief) {
      form.find('button,input').attr('disabled', true);
      Ajax.fetch('/agent/push', {key:'believesin', val:data.belief}, function(me){
        Agents.add_or_update(me);
        $('#stand_belief_index').app_paint();
        form.find('button,input').attr('disabled', false);
        form.find('input').val('').focus();
      });
    }
  }
  
};
