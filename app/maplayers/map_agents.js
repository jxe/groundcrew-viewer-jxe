Map.layers.agents_f = function(){ 
  return This.agents.map(function(agent){
    if (MapMarkers.cache[agent.id]) return MapMarkers.cache[agent.id];
    
    var icon = MapIcons.for_type(agent.map_icon);
    var marker = new GMarker( new GLatLng(agent.lat, agent.lng), { 'title': agent.title, 'icon': icon } );
    
    marker.info_data = agent;

    GEvent.addListener( marker, "click", function() { go('@' + agent.id); });
    GEvent.addListener( marker, "infowindowclose", function() { 
      console.log('trying to close...');
      if (Map.open_in_progress) return true;
      if (!This._item) return true;
      
      // if (This.item != agent.id) { alert('not closing; agent is not item'); return; };
      console.log('closing...');
      go('@' + This.city);
    });
    GEvent.addListener( marker, "dblclick", function() {
      Map.Gmap.setCenter( marker.getPoint(), 15 ); 
    });

    MapMarkers.cache[agent.id] = marker;
    return marker;
  }); 
};
