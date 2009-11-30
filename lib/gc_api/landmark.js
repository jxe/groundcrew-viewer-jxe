Landmarks = new Resource('Landmark', {
  enhancer: function(item) {
    item.recent_events = [];
  },

  has_op: function(lm_id) {
    return Landmarks.ops(lm_id).length > 0;
  },

  // Returns the most recent op at the specified landmark.
  op: function(lm_id) {
    var ops = Landmarks.ops(lm_id);
    return ops.length > 0 && ops[ops.length - 1];
  },

  ops: function(lm_id) {
    if (!lm_id || !lm_id.startsWith('Landmark__')) return [];
    return Ops.here().grep(function(x){
      return x.site == lm_id;
    });
  }
});

Landmark = {

  create: function(lat, lng, title) {
    var lmtag = "Landmark__" + Ajax.uuid();
    return item(This.city_id, lmtag, title, null, lat, lng, "", "unlatched");
  }

};
