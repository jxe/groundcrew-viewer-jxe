Clicker = {
  click: function(a, parent) {
    if (a.stopPropagation) a = $(this);
    a = $(a);
    var item = a.attr('item');
    var agent_tags = a.attr('agent_tags') || (parent && parent.attr('agent_tags'));
    var goal = a.attr('goal') || (parent && parent.attr('goal'));
    
    if (item || agent_tags) {
      if (!goal && !agent_tags) return Viewer.open(item);
      var crew;
      if (goal && !agent_tags) {
        crew = City.agents_by_readiness[goal];
      } else {
        crew = agent_tags.split(' ').map(function(x){ return ItemDb.items[x]; });
      }
      Tour.with_goal(crew, goal, item);
      return;
    }

    var action, newstatus;
    if (newstatus = a.attr('newstatus')) {
      Ajax.fetch('/agent/update', { availability: newstatus }, ItemDb.add_or_update);    
    } else if (action = a.attr('action')) {
      if (action.indexOf('.') >= 0) {
        return eval(action)();
      } else {
        return Viewer[action]();
      }
    } else if (goal) {
      if (a.hasClass('clear_readyness')) {
        return SelfAgent.clear_ready(goal);
      }
      if (a.hasClass('join_readyness')) {
        Ajax.fetch('/agent/update', {readyto: goal}, function(x){
          ItemDb.add_or_update(x);
          City.recalc_city();
        });
      }
    }
    alert('no clicker defined!');
  },
  
  
  // i kissed a girl, and i liked it
  submit: function(form) {
    var data = $(form).form_values();
    if (data.readyto) {
      Ajax.fetch('/agent/update', {readyto: data.readyto}, function(x){
        ItemDb.add_or_update(x);
        City.recalc_city();
      });
    }
    if (data.newloc) {
      Ajax.fetch('/agent/update', {location: data.newloc}, ItemDb.add_or_update);    
    }
    if (data.assign) {
      if (!logged_in) return Viewer.join_please();
      Ajax.fetch('/agent/contact', {
        new_state: 'assigned',
        msg: data.assign,
        item: MapMarkers.iw_item.item_tag,
        topic: Tour.current && Tour.current.goal
      }, EventDb.add);
    }
    if (data.instr) {
      Ajax.fetch('/gc/invite', {
        topic: Tour.cur_readyto(),
        landmark: MapMarkers.iw_item && MapMarkers.iw_item.landmark_tag,
        what: data.action,
        payload: data.instr
      }, function(result){
        $.facebox.close();
        EventDb.new_event(result);
        // Viewer.open(SuggestionIW.latest);
        alert('your invite has been sent!');
      });
      
    }
  }
  
};
