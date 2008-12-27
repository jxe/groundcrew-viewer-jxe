Resource.prototype.in_city = function(city, more){
  if (!more) return this.find("=city_id " + city.resource_id());
  return this.find("=city_id " + city.resource_id() + " " + more);
};

Resource.prototype.with_atag = function(atag){
  return this.find(":atags " + atag) || [];
};

Agents = new Resource('Agent', {
  enhancer: function(item) { Item.calculate_fields(item); }
});

Landmarks = new Resource('Landmark', {
  load_by_city_id: function(city_id) {
    // $.ajax({
    //   url: '/gc/viewer_city.js',
    //   data: {city_id: city_id},
    //   async: false,
    //   success: function(obj){ eval(obj); }
    // });
  }
});

Ideas = new Resource('Idea');


// =====================================================
// = there has been no attempt to optimize any of this =
// =====================================================

function item(city_id, tag, title, thumb_url, lat, lng, atags, latch, comm, req, json_etc){
  var parts = tag.split('__');
  Resource.add_or_update($.extend({
    id: Number(parts[1]),
    item_tag: tag,
    title: title,
    thumb_url: thumb_url,
    city_id: city_id,
    lat: lat,
    lng: lng,
    atags: atags,
    latch: latch,
    comm: comm,
    req: req
  }, json_etc));
}

var cities = {};
var city_locs = {};
function city(id, title, lat, lng, agent_count){
  var parts = title.split(', ');
  cities[id] = parts[0];
  city_locs[id] = [lat, lng];
}

function idea(tag, title, atags, ltypes, json_etc){
  var parts = tag.split('__');
  Resource.add_or_update($.extend({
    id: Number(parts[1]),
    item_tag: tag,
    title: title,
    atags: atags
  }, json_etc));
}
