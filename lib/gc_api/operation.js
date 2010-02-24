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


//op(223,"Op__43e467ff9db","Help local food org \u0026 get free food at fairgrounds","Person__cfcd208495d5 c4ca4238a0b9 c81e728d9d4c eccbc87e4b5c a87ff679a2f3 e4da3b7fbbce 1679091c5a88 8f14e45fceea c9f0f895fb98 45c48cce2e2d d3d9446802a4 6512bd43d9ca c20ad4d76fe9 c51ce410c124 aab3238922bc 9bf31c7ff062 c74d97b01eae 70efdf2ec9b0 6f4922f45568 1f0e3dad9990 98f137082101 3c59dc048e88 b6d767d2f8ed 37693cfc7480 1ff1de774005 8e296a067a37 4e732ced3463 02e74f10e032 33e75ff09dd6 6ea9ab1baa0e 34173cb38f07 c16a5320fa47 6364d3f0f495 182be0c5cdcd e369853df766 1c383cd30b7c 19ca14e7ea63 a5bfc9e07964 a5771bce93e2 d67d8ab4f4c1 d645920e395f 3416a75f4cea a1d0c6e83f02 17e62166fc85 f7177163c833 6c8349cc7260 d9d4f495e875","Person__pm13ffa328cbf","assignment group","Help local food org \u0026 get free food at fairgrounds");


//operation("223","vOp__pe5ec63635f0d_1c7bbd5905f_1267018159","run and jump and play","invite",null,null,null,null,"Landmark__lP4296702",null,"pe5ec63635f0d","joe@foo.com");


function operation(city, uuid, name, vtype, thumb_url, lat, lng, loc, focii, notes, authority_id, authority_name, x){
  var id = uuid.replace(/^v/, '');
  most_recent_op = Resource.add_or_update(id, {
    city_id: Number(city),
    title: name,
    focii: focii,
    architect: 'Person__' + authority_id,
    atype: "assignment " + vtype,
    body: name
  }, x);
  // alert('got here');
  return most_recent_op;
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
      script:   script,
      items:    players.replace(/Person__/g, ''),
      location: location,
      city:     This.city_id
    };

    if (demo || test) return alert("CEML exec: " + $.param(params));
    
    if (window.remaining <= 0) {
      $.post('/api/bugreport', {issue: window.current_stream + ' has run out of text messages!'});
      alert('You have reached your limit on text messages!  ' +
        'Please contact Groundcrew support to purchase more.');
      return false;
    }

    $.post('/api/exec', params, function(op_javascript){
      most_recent_op = null;
      eval(op_javascript);
      if (most_recent_op) go('@' + most_recent_op.id);
      else if (callback) callback();
    }, 'text');
  }

};
