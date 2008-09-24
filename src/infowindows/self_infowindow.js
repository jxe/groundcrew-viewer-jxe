SelfIW = {
  
  translate_status: { available: 'ready_to_rock', off: 'recruitable', dead: 'none' },
  
  agent_update: function(elem, data) {
    // update the interface
    $.popups.close();
    $.extend(person_item, data);
    Item.calculate_fields(person_item);
    $(elem).parents('div.troot:first').fillout({
      "#self_iw_status"           : person_item.mystatus,
      "#self_iw_status_dot //src" : person_item.dotimg,
      "#self_iw_wish"             : person_item.looking_for,
      "#self_iw_loc"              : person_item.location
    });
    
    // should possibly grey out window while update is being made
    var options;
    if (data.location) options = data;
    if (data.pgoal)    options = { desire: data.pgoal };
    if (data.status)   options = { availability: SelfIW.translate_status[data.status] };
    Ajax.fetch('/agent/update', options, ItemDb.add_or_update);    
  },
  
  change_status: function(elem) {
    SelfIW.agent_update(elem, {status: $(elem).attr('newstatus')});
  },
  
  update_loc: function(form) {
    SelfIW.agent_update(form, {location: $(form).find(':text').val()});
  },
  
  update_wish: function(form) {
    SelfIW.agent_update(form, {pgoal: $(form).find(':text').val()});
  },
  
  click: function(a) {
    var item = a.attr('item');
    if (item) return Viewer.open(item);
    var new_goal = a.attr('href');
    $('.insert_popper_here').empty();
    SelfIW.agent_update(a, {pgoal: new_goal});
  },
  
  asDOMObj: function() {
    Item.calculate_fields(person_item);
    
    var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    landmarks = landmarks && landmarks.length > 0 && landmarks.length;

    var ll = City.landmarks_list2();
    $('#lmark_menu').html(ll);
    
    var x = $.template('#self_iw_template').fillout({
      "#self_iw_status"           : person_item.mystatus,
      "#self_iw_status_dot //src" : person_item.dotimg,
      "#self_iw_wish"             : person_item.looking_for,
      "#self_iw_loc"              : person_item.location,
      "#self_iw_nearby_count"     : (ItemDb.agents_by_city[Viewer.selected_city].length - 1),
      '#lmark_nearby_count'       : landmarks
    }).clicks({
      "#self_iw_status_change a"  : SelfIW.change_status,
      "#self_iw_nearby"           : Tour.local,
      "#citysum"           : Viewer.city_summary
    }).showhide({
      '#self_iw_nearby'           : ItemDb.agents_by_city[Viewer.selected_city].length > 1,
      '#lmark_nearby'           : landmarks
    }).forms({
      "#self_iw_update_loc"       : SelfIW.update_loc,
      "#siw_wish_popup form"      : SelfIW.update_wish
    }).viewer_links().attach_popup_links().find('#lmark_nearby, .dreambox td').wire_popper_links().end().show();
  
    x.find('.dreambox form input').focus(function(){
  		this.value = '';
  	});

  	return x[0];  
	}
};
