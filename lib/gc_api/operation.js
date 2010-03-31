var most_recent_op = null;
function op(city, tag, title, focii, architect, atype, body, x){
  tag = tag.replace('Op__', '');
  focii = focii && focii.replace(/Person__/g, '').replace(/Landmark__/g, '');
  architect = architect && architect.replace('Person__', '');
  
  return most_recent_op = Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    focii: focii,
    architect: architect,
    atype: atype,
    body: body
  }, x);
}


//op(223,"Op__43e467ff9db","Help local food org \u0026 get free food at fairgrounds","Person__cfcd208495d5 c4ca4238a0b9","Person__pm13ffa328cbf","assignment group","Help local food org \u0026 get free food at fairgrounds");


//operation("223","vxpe5ec63635f0d_1c7bbd5905f_1267018159","run and jump and play","invite",null,null,null,null,"Landmark__lP4296702",null,"pe5ec63635f0d","joe@foo.com");


function operation(city, uuid, name, vtype, thumb_url, lat, lng, loc, focii, notes, 
  authority_id, authority_name, created_ts, x)
{
  focii = focii && focii.replace(/Person__/g, '').replace(/Landmark__/g, '');
  authority_id = authority_id && authority_id.replace('Person__', '');

  // HACK to work around extra param added to op
  if (typeof created_ts == 'object' && !x) {
    x = created_ts;
    created_ts = null;
  }
  most_recent_op = Resource.add_or_update(uuid, {
    city_id: Number(city),
    lat:lat,
    lng:lng,
    thumb_url:thumb_url,
    city:Number(city),
    title: name,
    focii: focii,
    architect: authority_id,
    atype: "assignment " + vtype,
    body: name,
    created_ts: created_ts
  }, x);
  return most_recent_op;
}


var op_children = {};
var op_last_child = {};


Ops = new Resource('Op', {
  enhancer: function(x){
    if (!op_children[x.id]) op_children[x.id] = [];
    x.site = x.site || (x.focii && x.focii.split(' ')[0]);
    x.thumb_url = x.thumb_url || (x.site && x.site.resource() && x.site.resource().thumb_url);
  }
});


Operation = {

  exec: function(script, players, location, callback) {
    var site = location.split(' ')[0].resource();
    var params = {
      script:   script,
      items:    players,
      location: location,
      city:     This.city_id,
      lat:  site.lat,
      lng:  site.lng,
      loc:  site.title
    };

    if (demo || test) return alert("CEML exec: " + $.param(params));
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to run operations.");
    
    
    if (window.remaining <= 0) {
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
  },
  
  last_update_ts: function(x) {
    if (op_last_child[x.id] && op_last_child[x.id].created_at > 0) return op_last_child[x.id].created_at;
    return x.created_ts || 0;
  }
};
