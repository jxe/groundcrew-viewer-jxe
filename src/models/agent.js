Agent = {

  wishburger: function() {
    var x = MapMarkers.iw_item;
    if (!x || !x.readyto_arr) return '';
    var topready = x.topready;
    if (!topready) return '';
    return Agent.make_wishburger(topready, x.item_tag == agent_tag);
  },
  
  make_wishburger: function(topready, show_clear) {
    if (!topready) return;
    var x;
    if (!show_clear) x = "&ldquo;to " + topready + "&rdquo;";
    else x = "to " + topready;
    if (show_clear) x += " <a href='#' class='clear_topready tiny'>-clear</a>";
    var others = City.agents_by_readiness[topready];
    if (others && others.length >= 2) {
      var agent_tags = others.map('.item_tag').join(' ');
      return x + " " + tag('a.plink', {content: '-organize', popper:'#lmark_popup/bc', goal:topready, agent_tags:agent_tags});
    } else {
      return x + " " + tag('a.go_summary', '-find others with similar wishes');
    }
  },
  
  status: function() {
    var x = MapMarkers.iw_item;
    var lines = [];
    // if (x.topready) lines.push(tag('div.wishburger', Agent.make_wishburger(x.topready)));
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
  
  options: function() {
    var x = MapMarkers.iw_item;
    var tag;
    if (!logged_in) tag = "lo_" + tag;
    if (x.locked)   tag = tag + "_locked";
    return '';
    // send them to a nearby landmark
    //<a class="medgray plink" popper='#lmark_popup/bc'><b class="nearby_lmarks_ct">x</b> nearby landmarks</a>
    
    // ask a question
  },
  
  assignable: function() {
    var x = MapMarkers.iw_item;
    if (x.locked) return false;
    return true;
  },
  
  free: function() {
    if (!logged_in) return Viewer.join_please();
    Ajax.fetch('/agent/contact', { new_state: 'free', item: MapMarkers.iw_item.item_tag}, EventDb.add);
  }
  
};
