Notifier = {
  
  did_add_new_event: function(ev) {
    Event.improve(ev);
    // we only notify on items that are latched to us.
    if (!ev.re || ev.re.resource().architect != This.user.tag) return;
    
    // don't report if we're watching the thing
    if (ev.re == This.item) return;
    
    if (ev.atype == 'report')      $.jGrowl( ev.actor_title + " reports: [["+ ev.msg +"]]" );
    if (ev.atype == 'responded')   $.jGrowl( ev.actor_title + " responded: [["+ ev.msg +"]]" );
    if (ev.atype == 'responded_yes')   $.jGrowl( ev.actor_title + " responded: [["+ ev.msg +"]]" );
    if (ev.atype == 'responded_no')   $.jGrowl( ev.actor_title + " responded: [["+ ev.msg +"]]" );
    if (ev.atype == 'accepted')    $.jGrowl( ev.actor_title + " has accepted your assignment" );
    if (ev.atype == 'declined')    $.jGrowl( ev.actor_title + " has declined your assignment" );
    if (ev.atype == 'completed')   $.jGrowl( ev.actor_title + " has completed your assignment" );
    if (ev.atype == 'appreciated') $.jGrowl( ev.actor_title + " has appreciated you" );
    if (ev.atype == 'blocked')     $.jGrowl( ev.actor_title + " has blocked you" );
  }
  
};
