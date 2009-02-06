City = {
  landmarks_list2: function() {
    if (!Viewer.selected_city) return '';
    var landmarks = Landmarks.find("=city_id " + Viewer.selected_city);
    if (!landmarks) return '';
    return landmarks.map(function(lm){
      return "<a href='#' item='"+ lm.item_tag +"'>" + lm.title + "</a>";
    }).join('');
  }
};
