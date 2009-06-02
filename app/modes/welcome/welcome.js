App.modes.welcome = {
  url_parts: $w('kind city'),
  
  show_squad: function(state) {
    Viewer.render('cities');
    return;
  },

  show_root: function(state) {
    Viewer.render('cities');
    return;
  },
  
  show_kind: function(state) {
    if (This.kind == 'cities') {
      Viewer.render('cities');
      return;
    }
    if (This.squad) {
      Viewer.render('welcome_leader');
      return;
    }
    if (This.kind == 'beginner') {
      Viewer.render('beginner_mode');
    } else Viewer.render(state.kind);
  },
  
  show_city: function(state) {
    if (state.kind == 'silent') return Viewer.render('silent');
    if (This.squad) {
      Viewer.render('welcome_leader');
      return;
    }
    if (state.kind == 'beginner') {
      Viewer.render('beginner_mode');
    } else Viewer.render(state.kind);
  }

};
