Map.layers.landmarks_f = function(){ 
  var lms = Landmarks.here();
  if (!lms) return [];
  return lms.map(function(x){
    return MapLandmarks.marker_for_lm(x);
  });
};

Map.layers.wishes_f = function(){ return []; };

MapLandmarks = {
  
  map_init: function(map) {
    GEvent.addListener(map, "moveend", function() {
      if (!This.map_layers.contains('landmarks')) return;
      var bounds = map.getBounds();
      // var zoom = map.getBoundsZoomLevel(bounds);
      // if (zoom <= 9) return MapLandmarks.off();
      MapLandmarks.fetch_landmarks_in_bounds(bounds);
    });
    GEvent.trigger(map, "moveend");
  },

  fetch_landmarks_in_bounds: function(bounds) {
    // alert('fetchifying');
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    $.getJSON("http://www.panoramio.com/map/get_panoramas.php?callback=?", {
      order: "popularity",  set: "public",  from: "0",  to: "20",  size: "small",
      maxy: northEast.lat(),  miny: southWest.lat(),  maxx: northEast.lng(),  minx: southWest.lng()
    }, function(data){
      Map.add_to_layer('landmarks', data.photos.map(function(row){
        if (Landmarks.id("p" + row.photo_id)) return;
        return MapLandmarks.marker_for_lm(MapLandmarks.lm_from_pano(row));
      }).compact());
      $('#landmarks_button_dropdown').app_paint();
    });
  },
  
  lm_from_pano: function(x) {
    var tag = "Landmark__p" + x.photo_id;
    return item(This.city_id, tag, x.photo_title, x.photo_file_url, x.latitude, x.longitude, null, null, null, null, {
        map_thumb_url: 'http://www.panoramio.com/photos/mini_square/' + x.photo_id + '.jpg',
        thumb_height: x.height,
        thumb_width: x.width,
        more_url: x.photo_url,
        pano_id: x.photo_id
    });
  },
  
  marker_for_lm: function(lm) {
    var marker = new GMarker(new GLatLng(lm.lat, lm.lng), {icon: MapIcons.for_landmark(lm), title: lm.title});
    GEvent.addListener(marker, "click", function(){ go("@" + lm.id); });
    GEvent.addListener( marker, "infowindowclose", function() { 
      if (Map.open_in_progress) return true;
      if (!This._item) return true;
      // if (This.item != lm.id) { alert('not closing; landmark is not item'); return; };
      go('@' + This.city);
    });
    
    lm.map_marker = marker;
    return marker;
  }
  
};

LiveHTML.widgets.push(MapLandmarks);
