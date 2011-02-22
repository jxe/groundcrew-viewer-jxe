GCLibClient = {

  agent_enhanced: function(agent) {
    Item.calculate_fields(agent);
  },
  
  agent_changed: function(agent) {
    if (This.item == agent.id) {
      This._item = agent;
      App.refresh_itemwindow();
    }
    if (Map.site_exists('agents', agent.id)) {
      if (agent.city_id == This.city_id) Map.site_move('agents', agent.id, agent.lat, agent.lng);
      else Map.site_remove('agents', agent.id);
    } else {
      $('#mapnav').app_paint();
    }
  },
  
  event_changed: function(event) {
    var item = event.item_tag && event.item_tag.resource();
    item && Item.calculate_fields(item);
    Notifier.did_add_new_event(event);
  },

  sms_count: function(sent, received, limit) {
    $('#sms_sent').html(sent);
    $('#sms_received').html(received);
    $('#sms_counter').show();

    if (limit > 0) {
      window.sms_remaining = Math.max(limit - sent - received, 0);
      if (window.sms_remaining < 30) $('#youbox').addClass('warning');
    } else {
      delete window.sms_remaining; // setting to null will cause numeric comparisons to malfunction
    }
  }

};
