Viewer.apps.share = {
  url_part_labels: $w('mode'),

  show_mode: function(state) {
    $('#share_palette').unreveal();

    if (state.mode == 'add') {
      state.mode_label = "Add A Shared Resource";
      Viewer.render('add');
      $('img.closer').click(function(){ $('#share_add').reveal(); });
    } else if (state.mode == 'resources') {
      state.mode_label = "Your Shared Resources";
      Viewer.render('resources');
      $('img.closer').click(function(){ $('#share_resources').reveal(); });
    }

  },

  share_form_submitted: function(data, state) {
    // send stuff to server
    Viewer.go('/share/resources');
  },

  share_secret_access: function (state) {
    return '';
  },

  share_resources: function (state) {
    // retrieve stuff from server
    return 'nothing!';
  },
};
