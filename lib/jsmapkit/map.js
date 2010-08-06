var GM;

Map = {
  
  // == MAP LAYERS == //
  
  layer_calculated:  {},
  layer_visible:     {},
  layer_markers:     {},
  layer_calculators: {},

  each_marker: function(layer, f) {
    if (!Map.layer_markers[layer]) return;
    var points = $values(Map.layer_markers[layer]);
    if (points) for (var i=1; i < points.length; i++) f(points[i]);
  },
    
  layer_forget: function(layer) {
    Map.layer_calculated[layer] = false;
    Map.layer_markers[layer] = {};
  },
  
  layer_hide: function(layer) {
    Map.each_marker(layer, function(m){ m.setMap(null); m.setVisible(false); });
    Map.layer_visible[layer] = false;
  },
  
  layer_show: function(layer) {
    Map.each_marker(layer, function(m){ m.setMap(GM); m.setVisible(true); });
    Map.layer_visible[layer] = true;
  },
  
  layer_calculate: function(layer) {
    Map.layer_markers[layer] = Map.layer_calculators[layer]();
  },
  
  layer_bounds: function(layer) {
    var bounds = new google.maps.LatLngBounds();
    Map.each_marker(layer, function(m){ bounds.extend(m.getPosition()); });
    return bounds;
  },

  layer_center: function(layer) {
    var bounds = Map.layer_bounds(layer);
    if (bounds.isEmpty()) return null;
    return bounds.getCenter();
  },
  
  layer_size: function(layer) {
    return $values(Map.layer_markers[layer]).length;
  },
  
  layer_recalculate: function(layer) {
    if (!Map.layer_visible[layer]) return Map.layer_forget(layer);
    Map.layer_hide(layer);
    Map.layer_forget(layer);
    Map.layer_calculate(layer);
    Map.layer_show(layer);
  },
  
  layer_refresh_icons: function(layer) {
    if (!Map.layer_markers[layer]) return;
    $.each($keys(Map.layer_markers[layer]), function(){
      var site = this;
      var guy = site.resource();
      if (!guy) return;
      Item.calculate_fields(guy);
      Map.site_set_image(layer, site, 'i/map/' + guy.map_icon + '.png');
    });
  },
  
  
  


  // == MAP ZOOMING == //
  
  zoom_to_marker: function(point, zoom) {
    GM.setCenter(point.getPosition());
    GM.setZoom(zoom || 15);
  },
  
  zoom_to_layer: function(layer, zoom) {
    var size = Map.layer_size(layer);
    if (size == 1) Map.zoom_to_marker($values(Map.layer_markers[layer])[0], zoom);
    else GM.fitBounds(Map.layer_bounds(layer));
  },
  
  

  // == MAP FOCUS == //
  // TODO: move this to a domain-specific file
  
  set_focus_worldwide: function() {
    Selection.clear();
    Map.layer_hide('agents');
    Map.layer_hide('landmarks');
    // Map.layer_hide('cities');
    Map.layer_forget('agents');
    Map.layer_forget('landmarks');
    // Map.layer_forget('cities');
    Map.layer_calculate('cities');
    Map.layer_show('cities');
    Map.zoom_to_layer('cities', 3);
  },
  
  set_focus_on_city: function() {
    Selection.clear();
    Map.layer_hide('cities');
    Map.layer_calculate('agents');
    Map.layer_calculate('landmarks');
    
    // set bounds...
    var agents_count = Map.layer_size('agents');
    var landmarks_count = Map.layer_size('landmarks');
    if (agents_count > 0) Map.zoom_to_layer('agents');
    else if (landmarks_count > 0) Map.zoom_to_layer('landmarks');
    else {
      var city_ll = city_locs[This.city_id];
      GM.setCenter(new google.maps.LatLng(city_ll[0], city_ll[1]));
      GM.setZoom(15);
    }
    
    Map.layer_show('agents');
    Map.layer_show('landmarks');
  },
  
  
  
  // == MAP SITES == //
  
  open_site: null,
  
  
  // lat, lng, icon, href
  site_add: function(layer, site, marker) {
    Map.layer_markers[layer][site] = marker;
    if (Map.layer_visible[layer]) marker.setMap(GM);
  },
  
  site_remove: function(layer, site) {
    var layer_marker = Map.layer_markers[layer];
    if (!layer_marker) return;
    var marker = layer_marker[site];
    if (!marker) return;
    marker.setMap(null);
    delete Map.layer_markers[layer][site];
    if (site == Map.open_site) Map.open_site = null;
  },
  
  site_set_image: function(layer, site, image_url) {
    var marker = Map.layer_markers[layer][site];
    if (marker) marker.setIcon(image_url);
  },
  
  site_move: function(layer, site, new_lat, new_lng) {
    var marker = Map.layer_markers[layer][site];
    if (!marker) return;
    var old_pos = marker.getPosition();
    var new_pos = new google.maps.LatLng(new_lat, new_lng);
    marker.setPosition(new_pos);
    if (site == Map.open_site) Map.open_site = null;
  },
  
  site_exists: function(layer, site) {
    return Map.layer_markers[layer][site];
  },
  
  site_open: function(layer, site, content, reopen) {
    // console.log("site_open()", layer, site, content, reopen);
    var marker = Map.layer_markers[layer][site];
    if (!marker) return;
    if (reopen && site == Map.open_site && GMIW.view) return GMIW.setContent(content);
    Map.open_site = site;
    marker.setMap(GM);
    marker.setVisible(true);
    GMIW.open(GM, marker);
    GMIW.setContent(content);
  },
  
  latlng_open: function(latlng, content, reopen) {
    // console.log("latlng_open()", latlng, content, reopen);
    if (!latlng) return;
    if (reopen && latlng == Map.open_site && GMIW.view) return GMIW.setContent(content);
    Map.open_site = latlng;
    GMIW.open(GM);
    GMIW.setPosition(latlng);
    GMIW.setContent(content);
  },
  
  // private
  
  establish: function(){
    GMIW = new google.maps.InfoWindow();
    map = GM = new google.maps.Map($("#gmap")[0], {
      // zoom: 4,
      // center: new google.maps.LatLng(-33, 151),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      navigationControl: true,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.SMALL,
        position: google.maps.ControlPosition.BOTTOM_RIGHT
      }
    });

    google.maps.event.addListener(GM, 'zoomend', City.adjust);
    google.maps.event.addListener(GM, 'moveend', App.decorate_map);
    google.maps.event.addListener(GMIW, 'closeclick', App.closeclick);
    google.maps.event.addListener(GM, 'click', function(e) {
      if (e.latLng) { This.click_latlng = e.latLng; go('#map_clicked'); }
    });
    // GEvent.trigger(GM, "moveend");
  }

};
