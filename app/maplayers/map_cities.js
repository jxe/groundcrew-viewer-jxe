// return a mapping from sites => markers
Map.layer_calculators['cities'] = function(){
  var mapping = {};
  var cities = $keys(Agents.find("=city_id"));
  
  $.each(cities, function(){
    var city_id = this;
    if (city_id == "undefined") return;
    if (!city_locs[city_id]) return;

    var lat = city_locs[city_id][0];
    var lng = city_locs[city_id][1];
    var icon = MapIcons.for_type('ninjaguy');
    var marker = new GMarker( new GLatLng(lat, lng), { 'title': cities[city_id], 'icon': icon } );
    GEvent.addListener( marker, "click", function() { go("@City__" + city_id); });
    mapping[this.id] = marker;
  });
  
  return mapping;
};
