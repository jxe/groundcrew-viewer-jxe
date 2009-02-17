Notifier = {
  
  did_add_new_event: function(a) {
    // we only notify on items that are latched to us.
    if (!a.item || !a.item.latched_by || $w(a.item.latched_by).indexOf(agent_tag) < 0) return;

    if (a.atype == 'report')      alert( a.actor_title + " reports: [["+ a.msg +"]]" );
    if (a.atype == 'accepted')    alert( a.actor_title + " has accepted your assignment" );
    if (a.atype == 'declined')    alert( a.actor_title + " has declined your assignment" );
    if (a.atype == 'completed')   alert( a.item_title + " has completed your assignment" );
    if (a.atype == 'appreciated') alert( a.actor_title + " has appreciated you" );
    if (a.atype == 'blocked')     alert( a.actor_title + " has blocked you" );
  }
  
};
