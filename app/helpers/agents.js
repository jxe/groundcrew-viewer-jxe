LiveHTML.widgets.push({
  
  agents_to_guide6: function() {
    return Tiles.agent_tile.tt(This.agents.slice(0,6));
  },

  agents_to_guide_all: function() {
    return Tiles.agent_tile.tt(This.agents.slice(0, 6*7));
  },
  
  squad_beliefs: function() {
    var beliefs = [];
    $.each(Agents.find(';believesin'), function(belief, agents){
      beliefs.push(link(belief, '#@' + agents[0].id));
    });
    return beliefs.join(', ');
  }
  
});
