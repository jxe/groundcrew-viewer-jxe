City = {

  recalc_city: function() {
    var city = Viewer.selected_city;
    if (!city || city == 'nothing') {
      City.agents_by_readiness = {};
      City.readinesses = [];
      City.readinesses_ct = 0;
      return;
    }

	  var local_agents = ItemDb.agents_by_city[Viewer.selected_city];
	  var now = Date.unix();
	  
    var ready_arr = rebuzz(local_agents, '.readyto_arr', function(x){
      var bumped = x.map(function(a){ return a.readyto[x.bin]; }).max();
      var days_old = (now - bumped) / (60*60*24);
      var multiplier = (2.0 - days_old) / 2.0;
      if (multiplier < 0.2) multiplier = 0.2;
      var posx = x.map('.posx').sum() || 1;
      return -(posx * multiplier);
    });
    
    City.ready_arr = ready_arr;
    City.agents_by_readiness = ready_arr.bins;
    City.readinesses_ct = ready_arr.length;
    City.readinesses = ready_arr.map(function(x){
      var my_team = x.map('.item_tag').contains(agent_tag);
      return tag('span.readiness',        
        tag('a.title', {
          goal: x.bin,
          content: "to " + x.bin,
          agent_tags: x.map('.item_tag').join(' ')
          // popper: '#readiness_popper/bc'
        }) + ' <span class="act">' + pluralize( x.length, 'agent' ) + "</span>"
      );
    }).join(' ');
    
    $(document).blit();
  },
      
  landmarks_list2: function() {
    var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    if (!landmarks) return '';
    return landmarks.map(function(lm){
      return "<a href='#' item='"+ lm.item_tag +"'>" + lm.title + "</a>";
    }).join('');
	},
	
	readymenu: function(menu, readiness) {
	  Item.calculate_fields(person_item);
	  var goal = readiness.attr('goal');
    var others = City.agents_by_readiness[goal];
    var links = [];
    var not_just_me = others && (others.length > 1 || others[0] && others[0].item_tag != agent_tag);
    if (not_just_me) {
      links.push(tag('a', {
        content: 'view these agents',
        goal: goal,
        agent_tags: others.map('.item_tag').join(' ')
      }));
      if (Number(Viewer.selected_city) == Number(person_item.city_id)) {
    	  //     join these agents in the field
      } else {
        //     gather these agents
      }
    }
    
    if (person_item.readyto_arr.contains(goal)){
      links.push(button('clear_readyness', 'cancel this wish'));
    } else {
      links.push(button('join_readyness', 'join this wishgroup'));
    }
    	  
	  menu.find('.inner_menu').html(links.join(''));
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
