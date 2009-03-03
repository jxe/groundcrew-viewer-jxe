MapLandmarks = {
  
  map_init: function(map) {
    var mgr = MapLandmarks.mgr = new MarkerManager(map, {maxZoom: 19});
    GEvent.addListener(map, "moveend", function() {
      var bounds = map.getBounds();
      var zoom = map.getBoundsZoomLevel(bounds);
      if (zoom <= 9) return MapLandmarks.off();
      else MapLandmarks.fetch_landmarks_in_bounds(bounds);
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
        if (Landmarks.id("p" + this.photo_id)) return;
        var x = this;
        var lm = MapLandmarks.lm_from_pano(x);
        var marker = MapLandmarks.marker_for_lm(lm);
        MapLandmarks.mgr.addMarker(marker, 0);
        MapLandmarks.mgr.addMarker(marker, Map.Gmap.getZoom());
      });
    });
  },
  
  city_changed: function(city_id) {
    if (!city_id || !Map.Gmap) return;
    var lms = Landmarks.in_city(city_id);
    $.each(lms, function(){
      var marker = MapLandmarks.marker_for_lm(this);
      MapLandmarks.mgr.addMarker(marker, 0);
      MapLandmarks.mgr.addMarker(marker, Map.Gmap.getZoom());
    });
  },
  
  off: function() {
    MapLandmarks.mgr.clearMarkers();
  },
  
  lm_from_pano: function(x) {
    var tag = "Landmark__p" + x.photo_id;
    return item(Viewer.selected_city, tag, x.photo_title, x.photo_file_url, x.latitude, x.longitude, null, null, null, null, {
        map_thumb_url: 'http://www.panoramio.com/photos/mini_square/' + x.photo_id + '.jpg',
        thumb_height: x.height,
        thumb_width: x.width,
        more_url: x.photo_url,
        pano_id: x.photo_id
    });
  },
  
  marker_for_lm: function(lm) {
    var marker = new GMarker(new GLatLng(lm.lat, lm.lng), {icon: MapIcons.for_landmark(lm), title: lm.title});
    GEvent.addListener(marker, "click", function(){ Viewer.open(lm.item_tag); });
    lm.map_marker = marker;
    return marker;
  }
  
}

components.push(MapLandmarks);
