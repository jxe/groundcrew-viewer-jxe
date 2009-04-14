App.modes.mapcare = {
  url_part_labels: $w('city item'),

  show_item: function(state) {
    if (state.item.startsWith('Landmark')) Viewer.render_item('landmark_editor');
  },

  send_landmark_form_submitted: function(data, state) {
    var x = {};
    $.extend(x, state.item_r, data);
    delete x.map_marker;
    $.post('/gc/edit_landmark', x, function(data){
      eval(data);
      Viewer.back();
    });
  }
    
};
