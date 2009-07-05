var map;

Map = {  
  last_zoom_auto_set: 0,
  initialized: false,
  layers: {},
  open_marker: null,
  open_in_progress: false,
  
  clear_layer: function(lname) {
    Map.hide_layer(lname, true);
  },
  
  hide_layer: function(lname, clear) {
    var layer = Map.layers[lname];
    if (!layer) return;
    if (clear) { layer.empty = true; layer.mgr.clearMarkers(); }
    layer.mgr.hide();
    layer.unshown = true;
  },
  
  show_layer: function(lname, zoom) {
    var markers;
    var layer = Map.layers[lname];
    if (layer && layer.mgr && layer.mgr.visible()) return;
    if (!layer)       layer   = Map.layers[lname] = { unshown: true, empty: true };
    if (layer.empty)  layer.markers = Map.layers[lname + '_f']().compact();
    if (!layer.markers && zoom) alert('no markers for zoom: ' + lname);
    if (layer.markers && zoom)         Map.set_bounds_from_lat_lngs(layer.markers);
    if (!layer.mgr)   layer.mgr = new MarkerManager(map, {maxZoom: 19});
    
    if (layer.empty) {
      layer.mgr.addMarkers(layer.markers, 0);
      layer.empty = false;
    }

    if (layer.unshown) {
      console.log('showing layer '+lname);
      layer.mgr.show();
      layer.unshown = false;
    }
  },
  
  add_to_layer: function(lname, markers) {
    var layer = Map.layers[lname];
    if (!layer)       layer   = Map.layers[lname] = { unshown: true, empty: true };
    if (!layer.mgr)   layer.mgr = new MarkerManager(map, {maxZoom: 19});
    
    console.log('addign '+ markers.length+' markers to layer '+lname);
    layer.mgr.addMarkers(markers, 0);
    layer.mgr.addMarkers(markers, Map.Gmap.getZoom());
    layer.empty = false;

    if (true || layer.unshown) {
      console.log('showing layer '+lname);
      layer.mgr.show();
      layer.unshown = false;
    }
  },
  
  open: function(marker, content) {
    if (this.open_marker == marker) {
      return Map.Gmap.updateCurrentTab(function(tab){ tab.contentElem = content; });
    }
    this.open_marker = marker;
    this.open_in_progress = true;
    // alert('opening new window');
    this.open_marker.openInfoWindow(content, {noCloseOnClick: true});
  },

  
  // public
  
  // add: function(markers) {
  //   markers = markers.compact();
  //   $.each(markers, function(){ Map.Gmap.addOverlay(this); });
  // },
  
  // replace_marker: function(old_marker, new_marker) {
  //   if (!Map.Gmap) return;  // for disconnected testing
  //   if (old_marker) Map.Gmap.removeOverlay(old_marker);
  //   if (new_marker) Map.Gmap.addOverlay(new_marker);
  // },
  
  
  
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
    if (zoom > 3 && zoom < 12) {
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
