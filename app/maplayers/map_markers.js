MapMarkers = {
  cache: {},

  iw_marker: null,
  
  update_marker: function(tag) {
    var marker = MapMarkers.cache[tag] || tag.resource().map_marker;
    // if (marker) marker.setImage('i/map/' + tag.resource().map_icon + '.png');
  },
  
  window: function(tmpl, min_zoom) {
    MapMarkers.open(This.item, tmpl.app_paint()[0], min_zoom);
  },
  
  open: function(item, content, min_zoom) {
    if (!item.resource()) {
      alert('cannot open.  missing data.');
      return;
    }
    
    var marker = MapMarkers.cache[item] || item.resource().map_marker;
    
    if (!marker) {
      var focii = item.resource().focii;
      if (focii) return MapMarkers.open(focii.split(' ')[0], content, min_zoom);
    }
    
    if (!marker) return alert('no marker found for ' + item);
    
    Map.open(marker, content);
    
    
    // rezoom (unless the user has changed the zoom recently)
    // if (Map.Gmap.getZoom() < min_zoom && Map.Gmap.getZoom() == Map.last_zoom_auto_set) {
    //   Map.last_zoom_auto_set = min_zoom;
    //   Map.Gmap.setCenter(marker.getLatLng(), min_zoom);
    // }

  }
  
};
