LandmarkDb = {
  
  landmarks_by_city: {},
  
  add: function(lm) {
    LandmarkDb.landmarks_by_city[lm.city_id].push(lm);
    MapMarkers.new_landmark(lm);
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
