var revealed = null;

function unreveal(){
  if (!revealed) return;
  revealed.removeClass('revealed');
  $('body').removeClass('has_reveal');
  revealed = null;
}

$.fn.feature_paint = function(){
  this.find('[observe]').each(function(){
    var obj = $(this);
    var method = obj.attr('observe');
    obj.change(function(){
      Viewer.dispatch(method, obj.val(), Viewer.current_app.state);
      return true;
    });
  });
  this.find('[reveal]').each(function(){
    var obj = $(this);
    var name = obj.attr('reveal');
    var thing = $('#' + name);
    obj.unbind('click').click(function(){
      if (revealed) revealed.removeClass('revealed');
      if (revealed == thing) {
        $('body').removeClass('has_reveal');
        revealed = null;
      }
      else {
        if (Palettes[name]) Palettes[name](thing);
        $('body').addClass('has_reveal');
        revealed = thing.addClass('revealed');
      }
      return false;
    });
  });
  return this.clicks({
    'a':  Clicker.click
  });
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
    '.cur_title':            Viewer.item && Viewer.item.resource().title

  }).clicks({
    '.city_name':          Viewer.city_summary,
    '.zoom_out':           Viewer.zoom_out,
    '.go_to_self':         Viewer.go_to_self,
    '.std_click a, a.agent':  Clicker.click,
    '.gathering_invite':   Gatherings.invite
    
  }).forms({
    '.stdf':    Clicker.submit
  })
  .find('.plink').wire_popper_links().end();
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
    '.topready_options': SelfAgent.topready_options(),
    // '.other_readytos': SelfAgent.other_readytos(),
    '.all_readytos': SelfAgent.all_readytos()
  });
};
