LiveHTML.widgets.push({
  
  places6: function(state) {
    return Tiles.place_tile.tt(Landmarks.here(6));
  },

  places_all: function(state) {
    return Tiles.place_tile.tt(Landmarks.here().slice(0, 42));
  },
  
  landmark_dropdown: function() {
    return Landmarks.here().map(function(x){
      return '<dl href="#@#{id}"><dd class="img"><img src="#{thumb_url}"/></dd><dt>#{title}</dt><hr/></dl>'.t(x);
    }).join('');
  },
  
  live_ops: function(state) {
    return Ops.here().reverse().map(function(x){
      if (x.thumb_url) {
        return '<dl href="#@#{id}"><dd class="img"><img src="#{thumb_url}"/></dd><dt>#{title}</dt><hr/></dl>'.t(x);
      } else {
        return '<dl href="#@#{id}"><dt>#{title}</dt><hr/></dl>'.t(x);
      }
    }).join('');
  },
  
  radius_options: function() {
    // [label, meters]
    return [ ["1 block", 200], 
      ["3 blocks", 600], 
      ["1/2 mile", 800], 
      ["1 mile", 1600], 
      ["2 miles", 3200]
    ].map(function(x){
      var agents = Agents.nearby(This._item, x[1]);
      if (agents.length == 0) return '';
      var option_label = x[0] + " &mdash; " + agents.length + " agents";
      var agent_tags = agents.map('.id').join(' ');
      return "<option value='"+agent_tags+"'>" + option_label + "</option>";
    }).join('');
  }  
    
});
