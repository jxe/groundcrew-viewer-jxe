LiveHTML.widgets.push({
  
  self_name: function(state) {
    return CurrentUser.title;
  },
  
  self_posx_pts: function(state) {
    return CurrentUser.posx_pts;
  },

  self_posx: function(state) {
    return CurrentUser.posx;
  },

  self_squadm: function(state) {
    return CurrentUser.squadm;
  }

});
