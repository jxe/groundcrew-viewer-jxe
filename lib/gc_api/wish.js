function wish(city, tag, title, focii, architect, atype, count, x){
  return Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    focii: focii,
    architect: architect,
    atype: atype,
    count: count
  }, x);
}


Wishes = new Resource('Wish', {
  enhancer: function(x){ 
    x.site = x.focii && x.focii.split(' ')[0];
    x.thumb_url = x.site && x.site.resource().thumb_url;
  }
});


Wish = {
  
  create: function(site, title, count) {
    var wishtag = "Wish__" + Ajax.uuid();
    var city_id = site.resource().city_id;
    return wish(city_id, wishtag, title, site, This.user.tag, 'idea', count);
  },
  
  register_at_landmark: function(site, title, count, callback) {
    var wish = Wish.create(site, title, count);
    callback(wish);
  },
  
  register_with_landmark: function(lat, lng, placename, title, count, callback) {
    var landmark = Landmark.create(lat, lng, placename);
    var wish = Wish.create(landmark.tag, title, count);
    callback(wish);
  }
    
};
