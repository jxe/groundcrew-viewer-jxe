$.extend(Operation, {
  exec: function(script, players, location, callback, desc) {
    var site = location && location.split(' ')[0].resource();
    var loc = site && (site.id.resource_type() == 'Landmark' ? site.title : '-');
    var params = {
      script:   script,
      items:    players           || undefined,
      location: location          || undefined,
      city:     This.city_id      || undefined,
      lat:      site && site.lat  || undefined,
      lng:      site && site.lng  || undefined,
      loc:      loc               || undefined,
      desc:     desc              || undefined
    };

    if (demo || test) return alert("CEML exec: " + $.param(params));
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to run operations.");
    
    
    if (window.sms_remaining <= 0) {
      $.post('/api/bugreport', {issue: window.current_stream + ' has run out of text messages!'});
      alert('You have reached your limit on text messages!  ' +
        'Please contact Groundcrew support to purchase more.');
      return false;
    }

    $.post_with_squad('/exec', params, function(op_javascript){
      most_recent_op = null;
      eval(op_javascript);
      if (callback) callback(most_recent_op);
      if (most_recent_op) go('@' + most_recent_op.id);
    }, 'text');
  }
});
