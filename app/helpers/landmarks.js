LiveHTML.widgets.push({
  
  places6: function(state) {
    return Tiles.place_tile.tt(Landmarks.here(6));
  },

  places_all: function(state) {
    return Tiles.place_tile.tt(Landmarks.here().slice(0, 42));
  },
  
  landmark_dropdown: function() {
    return Landmarks.here().map(function(x){
      return '<dl><dd class="img"><img src="#{thumb_url}"/></dd><dt><a href="#@#{id}">#{title}</a></dt><hr/></dl>'.t(x);
    }).join('');
  },
  
  live_ops: function(state) {
    return Ops.here().map(function(x){
      return '<dl><dd class="img"><img src="#{thumb_url}"/></dd><dt><a href="#@#{id}">#{title}</a></dt><hr/></dl>'.t(x);
    }).join('');
  }
    
});
