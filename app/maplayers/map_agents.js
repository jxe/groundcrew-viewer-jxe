Map.layers.agents_f = function(){ 
  return This.agents.map(function(agent){
    if (MapMarkers.cache[agent.id]) return MapMarkers.cache[agent.id];
    
    var icon = MapIcons.for_type(agent.map_icon);
    var marker = new GMarker( new GLatLng(agent.lat, agent.lng), { 'title': agent.title, 'icon': icon } );
    
    marker.info_data = agent;

    GEvent.addListener( marker, "click", function() { go('@' + agent.id); });
    GEvent.addListener( marker, "infowindowclose", function() { 
      if (Map.open_in_progress) return;
      if (This.item != agent.id) return;
      go('@' + This.city);
    });
    GEvent.addListener( marker, "dblclick", function() {
      Map.Gmap.setCenter( marker.getPoint(), 15 ); 
    });

    MapMarkers.cache[agent.id] = marker;
    return marker;
  }); 
};
