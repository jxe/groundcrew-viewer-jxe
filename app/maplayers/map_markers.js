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
        // make an emergency landmark, for now
        // TODO: fix... real operations layer, I guess
        lmid = "l" + site;
        lm = item(This._item.city, lmid, This._item.loc, null,
          This._item.lat, This._item.lng, '', "unlatched", null, null, {});
        Map.site_add('landmarks', lmid, MapLandmarks.marker_for_lm(lm));
        site = lmid;
        layer = 'landmarks';
        sited = true;
      }
      if (!sited) {
        App.report_error('No site for op ' + This.item);
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
    Map.site_open(layer, site, tmpl.app_paint()[0], reopen);
  }
  
};
