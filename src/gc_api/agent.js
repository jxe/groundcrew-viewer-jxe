Agent = {
  
  status: function() {
    var x = Viewer.item.resource();
    var lines = [];
    if (x.current_assignment) {
      var free = x.locked && ' ' || "- " + button('free_agent', "free this agent");
      lines.push("<b>Currently assigned</b>: " + x.current_assignment + free);
    }
    if (x.recent_report) lines.push("<b>Recently reported</b>: " + x.recent_report);
    if (x.last_heard_from_at) {
      lines.push(tag('div.smallgray.right', "last active "+ $long_ago(x.last_heard_from_at) + " ago"));
    }
    return lines.join('<br>');
  },
    
  assignable: function() {
    var x = Viewer.item.resource();
    if (x.locked) return false;
    return true;
  },
  
  free: function() {
    if (!logged_in) return Viewer.join_please();
    Ajax.fetch('/agent/contact', { new_state: 'free', item: Viewer.item}, EventDb.add);
  }
  
};
