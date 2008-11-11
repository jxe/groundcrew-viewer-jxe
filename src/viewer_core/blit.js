$.fn.feature_paint = function(){
  return this.clicks({
    'a':  Clicker.click
  }).find('.prompting').promptify().end();
};



$.fn.blit = function(){
  $('#lmark_menu').html(City.landmarks_list2());
  var landmarks = 0;
  if (Viewer.selected_city) {
    landmarks = Landmarks.find("=city_id " + Viewer.selected_city);
    landmarks = landmarks && landmarks.length > 0 && landmarks.length;
  }

  if (this.is('.agent_iw')) this.agent_blit();
  if (this.is('.self_iw')) this.self_blit();

  return this.fillout({
    '.nearby_agents_ct':     Viewer.selected_city && (Agents.find('=city_id ' + Viewer.selected_city).length - 1),
    '.nearby_lmarks_ct':     landmarks,
    '.city_name':            cities[Viewer.selected_city],
    '.cur_title':            Viewer.item && Viewer.item.resource().title,
    '.self_status':          person_item.status_word

  }).clicks({
    '.city_name':          Viewer.city_summary,
    '.zoom_out':           Viewer.zoom_out,
    '.go_to_self':         Viewer.go_to_self,
    '.std_click a, a.agent':  Clicker.click,
    '.gathering_invite':   Gatherings.invite
    
  }).forms({
    '.stdf':    Clicker.submit
  })
  .find('.plink').wire_popper_links().end()
  .find('.prompting').promptify().end();
};



$.fn.agent_blit = function(){
  var x = Viewer.item.resource();
  Item.calculate_fields(x);
  return this.fillout({
    '.agent_name': x.title,
    'img.headshot //src': x.thumb_url,
    '.status': Agent.status()
  }).showhide({
    '.assigner':  Agent.assignable()
  }).clicks({
    '.free_agent': Agent.free
  });
};


$.fn.self_blit = function(){
  return this.fillout({
    '.topready': person_item.topready,
    '.topready_options': SelfAgent.topready_options(),
    // '.other_readytos': SelfAgent.other_readytos(),
    '.all_readytos': SelfAgent.all_readytos()
  });
};
