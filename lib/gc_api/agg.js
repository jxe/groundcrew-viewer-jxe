Aggregates = new Resource('Aggregate', {
  changed: function(what_changed) {
    $('#aggs_magic').app_paint();
  },

  players: function(needed) {
    needed = parseInt(needed, 10);
    if ( !(needed > 0) ) return [];
    var aggs = Aggregates.here_by_dist(
      This._item ? This._item.lat : This.click_latlng.lat(),
      This._item ? This._item.lng : This.click_latlng.lng());

    var result = [];
    while(aggs.length > 0 && needed > 0) {
      agg = aggs.shift().item;
      num = agg.size > needed ? needed : agg.size;
      result.push(agg.id + ":" + num);
      needed = needed - num;
    }
    return result;
  }
});

function agg(tag, city, loc, lat, lng, acc, size, available, atags) {
  return Aggregates.add_or_update(tag, {
    city_id: city,
    loc: loc,
    lat: lat,
    lng: lng,
    acc: acc,
    size: size,
    available: available,
    atags: atags
  });
}
