LiveHTML.widgets.push({
  
  agents_to_guide6: function(state) {
    return Tiles.agent_tile.tt(state.agents && state.agents.slice(0,6));
  },  

  agents_to_guide_all: function(state) {
    return Tiles.agent_tile.tt(state.agents);
  }  
  
});
