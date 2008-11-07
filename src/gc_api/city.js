City = {

  // $find('agents', 'city_id:<id> /atag');
  atags_in_city: function(city) {
    return rebuzz(City.agents_in_city(city), '.atag_arr');
  },

  // Resource.find('agents', 'city_id:<id>');
  agents_in_city: function(city) {
	  return ItemDb.agents_by_city[city.split('__')[1]];
  },
  
  // Agents.with("city_id:<id> atag:<atag>");
  // Agents.with("city_id =<id> atag =<atag>");
  // Resource.find('agents', 'city_id:<id> atag:<atag>');
  agents_with_atag_in_city: function(city, atag) {
    return City.atags_in_city(city).bins[atag];
  },
        
  landmarks_list2: function() {
    var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    if (!landmarks) return '';
    return landmarks.map(function(lm){
      return "<a href='#' item='"+ lm.item_tag +"'>" + lm.title + "</a>";
    }).join('');
	},
	
	wishmenu: function(menu) {
    var lmtag = MapMarkers.iw_item && MapMarkers.iw_item.landmark_tag;
	  var html = City.ready_arr.slice(0, 15).map(function(x){
	    return tag('a', {
	      content: x.bin,
	      goal: x.bin,
	      item: lmtag
	    });
	  }).join('');
	  menu.find('.inner_menu').html(html).end().blit();
	}
		
};
