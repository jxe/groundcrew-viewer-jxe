LandmarkLayer = {

  ids: {},
  
  map_init: function(map) {
    var mgr = LandmarkLayer.mgr = new MarkerManager(map, {maxZoom: 19});
    GEvent.addListener(map, "moveend", function() {
      var bounds = map.getBounds();
      var zoom = map.getBoundsZoomLevel(bounds);
      if (zoom <= 9) return LandmarkLayer.off();
      else LandmarkLayer.fetch_landmarks_in_bounds(bounds);
    });
    GEvent.trigger(map, "moveend");
  },
  
  fetch_landmarks_in_bounds: function(bounds) {
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    $.getJSON("http://www.panoramio.com/map/get_panoramas.php?callback=?", {
      order: "popularity",  set: "public",  from: "0",  to: "20",  size: "small",
      maxy: northEast.lat(),  miny: southWest.lat(),  maxx: northEast.lng(),  minx: southWest.lng()
    }, function(data){
      $.each(data.photos, function(){
        var x = this;
        if (LandmarkLayer.ids[x.photo_id]) return;
        var lm = LandmarkLayer.lm_from_pano(x);
        var marker = LandmarkLayer.marker_for_lm(lm);
        LandmarkLayer.mgr.addMarker(marker, 0);
        LandmarkLayer.ids[x.photo_id] = "exists";
        LandmarkLayer.mgr.addMarker(marker, Map.Gmap.getZoom());
      });
    });
  },
  
  city_changed: function(city) {
    if (!city) return;
    if (!Map.Gmap) return;
    var lms = Landmarks.in_city(city);
    if (lms) Map.add(lms.map(LandmarkLayer.marker_for_lm));
  },
  
  off: function() {
    LandmarkLayer.mgr.clearMarkers();
    LandmarkLayer.ids = {};
  },
  
  lm_from_pano: function(x) {
    var city = Viewer.current_app.state.city;
    var id = Math.rand(10000);
    var tag = "Landmark__" + id;
    return item(city, tag, x.photo_title, x.photo_file_url, x.latitude, x.longitude, null, null, null, null, {
        map_thumb_url: 'http://www.panoramio.com/photos/mini_square/' + x.photo_id + '.jpg',
        thumb_height: x.height,
        thumb_width: x.width,
        more_url: x.photo_url
    });
  },
  
  marker_for_lm: function(lm) {
    var marker = new GMarker(new GLatLng(lm.lat, lm.lng), {icon: IconFactory.for_landmark(lm), title: lm.title});
    GEvent.addListener(marker, "click", function(){ Viewer.open(lm.item_tag); });
    lm.map_marker = marker;
    return marker;
  }
  
}

components.push(LandmarkLayer);
