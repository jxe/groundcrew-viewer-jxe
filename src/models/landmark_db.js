LandmarkDb = {
  
  landmarks_by_city: {},
  
  for_city: function(city_id, f) {
    var x = LandmarkDb.landmarks_by_city[city_id];
    if (x && f) return f(x);
    if (x) return x;
    Ajax.fetch('/gc/landmarks', {city: city_id}, function(obj){
      LandmarkDb.landmarks_by_city[city_id] = obj;
      if (f) f(obj);
    });
    return null;
  },
  
  ensure_landmarks: function(city_id) {
    if (LandmarkDb.landmarks_by_city[city_id]) return;
    $.ajax({
      url: '/gc/landmarks',
      data: {city: city_id},
      async: false,
      dataType: 'json',
      success: function(obj){ 
        LandmarkDb.landmarks_by_city[city_id] = obj;
      }
    });
  },
  
  find_by_tag: function(tag) {
    var lms = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    var idx = {};
    $.each(lms, function(){
      idx[this.item_tag] = this;
    });
    return idx[tag];
  }
    
};
