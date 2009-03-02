Viewer.apps.share = {
  url_part_labels: $w('city mode item'),

  set_mode: function(mode, state) {
    state.mode_label = {
      "add": "Add A Shared Resource",
      "resources": "Your Shared Resources",
      "self": "You"
    }[mode] || "Unknown Mode";
  },

  show_mode: function(state) {
    Viewer.render(state.mode);
  },
  
  show_item: function(state) {
    Viewer.render_item('self');
  },

  share_form_submitted: function(data, state) {
    // send stuff to server
    // then display the item submitted on the map
    // w/ url like /share/edit/City__220/Resource__13
  },

  share_resources: function (state) {
    // retrieve stuff from server
    return 'nothing!';
  },
};
