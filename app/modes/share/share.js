App.modes.share = {
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
    $.unreveal();  // this should not be necessary
    Viewer.render_item(state.mode);
  },
  
  wish_locations: function(state) {
    return "<option value='agent'>Wherever I am</option>" + Landmarks.in_city(state.city).as_option_list();
  },
  
  add_wish_form_submitted: function(data, state) {
    var wish = data.where + " " + data.wish;
    if (data.reqplan) wish += " #reqplan";
    if (data.big)     wish += " #big";
    if (data.forme)   wish += " #forme";
    $.post('/agent/new_wish', {wish:wish}, function(data){
      eval(data);
      Viewer.back();
    });
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
