var GM;

Map = {
  
  
  // == MAP LAYERS == //
  
  layer_calculated:  {},
  layer_visible:     {},
  layer_markers:     {},
  layer_managers:    {},
  layer_calculators: {},

  
  layer_forget: function(layer) {
    Map.layer_calculated[layer] = false;
    Map.layer_markers[layer] = {};
    Map.layer_managers[layer] && Map.layer_managers[layer].clearMarkers();
  },
  
  layer_hide: function(layer) {
    Map.layer_visible[layer] = false;
    Map.layer_managers[layer] && Map.layer_managers[layer].hide();
  },
  
  layer_show: function(layer) {
    if (!Map.layer_managers[layer]) {
      Map.layer_managers[layer] = new MarkerManager(GM);  //{maxZoom: 19}
      Map.layer_managers[layer].addMarkers($values(Map.layer_markers[layer]), 0);
    }
    
    Map.layer_managers[layer].show();
    Map.layer_visible[layer] = true;
  },
  
  layer_calculate: function(layer) {
    Map.layer_markers[layer] = Map.layer_calculators[layer]();
  },
  
  layer_bounds: function(layer) {
    var points = $values(Map.layer_markers[layer]);
    if (!points || points.length < 2) return null;
    var bounds = new GLatLngBounds(points[0].getLatLng(), points[0].getLatLng());
    for (var i=1; i < points.length; i++) bounds.extend(points[i].getLatLng());
    return bounds;
  },

  layer_center: function(layer) {
    var points = $values(Map.layer_markers[layer]);
    if (points.length == 0) return null;
    else if (points.length == 0) return points[0];
    else return Map.layer_bounds(layer).getCenter();
  },
  
  layer_size: function(layer) {
    return $values(Map.layer_markers[layer]).length;
  },
  
  layer_recalculate: function(layer) {
    Map.layer_hide(layer);
    Map.layer_forget(layer);
    Map.layer_calculate(layer);
    Map.layer_show(layer);
  },
  
  


  // == MAP ZOOMING == //

  zoom_to_bounds: function(bounds) {
    GM.setCenter(bounds.getCenter(), GM.getBoundsZoomLevel(bounds));
  },
  
  zoom_to_marker: function(point) {
    GM.setCenter(point.getLatLng(), 15);
  },
  
  zoom_to_layer: function(layer) {
    var size = Map.layer_size(layer);
    if (size == 1) Map.zoom_to_marker($values(Map.layer_markers[layer])[0]);
    else Map.zoom_to_bounds(Map.layer_bounds(layer));
  },
  
  

  // == MAP FOCUS == //
  // TODO: move this to a domain-specific file
  
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
    var agents_count = Map.layer_size('agents');
    var landmarks_count = Map.layer_size('landmarks');
    if (agents_count > 0) Map.zoom_to_layer('agents');
    else if (landmarks_count > 0) Map.zoom_to_layer('landmarks');
    else {
      var city_ll = city_locs[This.city_id];
      GM.setCenter(new GLatLng(city_ll[0], city_ll[1]), 15);
    }
    
    Map.layer_show('agents');
    Map.layer_show('landmarks');
  },
  
  
  
  // == MAP SITES == //
  
  open_site: null,
  
  
  // lat, lng, icon, href
  site_add: function(layer, site, marker) {
    Map.layer_markers[layer][site] = marker;
    Map.layer_managers[layer].addMarker(marker, 0);
  },
  
  site_remove: function(layer, site) {
    Map.layer_managers[layer].removeMarker(marker);
    delete Map.layer_markers[layer][site];
  },
  
  site_move: function(layer, site, new_lat, new_lng) {
    var marker = Map.layer_markers[layer][site];
    var old_pos = marker.getLatLng();
    var new_pos = new GLatLng(new_lat, new_lng);
    var mgr = Map.layer_managers[layer];
    marker.setLatLng(new_pos);
    mgr.onMarkerMoved_(marker, old_pos, new_pos);    
  },
    
  site_open: function(layer, site, content) {
    var marker = Map.layer_markers[layer][site];
    
    if (site == Map.open_site) {
      if (GM.getInfoWindow().isHidden()) GM.getInfoWindow().show();
      GM.updateCurrentTab(function(tab){ tab.contentElem = content; });
      return;
    } else {
      Map.open_site = site;
    }

    GM.openInfoWindow(marker.getLatLng(), content, {
      noCloseOnClick: true,
      pixelOffset: new GSize(5, -30)
    });
  },
  
  
  initialized: false,
  
  // private
  
  establish: function(){
    var map_div = $("#map_div");
    map = GM = new GMap2(map_div[0], {
      mapTypes: [G_NORMAL_MAP, G_SATELLITE_MAP, G_HYBRID_MAP, G_PHYSICAL_MAP]
    });
    // GM.enableContinuousZoom();
    GM.enableScrollWheelZoom();
    new GKeyboardHandler(GM);
    var bRight = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(29,5));
    var bRightSnug = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(5,5));
    var bLeftFurther = new GControlPosition(G_ANCHOR_BOTTOM_LEFT, new GSize(160,5));
    GM.addControl(new GSmallZoomControl(), bRightSnug);
    GM.addControl(new GMenuMapTypeControl(), bRight);
    GEvent.addListener(map, 'zoomend', function(){ City.adjust(); });
    GEvent.addListener(map, "click", function(overlay, latlng) {
      if (!latlng) return;
      This.click_latlng = latlng;
      This.click_lat = latlng.lat();
      This.click_lng = latlng.lng();
      go('#map_clicked');
    });
    GEvent.addListener(GM.getInfoWindow(), 'closeclick', function(){ go('#closeclick'); });
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
    if (!GM) return;  // for disconnected testing
    var latlngs = items.map(function(x){ 
      if(x.lat && x.lng) return new GLatLng(x.lat, x.lng);
      if(x.getLatLng) return x.getLatLng();
    }).compact();
    if (latlngs.length == 0) { alert('map reset problem: no items'); return; }

    var bounds = Map.bounds_including_all_points(latlngs);
    var center = bounds.getCenter();
    var zoom = GM.getBoundsZoomLevel(bounds);
    if (zoom > 6 && zoom < 12) {
      // alert('finding median...');
      center = Map.median_of_all_points(latlngs);
      zoom = 14;
    }

    GM.setCenter(center, zoom);
    if (!Map.initialized) {
      trigger('map_init', GM);
      Map.initialized = true;
    }
    Map.last_zoom_auto_set = zoom;
  }

};
