var most_recent_op = null;
function op(city, tag, title, focii, architect, atype, body, x){
  return most_recent_op = Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    focii: focii,
    architect: architect,
    atype: atype,
    body: body
  }, x);
}


Ops = new Resource('Op', {
  enhancer: function(x){
    x.children = [];
    x.site = x.focii && x.focii.split(' ')[0];
    x.thumb_url = x.site && x.site.resource() && x.site.resource().thumb_url;
  }
});


Operation = {

  exec: function(script, players, location, callback) {
    var params = {
      script:  script,
      items:   players.replace(/Person__/g, ''),
      city:    This.city_id
    };

    if (demo || test) return alert("CEML exec: " + $.param(params));

    $.post('/api/exec', params, function(op_javascript){
      most_recent_op = null;
      eval(op_javascript);
      if (most_recent_op) go('@' + most_recent_op.id);
      else if (callback) callback();
    }, 'text');
  }

};
