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
    Map.layer_managers[layer] && Map.layer_managers[layer].hide();
    Map.layer_visible[layer] = false;
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
    if (Map.layer_managers[layer]) {
      Map.layer_managers[layer].addMarkers($values(Map.layer_markers[layer]), 0);
    }
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
    if (!Map.layer_visible[layer]) return Map.layer_forget(layer);
    Map.layer_hide(layer);
    Map.layer_forget(layer);
    Map.layer_calculate(layer);
    Map.layer_show(layer);
  },
  
  layer_refresh_icons: function(layer) {
    if (!Map.layer_markers[layer]) return;
    $.each($keys(Map.layer_markers[layer]), function(){
      var site = this;
      var guy = site.resource();
      if (!guy) return;
      Item.calculate_fields(guy);
      Map.site_set_image(layer, site, MapIcons.for_type(guy.map_icon).image);
    });
  },
  
  
  


  // == MAP ZOOMING == //

  zoom_to_bounds: function(bounds) {
    GM.setCenter(bounds.getCenter(), GM.getBoundsZoomLevel(bounds));
  },
  
  zoom_to_marker: function(point, zoom) {
    GM.setCenter(point.getLatLng(), zoom || 15);
  },
  
  zoom_to_layer: function(layer, zoom) {
    var size = Map.layer_size(layer);
    if (size == 1) Map.zoom_to_marker($values(Map.layer_markers[layer])[0], zoom);
    else Map.zoom_to_bounds(Map.layer_bounds(layer));
  },
  
  

  // == MAP FOCUS == //
  // TODO: move this to a domain-specific file
  
  set_focus_worldwide: function() {
    Map.layer_hide('agents');
    Map.layer_hide('landmarks');
    Map.layer_hide('cities');
    Map.layer_forget('agents');
    Map.layer_forget('landmarks');
    Map.layer_forget('cities');
    Map.layer_calculate('cities');
    Map.zoom_to_layer('cities', 3);
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
    var layer_marker = Map.layer_markers[layer];
    if (!layer_marker) return;
    var marker = layer_marker[site];
    if (!marker) return;
    Map.layer_managers[layer].removeMarker(marker);
    delete Map.layer_markers[layer][site];
    if (site == Map.open_site) Map.open_site = null;
  },
  
  site_set_image: function(layer, site, image) {
    var marker = Map.layer_markers[layer][site];
    if (!marker) return;
    marker.getIcon().image = image;
    // quick hack until we understand
    try {
      if (!marker.isHidden()) marker.setImage(image);
    } catch(e) {}
  },
  
  site_move: function(layer, site, new_lat, new_lng) {
    var marker = Map.layer_markers[layer][site];
    if (!marker) return;
    var old_pos = marker.getLatLng();
    var new_pos = new GLatLng(new_lat, new_lng);
    var mgr = Map.layer_managers[layer];
    marker.setLatLng(new_pos);
    mgr.onMarkerMoved_(marker, old_pos, new_pos);
    if (site == Map.open_site) Map.open_site = null;
  },
  
  site_exists: function(layer, site) {
    return Map.layer_markers[layer][site];
  },
  
  site_open: function(layer, site, content, reopen) {
    console.log("site_open()", layer, site, content, reopen);
    
    var marker = Map.layer_markers[layer][site];
    console.log(marker);
    if (!marker) return;
    
    if (reopen && site == Map.open_site && !GM.getInfoWindow().isHidden()) {
      // GM.updateCurrentTab(function(tab){ tab.contentElem = content; });
      GM.updateInfoWindow([new GInfoWindowTab('', content)]);
      return;
    }
    Map.open_site = site;
    
    var icon = marker.getIcon();
    GM.openInfoWindow(marker.getLatLng(), content, {
      noCloseOnClick: true,
      pixelOffset: new GSize(5, -icon.iconSize.height/2)
    });
  },
  
    
  // private
  
  establish: function(){
    var map_div = $("#map_div");
    map = GM = new GMap2(map_div[0], {
      mapTypes: [G_NORMAL_MAP, G_SATELLITE_MAP, G_PHYSICAL_MAP, G_HYBRID_MAP]
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
      if (latlng) { This.click_latlng = latlng; go('#map_clicked'); }
    });
    GEvent.addListener(GM.getInfoWindow(), 'closeclick', function(){ go('#closeclick'); });
    GEvent.addListener(GM, "moveend", function() { go('#decorate_map'); });
    GEvent.trigger(GM, "moveend");
  }

};
