MapMarkers = {

  iw_marker: null,
  
  update_marker: function(tag) {
    var marker = MapMarkers.cache[tag] || tag.resource().map_marker;
    if (marker) MapMarkers.cache[tag].setImage('i/map/' + tag.resource().map_icon + '.png');
  },
  
  open: function(item, content, min_zoom) {
    var marker = MapMarkers.cache[item] || item.resource().map_marker;
    
    if (!marker) {
      var focii = item.resource().focii;
      if (focii) return MapMarkers.open(focii.split(' ')[0], content, min_zoom);
    }
    
    if (!marker) return alert('no marker found for ' + item);
    
    if (this.iw_marker == marker)
      return Map.Gmap.updateCurrentTab(function(tab){ tab.contentElem = content; });
    this.iw_marker = marker;
    
    // rezoom (unless the user has changed the zoom recently)
    if (Map.Gmap.getZoom() < min_zoom && Map.Gmap.getZoom() == Map.last_zoom_auto_set) {
      Map.last_zoom_auto_set = min_zoom;
      Map.Gmap.setCenter(marker.getLatLng(), min_zoom);
    }

    this.iw_marker.openInfoWindow(content, {noCloseOnClick: true});
  },
      
  display: function(city, agents) {
    if (!Map.available()) return;
    if (city) {
      Map.load_and_refocus(agents.map(MapMarkers.for_agent));
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
    var icon = MapIcons.for_type(type);
    return new GMarker( new GLatLng(lat, lng), { 'title': title, 'icon': icon } );
  },
  
  for_city: function(city_id) {
    if (city_id == "undefined") return null;
    if (MapMarkers.cache[city_id]) return MapMarkers.cache[city_id];
    if (!city_locs[city_id]) return null;
    var lat = city_locs[city_id][0];
    var lng = city_locs[city_id][1];
    var marker = MapMarkers.marker(lat, lng, 'ninjaguy', cities[city_id]);

    GEvent.addListener( marker, "click", function() { 
      Viewer.go("/organize/your_squad/City__" + city_id); 
    });
    
    MapMarkers.cache[city_id] = marker;
    return marker;
  },
    
  for_agent: function(agent) {
    if (MapMarkers.cache[agent.id]) return MapMarkers.cache[agent.id];
    var marker = MapMarkers.marker(agent.lat, agent.lng, agent.map_icon, agent.title);
    marker.info_data = agent;

    GEvent.addListener( marker, "click", function() { 
      Viewer.open(agent.id); 
    });
    // GEvent.addListener( marker, "infowindowclose", function() { Viewer.close(agent); });
    GEvent.addListener( marker, "dblclick", function() {
      Map.Gmap.setCenter( marker.getPoint(), 15 ); 
    });

    MapMarkers.cache[agent.id] = marker;
    return marker;
  }
  
};
