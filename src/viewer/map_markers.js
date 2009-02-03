MapMarkers = {

  iw_marker: null,

  open: function(item, content, min_zoom) {
    var marker = MapMarkers.cache[item] || item.resource().map_marker || alert('no marker found for ' + item);
    if (this.iw_marker == marker)
      return Map.Gmap.updateCurrentTab(function(tab){ tab.contentElem = content; });
    this.iw_marker = marker;
    if (Map.Gmap.getZoom() < min_zoom) Map.Gmap.setCenter(marker.getLatLng(), min_zoom);
    this.iw_marker.openInfoWindow(content, {noCloseOnClick: true});
  },
      
  display: function(city, agents) {
    if (!Map.available()) return;
    if (city) {
      // agents
      Map.load_and_refocus(agents.map(MapMarkers.for_agent));
            
      // the city itself
      // Map.add([MapMarkers.for_city(Viewer.selected_city, true)]);
    } else {
      var cities = $keys(Agents.find("=city_id"));
      Map.load_and_refocus(cities.map(MapMarkers.for_city));
    }
  },
  
  

  //
  // private
  //
  
  cache: {},
  
  marker: function(lat, lng, type, title) {
    var icon = IconFactory.for_type(type);
    return new GMarker( new GLatLng(lat, lng), { 'title': title, 'icon': icon } );
  },
  
  for_city: function(city_id) {
    if (city_id == "undefined") return null;
    if (MapMarkers.cache[city_id]) return MapMarkers.cache[city_id];
    if (!city_locs[city_id]) return null;
    var lat = city_locs[city_id][0];
    var lng = city_locs[city_id][1];
    var marker = MapMarkers.marker(lat, lng, 'ninjaguy', cities[city_id]);

    GEvent.addListener( marker, "click", function() { Viewer.go("/mobilize/:city"); });
    
    MapMarkers.cache[city_id] = marker;
    return marker;
  },
    
  for_agent: function(agent) {
    if (MapMarkers.cache[agent.item_tag]) return MapMarkers.cache[agent.item_tag];
    var marker = MapMarkers.marker(agent.lat, agent.lng, agent.map_icon, agent.title);
    marker.info_data = agent;

    GEvent.addListener( marker, "click", function() { Viewer.open(agent.item_tag); });
    // GEvent.addListener( marker, "infowindowclose", function() { Viewer.close(agent); });
    GEvent.addListener( marker, "dblclick", function() {
      Map.Gmap.setCenter( marker.getPoint(), 15 ); 
    });

    MapMarkers.cache[agent.item_tag] = marker;
    return marker;
  }
  
};
