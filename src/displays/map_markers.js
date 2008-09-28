MapMarkers = {

  iw_marker: null,
  iw_item: null,
  iw_item_type: null,
  
  open: function(item, type) {
    if (!Map.available()) return;
    this.iw_item = item;
    this.iw_item_type = type;
    var content = this.content_for(item, type);
    var marker = this.marker_for(item, type);
    if (this.iw_marker == marker) {
      Map.Gmap.updateCurrentTab(function(tab){ tab.contentElem = content; });
    } else {
      this.iw_marker = marker;
      this.iw_marker.openInfoWindow(content, {noCloseOnClick: true});
    }
  },
  
  marker_for: function(item, type) {
    var x = item.marker || MapMarkers.cache[item] || MapMarkers.cache[item.item_tag] || MapMarkers.cache[item.landmark_tag] || MapMarkers.cache[Number(item)];
    if (x) return x;
    alert('no marker found for ' + item);
  },
  
  content_for: function(item, type) {
    if (type == 'agent') return item.map_icon == 'sman' ? SelfIW.asDOMObj() : AgentIW.asDOMObj(item);
    if (type == 'pano') return item.html;
    if (type == 'suggestion') return SuggestionIW.suggestion_DOMObj(item);
    if (type == 'lmark') return LandmarkIW.asDOMObj(item);
    if (type == 'city') return CityIW.asDOMObj();
    if (type == 'wishlets') return WishletsIW.domObj();
    return $('<div>we do not recognize this item</div>')[0];
  },
  
  close: function(item) {
    if (item && item != this.iw_item) return;
    this.iw_item = null;
    this.iw_item_type = null;
    this.iw_marker = null;
    if (!Map.available()) return;
    Map.Gmap.closeInfoWindow();
  },
  
  //
  // itemdb notifications when something has changed
  // either update the marker or the info window
  //
  
  did_change_item: function(changed_item, how) {
    if (Viewer.selected_city != changed_item.city_id) return;
    if (MapMarkers.iw_item && MapMarkers.iw_item.item_tag == changed_item.item_tag) {
      MapMarkers.open(changed_item, MapMarkers.iw_item_type);
    } else {
      MapMarkers.update_agent_marker(agent);
    }
  },
  
  
  //
  // city refocus and highlights for tour mode
  //
  
  select_city: function() {
    if (!Map.available()) return;
    if (Viewer.selected_city) {
      $('body').removeClass('zoomed_out');
      var agents = ItemDb.agents_by_city[Viewer.selected_city];
      Map.load_and_refocus(agents.map(MapMarkers.for_agent));
      var lms = LandmarkDb.landmarks_by_city[Viewer.selected_city];
      if (lms) Map.add(lms.map(MapMarkers.for_landmark));
      Map.add([MapMarkers.for_city(Viewer.selected_city, true)]);
    } else {
      var cities = $keys(ItemDb.agents_by_city);
      Map.load_and_refocus(cities.map(MapMarkers.for_city));
      $('body').addClass('zoomed_out');
    }
  },
  
  new_landmark: function(lm) {
    Map.add([MapMarkers.for_landmark(lm)]);
  },  
  
  re_highlight: function() {
    if (!Map.available()) return;
    var crew = Tour.highlighted_crew || [];
    var old_crew = Tour.prev_highlighted_crew || [];
    $.each(old_crew.concat(crew), function(){ MapMarkers.update_agent_marker(this); });
    if (crew.length > 0) Map.set_bounds_from_lat_lngs(crew);
  },
  
  
  
  //
  // private
  //
  
  cache: {},
  
  update_agent_marker: function(agent) {
    if (!agent.item_tag) return;
    var old_marker = MapMarkers.cache[agent.item_tag];
    delete MapMarkers.cache[agent.item_tag];
    Map.replace_marker(old_marker, agent.title && MapMarkers.for_agent(agent));
  },
  
  marker: function(lat, lng, type, title) {
    if (!lat || !lng || !type || !title){
      console.log("Programmer error.  Bad marker.");
      console.log([lat, lng, type, title]);
      throw "serios problem";
    }
    var icon = new GIcon(G_DEFAULT_ICON, 'i/' + type + '.png');
    if (type.indexOf('man') >= 0) {
      icon.shadow = "i/man.shadow.png";
      icon.iconSize = new GSize(32, 32);
      icon.shadowSize = new GSize(59, 32);
      icon.iconAnchor = new GPoint(10, 30);
      icon.infoWindowAnchor = new GPoint(24, 4);
    }
    if (type.indexOf('bump') >= 0) {
      // add shadow and adjust size
      icon.shadow = "i/lilhouse_shadow.png";
      icon.iconSize = new GSize(20, 20);
      icon.shadowSize = new GSize(59, 32);
      icon.iconAnchor = new GPoint(10, 10);
      icon.infoWindowAnchor = new GPoint(15, 10);
    }
    return new GMarker( new GLatLng(lat, lng), { 'title': title, 'icon': icon } );
  },
  
  for_city: function(city_id) {
    if (city_id == "undefined") return null;
    if (MapMarkers.cache[city_id]) return MapMarkers.cache[city_id];
    var lat = city_locs[city_id][0];
    var lng = city_locs[city_id][1];
    var marker = MapMarkers.marker(lat, lng, 'ninjaguy', cities[city_id]);

    GEvent.addListener( marker, "click", function() {
      Viewer.open(city_id);
    });
    
    MapMarkers.cache[city_id] = marker;
    return marker;
  },
  
  for_landmark: function(lm) {
    if (MapMarkers.cache[lm.item_tag]) return MapMarkers.cache[lm.item_tag];
    var marker = MapMarkers.marker(lm.lat, lm.lng, 'sbump', lm.title);
    marker.info_data = lm;

    GEvent.addListener( marker, "click",           function() { Viewer.open(lm); });
    GEvent.addListener( marker, "infowindowclose", function() { Viewer.close(lm); });

    MapMarkers.cache[lm.item_tag] = marker;
    return marker;
  },
  
  for_agent: function(agent) {
    if (MapMarkers.cache[agent.item_tag]) return MapMarkers.cache[agent.item_tag];
    var marker = MapMarkers.marker(agent.lat, agent.lng, agent.map_icon, agent.title);
    marker.info_data = agent;

    GEvent.addListener( marker, "click", function() { Viewer.open(agent); });
    GEvent.addListener( marker, "infowindowclose", function() { Viewer.close(agent); });
    GEvent.addListener( marker, "dblclick", function() {
      Map.Gmap.setCenter( marker.getPoint(), 15 ); 
    });

    MapMarkers.cache[agent.item_tag] = marker;
    return marker;
  }
  
};
