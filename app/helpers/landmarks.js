LiveHTML.widgets.push({
  
  places6: function(state) {
    return Tiles.place_tile.tt(Landmarks.here(6));
  },

  places_all: function(state) {
    return Tiles.place_tile.tt(Landmarks.here().slice(0, 42));
  }  
    
});
