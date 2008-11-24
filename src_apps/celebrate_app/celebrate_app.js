Viewer.apps.celebrate = {
  url_part_labels: $w('city exalt recipe item'),

  form_submit: function(data, state, form) {
    if(data.what) {
      var clean = data.what.replace(/[^a-zA-Z0-9-_ ]/, '_');
      form.reset_prompts();
      Viewer.go(clean);
    }
    if(data.celebrate_by) {
      Viewer.go(data.lm);
    }
  },
  
  recently_exalted: function(state) {
    return 'unimplemented.';
  },

  celebrate_what: function(state) {
    return $('<span></span>').text(state.what);
  },

  celebrate_by_fill: function(state) {
    return Snippets['celebrate_by'].as_option_list();
  },
  
  ending_snippets: function(state) {
    return Snippets['end_by'].as_option_list();
  }
  
};
