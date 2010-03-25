LiveHTML.widgets.push({

  places6: function(state) {
    return Tiles.place_tile.tt(Landmarks.here(6));
  },

  places_all: function(state) {
    return Tiles.place_tile.tt(Landmarks.here().slice(0, 42));
  },

  landmark_dropdown: function() {
    return Landmarks.here().map(function(x){
      if (x.thumb_url) {
        return '<dl href="#@#{id}"><dd class="img"><img src="#{thumb_url}"/></dd><dt>#{title}</dt><hr/></dl>'.t(x);
      } else {
        return '<dl href="#@#{id}"><dt>#{title}</dt><hr/></dl>'.t(x);
      }
    }).join('');
  },
  
  landmark_has_op: function() {
    return Landmarks.has_op(This.item);
  },

  landmark_op: function() {
    var op = Landmarks.op(This.item);
    return op && '<a href="#@#{id}">#{title}</a>'.t(op);
  },

  live_ops: function(state) {
    return Ops.here().sort_by(function(x){
      return Operation.last_update_ts(x);
    }, -1).map(function(x){
      var op_ts = $time_and_or_date(Operation.last_update_ts(x));
      var op_ts_html = op_ts ? '<div class="ts">' + op_ts + '</div>' : '';
      var op_html = '<dt>' + op_ts_html + '#{title}</dt>';
      if (x.thumb_url) {
        return ('<dl href="#@#{id}"><dd class="img"><img src="#{thumb_url}"/></dd>' + op_html + '<hr/></dl>').t(x);
      } else {
        return ('<dl href="#@#{id}">' + op_html + '<hr/></dl>').t(x);
      }
    }).join('');
  },

  radius_options: function() {
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
      if (agents.length == 0) return '';
      var option_label = x[0] + " &mdash; " + agents.length + " agents";
      var agent_tags = agents.map('.id').join(' ');
      return "<option value='"+agent_tags+"'>" + option_label + "</option>";
    });

    options.unshift("<option value='require_selection'>all selected agents</option>");

    return options.join('');
  }

});
