$.extend(Operation, {
  exec: function(script, players, location, callback) {
    var site = location.split(' ')[0].resource();
    var loc = site.id.resource_type() == 'Landmark' ? site.title : '-';
    var params = {
      script:   script,
      items:    players,
      location: location,
      city:     This.city_id,
      lat:  site.lat,
      lng:  site.lng,
      loc:  loc
    };

    if (demo || test) return alert("CEML exec: " + $.param(params));
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to run operations.");
    
    
    if (window.sms_remaining <= 0) {
      $.post('/api/bugreport', {issue: window.current_stream + ' has run out of text messages!'});
      alert('You have reached your limit on text messages!  ' +
        'Please contact Groundcrew support to purchase more.');
      return false;
    }

    return $.post_with_squad('/exec', params, function(op_javascript){
      most_recent_op = null;
      eval(op_javascript);
      if (most_recent_op) go('@' + most_recent_op.id);
      else if (callback) callback();
    }, 'text');
  }
});
