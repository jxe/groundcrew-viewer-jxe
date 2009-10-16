var map;

Map = {
  
  
  // == MAP LAYERS == //
  
  layer_calculated:  {},
  layer_visible:     {},
  layer_markers:     {},
  layer_managers:    {},
  layer_calculators: {},

  
  layer_forget: function(layer) {
    Map.layer_calculated[layer] = false;
    Map.layer_markers[layer] = [];
    Map.layer_managers[layer] && Map.layer_managers[layer].clearMarkers();
  },
  
  layer_hide: function(layer) {
    Map.layer_visible[layer] = false;
    Map.layer_managers[layer] && Map.layer_managers[layer].hide();
  },
  
  layer_show: function(layer) {
    Map.layer_visible[layer] = true;
    Map.layer_managers[layer] && Map.layer_managers[layer].show();
  },
  
  layer_calculate: function(layer) {
    if (!Map.layer_managers[layer]) Map.layer_managers[layer] = new MarkerManager(map, {maxZoom: 19});
    Map.layer_markers[layer] = Map.layer_calculators[layer]().compact();
    Map.layer_managers[layer].addMarkers(Map.layer_markers[layer], 0);
  },
  
  layer_bounds: function(layer) {
    var points = Map.layer_markers[layer];
    if (!points || points.length < 2) return null;
    var bounds = new GLatLngBounds(points[0], points[0]);
    for (var i=1; i < points.length; i++) bounds.extend(points[i]);
    return bounds;
  },



  // == MAP ZOOMING == //

  zoom_to_bounds: function(bounds) {
    Map.Gmap.setCenter(bounds.getCenter(), Map.Gmap.getBoundsZoomLevel(bounds));
  },
  
  

  // == MAP FOCUS == //
  
  set_focus_worldwide: function() {
    Map.layer_forget('agents');
    Map.layer_forget('landmarks');
    var bounds = Map.layer_bounds('cities') || (new GLatLngBounds());
    Map.zoom_to_bounds(bounds);
    Map.layer_show('cities');
  },
  
  set_focus_on_city: function() {
    Map.layer_hide('cities');
    Map.layer_calculate('agents');
    Map.layer_calculate('landmarks');
    
    // set bounds...
    // if there's no agents, no landmarks...
    // if there's no agents, just one landmark
    // if there's no agents, multiple landmarks
    // if there's just one agent
    // if there's multiple agents
    
    Map.Gmap.setCenter(layer.markers[0].getLatLng(), 15);
    
    Map.layer_show('agents');
    Map.layer_show('landmarks');
  },
  
  
  
  // == MAP SITES == //
  
  site_add: function(layer, site, lat, lng, icon, href) {
    layer.mgr && layer.mgr.addMarkers(markers, 0);
    
  },
  
  site_remove: function(layer, site) {
    
  },
  
  site_move: function(layer, site) {
    
    
    var old_pt = marker.getPoint();
    var new_pt = new GLatLng(marker.info_data.lat, marker.info_data.lng);
    marker.setLatLng(new_pt);
    marker.mgr.onMarkerMoved_(marker, old_pt, new_pt);    
    
  },
  
  site_open: function(layer, site, content) {
    // if this site is not in our db, freak out
    
    // is it open already? then redisplay
    return Map.Gmap.updateCurrentTab(function(tab){ tab.contentElem = content; });
    // is it close?  then pan there, update the mgr, and add
    // is it far?  then jump there, update the mgr, and add
    //...
  },
  
  
  
  last_zoom_auto_set: 0,
  initialized: false,
  open_marker: null,
  open_in_progress: false,
  
  open: function(marker, content) {
    map.addOverlay(this.open_marker);
    this.open_marker.openInfoWindow(content, {noCloseOnClick: true});
  },

  
  
  
  // private
  
  establish: function(){
    var map_div = $("#map_div");
    map = Map.Gmap = new GMap2(map_div[0], {
      mapTypes: [G_NORMAL_MAP, G_SATELLITE_MAP, G_HYBRID_MAP, G_PHYSICAL_MAP]
    });
    // Map.Gmap.enableContinuousZoom();
    Map.Gmap.enableScrollWheelZoom();
    new GKeyboardHandler(Map.Gmap);
    var bRight = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(29,5));
    var bRightSnug = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(5,5));
    var bLeftFurther = new GControlPosition(G_ANCHOR_BOTTOM_LEFT, new GSize(160,5));
    Map.Gmap.addControl(new GSmallZoomControl(), bRightSnug);
    Map.Gmap.addControl(new GMenuMapTypeControl(), bRight);
    GEvent.addListener(map, "infowindowopen", function(){ Map.open_in_progress = false; });
    GEvent.addListener(map, 'zoomend', function(){ City.adjust(); });
    GEvent.addListener(map, "click", function(overlay, latlng) {
      if (!latlng) return;
      This.click_latlng = latlng;
      This.click_lat = latlng.lat();
      This.click_lng = latlng.lng();
      go('#map_clicked');
    });
  },
  
  bounds_including_all_points: function(points) {
    var bounds = new GLatLngBounds(points[0], points[0]);
    for (var i=1; i < points.length; i++) bounds.extend(points[i]);
    return bounds;
  },
  
  median_of_all_points: function(points) {
    var lat = points.map(function(x){ return x.lat(); }).median();
    var lng = points.map(function(x){ return x.lng(); }).median();
    return new GLatLng(lat, lng);
  },
  
  set_bounds_from_lat_lngs: function(items) {
    if (!Map.Gmap) return;  // for disconnected testing
    var latlngs = items.map(function(x){ 
      if(x.lat && x.lng) return new GLatLng(x.lat, x.lng);
      if(x.getLatLng) return x.getLatLng();
    }).compact();
    if (latlngs.length == 0) { alert('map reset problem: no items'); return; }

    var bounds = Map.bounds_including_all_points(latlngs);
    var center = bounds.getCenter();
    var zoom = Map.Gmap.getBoundsZoomLevel(bounds);
    if (zoom > 6 && zoom < 12) {
      // alert('finding median...');
      center = Map.median_of_all_points(latlngs);
      zoom = 14;
    }

    Map.Gmap.setCenter(center, zoom);
    if (!Map.initialized) {
      trigger('map_init', Map.Gmap);
      Map.initialized = true;
    }
    Map.last_zoom_auto_set = zoom;
  }

};
