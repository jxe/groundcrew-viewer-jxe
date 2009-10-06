Notifier = {
  
  did_add_new_event: function(ev) {
    Event.improve(ev);
    // we only notify on items that are latched to us.
    if (!ev.re || ev.re.resource().architect != This.user.tag) return;
    
    // don't report if we're watching the thing
    if (ev.re == This.item) return;

    if (ev.atype == 'report')      alert( ev.actor_title + " reports: [["+ ev.msg +"]]" );
    if (ev.atype == 'accepted')    alert( ev.actor_title + " has accepted your assignment" );
    if (ev.atype == 'declined')    alert( ev.actor_title + " has declined your assignment" );
    if (ev.atype == 'completed')   alert( ev.actor_title + " has completed your assignment" );
    if (ev.atype == 'appreciated') alert( ev.actor_title + " has appreciated you" );
    if (ev.atype == 'blocked')     alert( ev.actor_title + " has blocked you" );
  }
  
};
