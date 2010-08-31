go.push({
  blank:       function(){ return ''; },
  
  item_thumb_url: function(state) { if (This._item && This._item.thumb_url) return This._item.thumb_url.gcify_url(); },
  item_title:     function(state) { return This._item.title; },

  item_ltypes:    function(state) {
    ltypes = This._item.ltypes;
    if (!ltypes) {
      return 'unknown';
    } else {
      return ltypes.split(' ')[0];
    }
  },

  item_description: function(state) {
    description = This._item.description;
    if (!description) {
      return '';
    } else {
      return description;
    }
  }
  
});
