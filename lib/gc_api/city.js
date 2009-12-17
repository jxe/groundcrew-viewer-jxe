var cities = {};
var city_locs = {};

// city - a city in which there is groundcrew activity
function city(id, title, lat, lng, agent_count){
  var parts = title.split(', ');
  cities[id] = parts[0];
  city_locs[id] = [lat, lng];
  // console.log("city: " + lat + ', ' + lng);
}

City = {
  
  all_ids: function() {
    var cities = $keys(Agents.find("=city_id"));
    return cities.concat($keys(Landmarks.find("=city_id")));
  },
  
  adjust: function() {
    var myzoom = map.getZoom();
    if (myzoom < 5) {
      if (This.item) return go('item=');
    } else {
      // if (This.item) return;
      // var closest = City.closest();
      // if (closest) go('item=' + closest);
    }
  },
  
  closest: function() {
    var myzoom = map.getZoom();
    if (myzoom < 9) return null;
    var myll = map.getCenter();
    var cities = $keys(Agents.find('=city_id'));
    // console.log(cities);
    for (var i=0; i < cities.length; i++) {
      var x = cities[i];
      if (city_locs[x]) {
        var cityll = new GLatLng(city_locs[x][0], city_locs[x][1]);
        var dist = cityll.distanceFrom(myll);
        if (dist < 80000) return "City__" + x;
      }
    };
    return null;
  }

};
