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
    var marker = new google.maps.Marker({
      icon: 'i/map/' + 'ninjaguy' + '.png',
      position: new google.maps.LatLng(lat, lng),
      shadow: "i/map/man.shadow.png",
      title: cities[city_id]
    });
    
    google.maps.event.addListener(marker, 'click', function() { go('@City__' + city_id); });
    mapping[city_id.toString()] = marker;
  });
  return mapping;
};
