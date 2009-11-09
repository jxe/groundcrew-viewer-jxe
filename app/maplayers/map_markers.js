MapMarkers = {
  
  last_opened: null,
  last_opened_type: null,
  
  type: function(thing) {
    if (thing.startsWith('Op')) return 'operation';
    else if (thing.startsWith('Landmark')) return 'landmarks';
    else return 'agents';
  },
  
  window: function(tmpl, min_zoom) {
    var site = This.item;
    var type = MapMarkers.type(site);
    var layer = type;
    
    // resolve site
    if (type == 'operation') {
      site = This._item.focii.split(' ')[0];
      layer = MapMarkers.type(site);
    }
    
    // consider reopening same window?
    var reopen = false;
    if (This.item == MapMarkers.last_opened && MapMarkers.last_opened_type == type)
      reopen = true;
    MapMarkers.last_opened = This.item;
    MapMarkers.last_opened_type = type;
    Map.site_open(layer, site, tmpl.app_paint()[0], reopen);
  }
  
};
