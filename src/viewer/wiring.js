$.fn.viewer_links = function(){
  this.find('a[item]').click(function(){
    $.popups.close();
    $.popups2.close();
    var x = $(this).attr('item');
    if (x) Viewer.open(x);
    return false;
  });
  return this;
};



ViewerUI = {
  
  init: function() {
    this.adjust_frame();
    Reactor.handle_json_obj(initial_data);
    this.activateUI();
    if (logged_in) {
      if (!ItemDb.items[agent_tag]) ItemDb.add_or_update(person_item);
      Viewer.open(agent_tag);
    } else {
      Viewer.select_city(null);
    }
    Ajax.init();
    Youbox.init();
  },
  
  activateUI: function() {    
    $('a[rel*=facebox]').facebox();
    $(document).popups().popups2();
    
    $('.zoom_out').click(Viewer.zoom_out);
    Tour.wire();
    Dreambox.wire();
    Msgbar.wire();
    Chat.wire();
    CityJumper.wire();
    CityChooser.wire();
    Facebar.wire();
    NQueue.receivers.push(MapMarkers);
    NQueue.receivers.push(Initiatives);
    
    setInterval(function(){ $('.from_now').update_times(); }, 20000);
    $(window).resize(this.adjust_frame);
  },

  adjust_frame: function(){
    // heights: google map; events
    var junkh = 172;
    var ih = window.innerHeight || window.document.body.clientHeight;
    $('#map_div').height(ih - junkh);
    $('.rtab').height(ih - junkh + 12 - 25);

    // notify map of changes
    if (Map.Gmap) Map.Gmap.checkResize();

    $('#inner_scroll_window').width(10000);
    var agents_width = $('#agents').width() + 30;
    var window_width = window.innerWidth || window.document.body.clientWidth;
    if (agents_width + 70 < window_width) {
      var padding = window_width - agents_width;
      $('#inner_scroll_window').width(agents_width + 150);
      $('#inner_scroll_window').css('padding-top', '10px');
      $('#inner_scroll_window').css('padding-left', padding/2 - 20);
    }
    else {
      // var pixels = $('#agents .agent').length * 80 + 200;
      $('#inner_scroll_window').width(agents_width + 40);
      $('#inner_scroll_window').css('padding-top', '2px');
      $('#inner_scroll_window').css('padding-left', '5px');
    }
  }

};
