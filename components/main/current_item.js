LiveHTML.widgets.push({
  
  item_thumb_url: function(state) { if (state.item_r && state.item_r.thumb_url) return state.item_r.thumb_url.gcify_url(); },
  item_title:     function(state) { return state.item_r.title; },

  item_ltypes:    function(state) {
    ltypes = state.item_r.ltypes;
    if (!ltypes) {
      return 'unknown';
    } else {
      return ltypes.split(' ')[0];
    }
  },

  item_description: function(state) {
    description = state.item_r.description;
    if (!description) {
      return '';
    } else {
      return description;
    }
  }
  
});
