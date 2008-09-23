CityIW = {
    
  asDOMObj: function() {
    return $.template('#city_iw_template').blit()[0];
	}
	
};


$.fn.blit = function(){
  $('#lmark_menu').html(City.landmarks_list2());    
  var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
  landmarks = landmarks && landmarks.length > 0 && landmarks.length;
  return this.fillout({
    '.nearby_agents_ct': Viewer.selected_city && (ItemDb.agents_by_city[Viewer.selected_city].length - 1),
    '.nearby_lmarks_ct': landmarks,
    '.city_name':        cities[Viewer.selected_city]
  }).clicks({
    '.nearby_agents_tour': Tour.local,
    '.city_name':          Viewer.city_summary,
    '.zoom_out':          Viewer.zoom_out,
    '.go_to_self':         Viewer.go_to_self
  }).showhide({
    '.nearby_agents_blurb': Viewer.selected_city && ItemDb.agents_by_city[Viewer.selected_city].length > 1,
    '.nearby_lmarks_blurb': landmarks
  }).find('.plink').wire_popper_links().end();
};
