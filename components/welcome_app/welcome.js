Viewer.apps.welcome = {
  url_part_labels: $w('mode city'),
  
  show_mode: function(state) {
    if (state.mode == 'beginner') {
      state.mode_label = "Welcome screen";
      Viewer.render('beginner_mode');
    }
  }

};
