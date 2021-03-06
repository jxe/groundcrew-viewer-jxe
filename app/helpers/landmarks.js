go.push({

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

  landmark_ops: function() {
    var r = '';
    var ops = Landmarks.ops(This.item);
    $.each(ops, function(i, op) {
      r += '<li><a href="#@#{id}">#{title}</a></li>'.t(op);
    });
    return r;
  },

  live_ops: function(state) {
    return Ops.here().sort_by(function(x){
      return Operation.last_update_ts(x);
    }, { order: 'desc' }).map(function(x){
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
    return Landmarks.radius_options();
  },
  
  radial_select_require_selection: function() {
    $('.radial_select_require_selection').toggle($('#radial_select').val() == 'require_selection');
  },
  
  change_pick: function(value) {
    var via_any_sys = null;
    var via_only_sys = null;
    if (value == 'pick_fast') {
      via_any_sys = App.current_stream_systems().replace('e', '');
    } else if (value == 'pick_slow') {
      via_only_sys = 'e';
    } else {
      via_any_sys = App.current_stream_systems();
    }

    options = Landmarks.radius_options(via_any_sys, via_only_sys);
    $('#radial_select').html(options);
    $('.radial_select_require_selection').toggle($('#radial_select').val() == 'require_selection');
  }

});
