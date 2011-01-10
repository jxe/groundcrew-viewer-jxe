City = {
  
  all_ids: function() {
    var cities = $keys(Agents.find("=city_id"));
    return cities.concat($keys(Landmarks.find("=city_id")));
  },
  
  adjust: function() {
    var myzoom = map.getZoom();
    if (myzoom < 8) {
      if (This.item) return go('item=');
    } else if (myzoom > 15) {
      if (This.item) return;
      var closest = City.closest();
      if (closest) go('item=' + closest);
    }
  },
  
  closest: function(latLng) {
    if (!latLng) {
      if (map.getZoom() < 9) return '';
      latLng = map.getCenter();
    }
    var cities = $keys(Agents.find('=city_id'));
    for (var i=0; i < cities.length; i++) {
      var x = cities[i];
      if (city_locs[x]) {
        var cityll = new google.maps.LatLng(city_locs[x][0], city_locs[x][1]);
        var dist = cityll.distanceFrom(latLng);
        if (dist < 80000) return "City__" + x;
      }
    };
    return '';
  }

};
