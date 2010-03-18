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
    return Ops.here().map(function(x){
      if (x.thumb_url) {
        return '<dl href="#@#{id}"><dd class="img"><img src="#{thumb_url}"/></dd><dt>#{title}</dt><hr/></dl>'.t(x);
      } else {
        return '<dl href="#@#{id}"><dt>#{title}</dt><hr/></dl>'.t(x);
      }
    }).reverse().join('');
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
      via_any_sys = window.current_stream_systems.replace('e', '');
    } else if (value == 'pick_slow') {
      via_only_sys = 'e';
    } else {
      via_any_sys = window.current_stream_systems;
    }

    options = Landmarks.radius_options(via_any_sys, via_only_sys);
    $('#radial_select').html(options);
    $('.radial_select_require_selection').toggle($('#radial_select').val() == 'require_selection');
  }

});
