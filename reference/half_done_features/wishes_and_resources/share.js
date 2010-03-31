App.modes.listen = {
  show_type: function(state) {
    Viewer.render(state.type);
  },
  
  wish_locations: function(state) {
    return "<option value='agent'>Wherever I am</option>" + Landmarks.here().as_option_list();
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
    // w/ url like /share/edit/city220/13
  },

  share_resources: function (state) {
    // retrieve stuff from server
    return 'nothing!';
  },
};
