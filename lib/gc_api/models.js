Resource.prototype.in_city = function(city, more){
  if (!more) return this.find("=city_id " + city.resource_id());
  return this.find("=city_id " + city.resource_id() + " " + more);
};

Resource.prototype.with_atag = function(atag){
  return this.find(":atags " + atag) || [];
};

Agents = new Resource('Agent', {
  enhancer: function(item) { Item.calculate_fields(item); },
  changed: function(item) { if (item.item_tag == CurrentUser.tag) $.extend(CurrentUser, item); }
});

Landmarks = new Resource('Landmark');
Ideas = new Resource('Idea');


// item - an item on the map
function item(city, tag, title, thumb_url, lat, lng, atags, latch, comm, req, x){
  return Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    thumb_url: thumb_url,
    lat: lat,
    lng: lng,
    atags: atags,
    latch: latch,
    comm: comm,
    req: req
  }, x);
}

// ltypes???
function _idea(tag, r, t, a, x){
  return Ideas.add_or_update(tag, {rank: r, title: t, atags: a}, x);
}

// idea - a template for a gathering
function idea(tag, title, atags, ltypes, json_etc){
  var parts = tag.split('__');
  Resource.add_or_update(tag, $.extend({
    id: parts[1],
    item_tag: tag,
    title: title,
    atags: atags
  }, json_etc));
}


// this kind of thing let's us shard data and load it by city
//
// Landmarks = new Resource('Landmark', {
//   load_by_city_id: function(city_id) {
//     $.ajax({
//       url: '/gc/viewer_city.js',
//       data: {city_id: city_id},
//       async: false,
//       success: function(obj){ eval(obj); }
//     });
//   }
// });
