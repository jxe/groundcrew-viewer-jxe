Viewer.apps.mapcare = {
  url_part_labels: $w('city item'),

  show_item: function(state) {
    if (state.item.startsWith('Landmark')) Viewer.render_item('landmark_editor');
  },

  send_landmark_form_submitted: function(data, state) {
    // Ajax.fetch('/gc/edit_landmark', {lm:data}, function(ev){
      // return to referrer template
    Viewer.back();
  }
    
};
