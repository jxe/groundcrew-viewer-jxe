Viewer.apps.celebrate = {
  url_part_labels: $w('city exalt recipe item'),

  form_submit: function(data, state, form) {
    if(data.what) {
      var clean = data.what.replace(/[^a-zA-Z0-9-_ ]/, '_');
      state.what = data.what;
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
    return $('<span></span>').text(state.what); // FIXME encode as html
  },

  celebrate_by_fill: function(state) {
    var snippets = [
      { item_tag: 'bow', title:'bowing down'},
      { item_tag: 'wave', title:'waving your hands in the air'},
      { item_tag: 'boogie', title:'boogie'},
      { item_tag: 'rhythm_machine', title:'make a beat together'},
      { item_tag: 'circle_dance', title:'hold hands in a circle and dance around'}
    ];
    return snippets.as_option_list();
  },
  
  ending_snippets: function(state) {
    var snippets = [	
      { item_tag: 'om', Title:'saying a long "Om" together'},
      { item_tag: 'yell_yeehaw', title: 'Yelling "Yeehaw!"'},
      { item_tag: 'handshake_and_wink', title: 'giving everybody a handshake and a wink'},
      { item_tag: 'run_screaming', title: 'running away screaming'},
      { item_tag: 'shush', title: 'shushing everybody and slinking away'}
    ];
    return snippets.as_option_list();
  }
  
};
