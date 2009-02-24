Viewer.apps.share = {
  url_part_labels: $w('mode'),
  
  set_mode: function(mode, state) {
    if (mode == "add")       state.mode_label = "Add A Shared Resource";
    if (mode == "resources") state.mode_label = "Your Shared Resources";
  },
  
  show_mode: function(state) {
    Viewer.render(state.mode);
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
