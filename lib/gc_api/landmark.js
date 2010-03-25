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
  },

  radius_options: function(with_any_sys, with_only_sys) {
    if (!with_any_sys && !with_only_sys) with_any_sys = App.current_stream_systems().replace('e', '');
    // [label, meters]
    var options = [ ["1 block", 200],
      ["3 blocks", 600],
      ["1/2 mile", 800],
      ["1 mile", 1600],
      ["2 miles", 3200],
      ["5 miles", 8000],
      ["10 miles", 16000]

    ].map(function(x){
      var agents = Agents.nearby(
        This._item ? This._item.lat : This.click_latlng.lat(),
        This._item ? This._item.lng : This.click_latlng.lng(), x[1]);
      if (with_any_sys || with_only_sys) {
        agents = agents.grep(function(agent){
          if (with_any_sys && with_any_sys.split('').intersect(agent.via_sys).length < 1) return false;
          if (with_only_sys) {
            var n = with_only_sys.split('').intersect(agent.via_sys).length;
            if (n != with_only_sys.length || n != agent.via_sys.length) return false;
          }
          return true;
        });
      }
      if (agents.length == 0) return '';

      var option_label = x[0] + " &mdash; " + agents.length + " agents";
      var agent_tags = agents.map('.id').join(' ');
      return "<option value='"+agent_tags+"'>" + option_label + "</option>";
    });

    options.push("<option value='require_selection'>all selected agents</option>");

    return options.join('');
  }
});

Landmark = {

  create: function(lat, lng, title) {
    var lmtag = "Landmark__" + Ajax.uuid();
    return item(This.city_id, lmtag, title, null, lat, lng, "", "unlatched");
  }

};
