// return a mapping from sites => markers
Map.layer_calculators['landmarks'] = function(){
  var mapping = {};
  $.each(Landmarks.here(), function(){
    mapping[this.id] = MapLandmarks.marker_for_lm(this);
  });
  return mapping;
};

MapLandmarks = {
  
  fetch_landmarks_in_bounds: function(bounds) {
    // alert('fetchifying');
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    $.getJSON("http://www.panoramio.com/map/get_panoramas.php?callback=?", {
      order: "popularity",  set: "public",  from: "0",  to: "20",  size: "small",
      maxy: northEast.lat(),  miny: southWest.lat(),  maxx: northEast.lng(),  minx: southWest.lng()
    }, function(data){
      $.each(data.photos, function(){
        var row = this;
        if (Landmarks.id("lP" + row.photo_id)) return;
        var lm = MapLandmarks.lm_from_pano(row);
        var marker = MapLandmarks.marker_for_lm(lm);
        Map.site_add('landmarks', lm.id, marker);
      });
      $('#landmarks_button_dropdown').app_paint();
    });
  },
  
  lm_from_pano: function(x) {
    var tag = "lP" + x.photo_id;
    return item(This.city_id, tag, x.photo_title, x.photo_file_url, x.latitude, x.longitude, null, null, null, null, {
        map_thumb_url: 'http://www.panoramio.com/photos/mini_square/' + x.photo_id + '.jpg',
        thumb_height: x.height,
        thumb_width: x.width,
        more_url: x.photo_url,
        pano_id: x.photo_id
    });
  },
  
  marker_for_lm: function(lm) {
    var id = lm.id;
    if (!id) console.log(lm);
    var marker = new GMarker(new GLatLng(lm.lat, lm.lng), {icon: MapIcons.for_landmark(lm), title: lm.title});
    GEvent.addListener(marker, "click", function(){ go("@" + id); });
    return marker;
  }
  
};

LiveHTML.widgets.push(MapLandmarks);
