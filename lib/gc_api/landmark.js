Landmarks = new Resource('Landmark');

Landmark = {
  
  create: function(lat, lng, title) {
    var lmtag = "Landmark__" + Ajax.uuid();
    return item(This.city_id, lmtag, title, null, lat, lng, "", "unlatched");
  }
  
};
