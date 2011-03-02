MapMarkers = {
  
  last_opened: null,
  last_opened_type: null,
  
  type: function(thing) {
    if (thing.resource_type() == 'Op') return 'operation';
    else if (thing.resource_type() == 'Landmark') return 'landmarks';
    else return 'agents';
  },

  has_loc: function(item) {
    if (!item) return false;
    if (item.focii) {
      var focus = This._item.focii.split(' ')[0];
      focus = focus && focus.resource();
      if (focus != item && MapMarkers.has_loc(focus)) return true;
    }
    if (item.lat && item.lng) return true;
    return false;
  },

  window: function(tmpl, window_type, min_zoom) {
    var site = This.item;
    var latlng = null;
    var site_type = MapMarkers.type(site);
    var layer = site_type;
    
    // resolve site
    if (site_type == 'operation') {
      var sited = false;
      if (This._item.focii) {
        site = This._item.focii.split(' ')[0];
        layer = MapMarkers.type(site);
        sited = Map.site_exists(layer, site);
      }
      if (!sited && This._item.lat) {
        layer = site = null;
        latlng = new google.maps.LatLng(This._item.lat, This._item.lng);
        sited = true;
      }
      if (!sited) {
        go.err('No site for op ' + This.item);
        alert('Unable to locate operation.');
        return;
      }
    }
    
    // consider reopening same window?
    var reopen = false;
    if (This.item == MapMarkers.last_opened && MapMarkers.last_opened_type == site_type)
      reopen = true;
    MapMarkers.last_opened = This.item;
    MapMarkers.last_opened_type = site_type;
    if (latlng)
      Map.latlng_open(latlng, window_type, tmpl.app_paint()[0], reopen);
    else
      Map.site_open(layer, window_type, site, tmpl.app_paint()[0], reopen);
  }
  
};

go.push({
  agents_added: function() {
    if (Map.layer_visible['agents']) Map.layer_recalculate('agents');
  },
  
  item_removed: function(tag) {
    Map.site_remove(MapMarkers.type(tag), tag);
  }
  
});
