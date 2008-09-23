LandmarkIW = {

  new_suggestion: function(form) {
    var text = $(form).find('input').val();
    var atag = $(form).find('select').val();
    Viewer.start_suggestion(MapMarkers.iw_item.item_tag, text, atag);
  },
  
  asDOMObj: function(x) {
    return $.template('#lmark_template').showhide({
      '#lmark_nearby'       : ItemDb.agents_by_city[Viewer.selected_city].length > 1
    }).fillout({
      '#lmark_nearby_count' : ItemDb.agents_by_city[Viewer.selected_city].length,
      '#lmark_title'        : x.title,
      'select'              : City.atags_ripe()
    }).clicks({
      '#lmark_nearby'       : Tour.local
    }).forms({
      "form"                : LandmarkIW.new_suggestion
    }).popups()[0];
  }
    
};
