City = {
  
  all_ids: function() {
    var cities = $keys(Agents.find("=city_id"));
    return cities.concat($keys(Landmarks.find("=city_id")));
  },
  
  adjust: function() {
    var myzoom = map.getZoom();
    if (myzoom < 9) {
      if (This.item) {
        go('item=');
      }
    } else if (myzoom > 12) {
      var closest = City.closest();
      if (closest && This.city != closest) {
        go('item=' + closest);
      }
    }
  },
  
  closest: function(latLng) {
    // GOTCHA! Google Maps' distanceFrom() method returns a string, not a float, so we pass it to parseFloat()
    if (!latLng) {
      if (map.getZoom() < 9) {
        return '';
      }
      latLng = map.getCenter();
    }
    var closest_city_id = null;
    var smallest_distance = null;
    if (This.city) { // In worldwide mode, there is no current city
      closest_city_id = This.city.slice(6);
      smallest_distance = parseFloat(
        (new google.maps.LatLng(city_locs[closest_city_id][0], city_locs[closest_city_id][1]))
        .distanceFrom(latLng)
      );
    }

    var cities = $keys(Agents.find('=city_id'));

    for (var i=0; i < cities.length; i++) {
      var city_id = cities[i];
      if (city_locs[city_id]) {
        var distance = parseFloat(
          (new google.maps.LatLng(city_locs[city_id][0], city_locs[city_id][1]))
          .distanceFrom(latLng)
        );
        if (distance < smallest_distance || closest_city_id === null) {
          closest_city_id = city_id;
          smallest_distance = distance;
        }
      }
    };
    return closest_city_id ? 'City__' + closest_city_id : ''; // Handle the case where there are no cities
  }

};
