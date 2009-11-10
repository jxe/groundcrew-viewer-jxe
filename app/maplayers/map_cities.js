// return a mapping from sites => markers
Map.layer_calculators['cities'] = function(){
  var mapping = {};  
  var done = {};
  $.each(City.all_ids(), function(){
    if (this == "undefined") return;
    var city_id = Number(this);
    if (!city_locs[city_id]) return;
    if (done[city_id]) return;
    done[city_id] = true;

    var lat = city_locs[city_id][0];
    var lng = city_locs[city_id][1];
    var icon = MapIcons.for_type('ninjaguy');
    var marker = new GMarker( new GLatLng(lat, lng), { 'title': cities[city_id], 'icon': icon } );
    GEvent.addListener( marker, "click", function() { go("@City__" + city_id); });
    mapping[city_id] = marker;
  });
  
  return mapping;
};
