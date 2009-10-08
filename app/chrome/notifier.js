Notifier = {

  did_add_new_event: function(ev) {
    Event.improve(ev);
    // we only notify on items that are latched to us.
    if (!ev.re || ev.re.resource().architect != This.user.tag) return;

    // don't report if we're watching the thing
    if (ev.re == This.item) return;

    if (ev.atype == 'reported')     Notifier.growl( ev.actor_title + " reports: [["+ ev.msg +"]]" );
    if (ev.atype == 'answered')     Notifier.growl( ev.actor_title + " responded: [["+ ev.msg +"]]" );
    if (ev.atype == 'answered_yes') Notifier.growl( ev.actor_title + " responded: [["+ ev.msg +"]]" );
    if (ev.atype == 'answered_no')  Notifier.growl( ev.actor_title + " responded: [["+ ev.msg +"]]" );
    if (ev.atype == 'accepted')     Notifier.growl( ev.actor_title + " has accepted your assignment" );
    if (ev.atype == 'declined')     Notifier.growl( ev.actor_title + " has declined your assignment" );
    if (ev.atype == 'completed')    Notifier.growl( ev.actor_title + " has completed your assignment" );
    if (ev.atype == 'appreciated')  Notifier.growl( ev.actor_title + " has appreciated you" );
    if (ev.atype == 'blocked')      Notifier.growl( ev.actor_title + " has blocked you" );
  },

  growl: function(msg, options){
    $.jGrowl(msg, {life: 15*1000});
  }

};
