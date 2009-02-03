var map;   
   
Map = {  

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
    map = Map.Gmap = new GMap2(document.getElementById("map_div"), {
      mapTypes: [G_SATELLITE_MAP, G_HYBRID_MAP, G_PHYSICAL_MAP, G_NORMAL_MAP]  //G_NORMAL_MAP
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
  
  set_bounds_from_lat_lngs: function(items) {
    if (!Map.Gmap) return;  // for disconnected testing
    var latlngs = items.map(function(x){ 
      if(x.lat && x.lng) return new GLatLng(x.lat, x.lng);
      if(x.getLatLng) return x.getLatLng();
    }).compact();
    if (latlngs.length == 0) { alert('problem'); return; }
    var bounds = new GLatLngBounds(latlngs[0], latlngs[0]);
    for (var i=1; i < latlngs.length; i++) bounds.extend(latlngs[i]);
    var zoom = Map.Gmap.getBoundsZoomLevel(bounds);
    if (Viewer.item == agent_tag) {
      // center just above "me"
      if (zoom < 16) zoom = 16;
      var map_height = Map.Gmap.getSize().height;
      var mp = new GMercatorProjection(23);
      var me_marker_lat_lng = MapMarkers.cache[agent_tag].getLatLng();
      var me_marker_pixel = mp.fromLatLngToPixel(me_marker_lat_lng, zoom);
      var new_center_pixel = new GPoint(me_marker_pixel.x, me_marker_pixel.y - Math.round(map_height / 4));
      var new_center_lat_lng = mp.fromPixelToLatLng(new_center_pixel, zoom);
      Map.Gmap.setCenter(new_center_lat_lng, zoom);
    } else {
      Map.Gmap.setCenter(bounds.getCenter(), zoom);
    }
    if (!Map.initted) {
      components.trigger('map_init', Map.Gmap);
      Map.initted = true;
    }
  },
    
  replace_marker: function(old_marker, new_marker) {
    if (!Map.Gmap) return;  // for disconnected testing
    if (old_marker) Map.Gmap.removeOverlay(old_marker);
    if (new_marker) Map.Gmap.addOverlay(new_marker);
  }

};
