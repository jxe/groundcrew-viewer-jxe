Clicker = {
  click: function(a, parent) {
    if (a.stopPropagation) a = this;
    a = $(a);
    
    var href = a.attr('href');
    if (href.length > 1) return Viewer.go(href.slice(1));

    var item = a.attr('item');
    
    if (item) return Viewer.open(item);

    var action, newstatus;
    if (newstatus = a.attr('newstatus')) {
      Ajax.fetch('/agent/update', { availability: newstatus }, Agents.add_or_update);    
    } else if (action = a.attr('action')) {
      if (action.indexOf('.') >= 0) {
        return eval(action)();
      } else {
        return Viewer[action]();
      }
    } else if (false) {
      if (a.hasClass('clear_readyness')) {
        SelfAgent.clear_ready(goal);
        City.recalc_city();
        return;
      }
      if (a.hasClass('join_readyness')) {
        Ajax.fetch('/agent/update', {readyto: goal}, function(x){
          Agents.add_or_update(x);
          City.recalc_city();
        });
        return;
      }
    }
    alert('no clicker defined!');
  },
  
  
  // i kissed a girl, and i liked it
  submit: function(data) {
    if (data.readyto) {
      Ajax.fetch('/agent/update', {readyto: data.readyto}, function(x){
        Agents.add_or_update(x);
        City.recalc_city();
      });
    }
    if (data.newloc) {
      Ajax.fetch('/agent/update', {location: data.newloc}, Agents.add_or_update);    
    }
    if (data.assign) {
      if (!logged_in) return Viewer.join_please();
      Ajax.fetch('/agent/contact', {
        new_state: 'assigned',
        msg: data.assign,
        item: MapMarkers.iw_item.item_tag,
        topic: Viewer.apps.mobilize.state.atag
      }, EventDb.add);
    }
    if (data.instr) {
      Ajax.fetch('/gc/invite', {
        topic: Viewer.apps.mobilize.state.atag,
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
