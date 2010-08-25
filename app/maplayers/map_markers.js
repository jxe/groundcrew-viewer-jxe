MapMarkers = {
  
  last_opened: null,
  last_opened_type: null,
  
  type: function(thing) {
    if (thing.resource_type() == 'Op') return 'operation';
    else if (thing.resource_type() == 'Landmark') return 'landmarks';
    else return 'agents';
  },
  
  window: function(tmpl, min_zoom) {
    var site = This.item;
    var latlng = null;
    var type = MapMarkers.type(site);
    var layer = type;
    
    // resolve site
    if (type == 'operation') {
      var sited = false;
      if (This._item.focii) {
        site = This._item.focii.split(' ')[0];
        layer = MapMarkers.type(site);
        sited = Map.site_exists(layer, site);
      }
      if (!sited && This._item.lat) {
        layer = site = null;
        latlng = new GLatLng(This._item.lat, This._item.lng);
        sited = true;
      }
      if (!sited) {
        report_error('No site for op ' + This.item);
        alert('Unable to locate operation.');
        return;
      }
    }
    
    // consider reopening same window?
    var reopen = false;
    if (This.item == MapMarkers.last_opened && MapMarkers.last_opened_type == type)
      reopen = true;
    MapMarkers.last_opened = This.item;
    MapMarkers.last_opened_type = type;
    if (latlng)
      Map.latlng_open(latlng, tmpl.app_paint()[0], reopen);
    else
      Map.site_open(layer, site, tmpl.app_paint()[0], reopen);
  }
  
};
