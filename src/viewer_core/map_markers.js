MapMarkers = {

  iw_marker: null,
  iw_item: null,
  iw_item_type: null,
  
  cur_lmark_title: function() {
    var lmtag = MapMarkers.iw_item && MapMarkers.iw_item.landmark_tag;
    return (lmtag && lmtag.resource().title);
  },
    
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
    if (type == 'agent') return item.map_icon == 'sman' ? SelfIW.asDOMObj() : $.template('#agent_iw_template').blit()[0];
    if (type == 'pano') return item.html;
    if (type == 'gathering') return $.template('#gathering_iw_t').blit()[0];
    if (type == 'lmark')     return $.template('#lmark_template').blit()[0];
    if (type == 'city')      return $.template('#ready_iw_t').blit()[0];
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
    if (changed_item.item_tag == agent_tag) {
      person_item = changed_item;
      if (MapMarkers.iw_item && MapMarkers.iw_item.item_tag == agent_tag) {
        var type = MapMarkers.iw_item_type;
        if (MapMarkers.iw_item.city_id != person_item.city_id) {
          MapMarkers.close();
          delete MapMarkers.cache[changed_item.item_tag];
          // MapMarkers.update_agent_marker(changed_item);
          Viewer.go_to_self();
        } else if (MapMarkers.iw_item.lat != person_item.lat) {
          MapMarkers.close();
          // delete MapMarkers.cache[changed_item.item_tag];
          MapMarkers.update_agent_marker(changed_item);
          MapMarkers.open(changed_item, type);
        } else {
          MapMarkers.open(changed_item, type);
        }
      }
    } else {
      if (Viewer.selected_city != changed_item.city_id) return;
      if (MapMarkers.iw_item && MapMarkers.iw_item.item_tag == changed_item.item_tag) {
        MapMarkers.open(changed_item, MapMarkers.iw_item_type);
      } else {
        MapMarkers.update_agent_marker(changed_item);
      }
    }
  },
  
  
  //
  // city refocus and highlights for tour mode
  //
  
  display: function(city, agents) {
    if (!Map.available()) return;
    if (city) {
      // agents
      Map.load_and_refocus(agents.map(MapMarkers.for_agent));
      
      // landmarks
      var lms = Landmarks.find("=city_id " + city.resource_id());
      if (lms) Map.add(lms.map(MapMarkers.for_landmark));
      
      // the city itself
      // Map.add([MapMarkers.for_city(Viewer.selected_city, true)]);
    } else {
      var cities = $keys(Agents.find("=city_id"));
      Map.load_and_refocus(cities.map(MapMarkers.for_city));
    }
  },
  
    
  new_landmark: function(lm) {
    Map.add([MapMarkers.for_landmark(lm)]);
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
      window.dammit();
    }
    var icon = new GIcon(G_DEFAULT_ICON, 'i/map/' + type + '.png');
    if (type.indexOf('man') >= 0) {
      icon.shadow = "i/man.shadow.png";
      icon.iconSize = new GSize(32, 32);
      icon.shadowSize = new GSize(59, 32);
      icon.iconAnchor = new GPoint(10, 30);
      icon.infoWindowAnchor = new GPoint(24, 4);
    }
    if (type.indexOf('bump') >= 0) {
      // add shadow and adjust size
      icon.shadow = "i/bump_shadow.png";
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
    if (!city_locs[city_id]) return null;
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

Landmarks.changed = function(item, how) { if (how == 'added') MapMarkers.new_landmark(item); };
Agents.changed = MapMarkers.did_change_item;