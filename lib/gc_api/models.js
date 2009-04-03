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
