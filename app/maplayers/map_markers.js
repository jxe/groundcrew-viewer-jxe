MapMarkers = {
  
  window: function(tmpl, min_zoom) {
    var site = This.item;
    var layer = 'landmarks';
    var reopen = true;
    if (This.item.startsWith('Op')) {
      reopen = false;
      site = This._item.focii.split(' ')[0];
    }
    if (site.startsWith('Person')) layer = 'agents';
    Map.site_open(layer, site, tmpl.app_paint()[0], reopen);
  }
  
};
