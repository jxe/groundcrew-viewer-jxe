MapMarkers = {
  cache: {},
  should_update: {},

  update_delayed_markers: function() {
    $.each($keys(MapMarkers.should_update), function(){
      MapMarkers.update_marker(this);
    });
    MapMarkers.should_update = {};
  },

  update_marker: function(tag) {
    var marker = MapMarkers.cache[tag] || tag.resource().map_marker;
    var is_open = Map.open_marker == marker;
    if (!marker || !marker.mgr || !marker.info_data) return;
    if (is_open) {
      MapMarkers.should_update[tag] = true;
      return;
    }
    
    // update it's image & location
    // marker.hide();
    // marker.mgr.removeMarker(marker);
    if (marker.info_data) {
      var old_pt = marker.getPoint();
      var new_pt = new GLatLng(marker.info_data.lat, marker.info_data.lng);
      marker.setLatLng(new_pt);
      marker.mgr.onMarkerMoved_(marker, old_pt, new_pt);
      var new_image = MapIcons.for_type(marker.info_data.map_icon).image;
      Map.Gmap.addOverlay(marker);  // TODO:  encapsulation error
      marker.setImage(new_image);
    }
    
    // then remove and add back to manager to update position
    marker.mgr.addMarker(marker);
    marker.show();
    // alert("updating marker for "+ tag);
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
  }
  
};
