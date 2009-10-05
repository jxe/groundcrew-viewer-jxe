var op_watch = null;
function op(city, tag, title, focii, architect, atype, body, x){
  var result = Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    focii: focii,
    architect: architect,
    atype: atype,
    body: body
  }, x);
  if (tag == op_watch) {
    go('@' + tag);
    op_watch = null;
  }
  return result;
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
      channel: 'noho',
      script:  script,
      items:   players.replace(/Person__/g, '')
    };

    if (test) return alert("CEML exec: " + $.param(params));

    $.post('/api/exec', params, function(optag){
      op_watch = optag;
      Ajax.autoload(callback);
    }, 'text');
  }

};
