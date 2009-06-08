var map;

Map = {  
  last_zoom_auto_set: 0,
  initialized: false,
  
  available: function() {
    if (!window.GBrowserIsCompatible || !GBrowserIsCompatible()) return false;
    if (!map) Map.establish();
    return true;
  },
  
  load_and_refocus: function(markers) {
    markers = markers.compact();
    Map.set_bounds_from_lat_lngs(markers);
    Map.Gmap.clearOverlays();
    $.each(markers, function(){ Map.Gmap.addOverlay(this); });
  },

  add: function(markers) {
    markers = markers.compact();
    $.each(markers, function(){ Map.Gmap.addOverlay(this); });
  },
  
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
    if (latlngs.length == 0) { alert('problem'); return; }

    var bounds = Map.bounds_including_all_points(latlngs);
    var center = bounds.getCenter();
    var zoom = Map.Gmap.getBoundsZoomLevel(bounds);
    if (zoom > 3 && zoom < 12) {
      center = Map.median_of_all_points(latlngs);
      zoom = 14;
    }

    Map.Gmap.setCenter(center, zoom);
    if (!Map.initialized) {
      components.trigger('map_init', Map.Gmap);
      Map.initialized = true;
    }
    Map.last_zoom_auto_set = zoom;
  },
    
  replace_marker: function(old_marker, new_marker) {
    if (!Map.Gmap) return;  // for disconnected testing
    if (old_marker) Map.Gmap.removeOverlay(old_marker);
    if (new_marker) Map.Gmap.addOverlay(new_marker);
  }

};
