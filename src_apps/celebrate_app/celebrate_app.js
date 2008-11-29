Viewer.apps.celebrate = {
  url_part_labels: $w('city exalt recipe item'),
  
  celebrate_what_form_submitted: function(data, state, form) {
    var clean = data.what.replace(/[^a-zA-Z0-9-_ ]/, '_');
    Viewer.go(clean);
  },
  
  celebrate_by_form_submitted: function(data, state, form) {
    Viewer.go(data.lm);
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
