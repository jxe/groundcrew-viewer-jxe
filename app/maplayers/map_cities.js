Map.layers.cities_f = function(){
  var cities = $keys(Agents.find("=city_id"));
  return cities.map(function(city_id){
    if (city_id == "undefined") return null;
    if (MapMarkers.cache[city_id]) return MapMarkers.cache[city_id];
    if (!city_locs[city_id]) return null;
    var lat = city_locs[city_id][0];
    var lng = city_locs[city_id][1];
    
    var icon = MapIcons.for_type('ninjaguy');
    var marker = new GMarker( new GLatLng(lat, lng), { 'title': cities[city_id], 'icon': icon } );
    
    GEvent.addListener( marker, "click", function() { go("@City__" + city_id); });
    
    MapMarkers.cache[city_id] = marker;
    return marker;
  }); 
};
