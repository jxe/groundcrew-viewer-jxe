var cities = {};
var city_locs = {};

// city - a city in which there is groundcrew activity
function city(id, title, lat, lng, agent_count){
  var parts = title.split(', ');
  cities[id] = parts[0];
  city_locs[id] = [lat, lng];
}

City = {
  
  closest: function() {
    var myzoom = map.getZoom();
    if (myzoom < 9) return null;
    var myll = map.getCenter();
    var cities = $keys(Agents.find('=city_id'));
    console.log(cities);
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
