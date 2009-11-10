Notifier = {

  did_add_new_event: function(ev) {
    Event.improve(ev);
    // we only notify on items that are latched to us.  TODO: turn back on
    // if (!ev.re || ev.re.resource().architect != This.user.tag) return;

    // don't report if we're watching the thing
    if (ev.re == This.item) return;
    var go = ev.item_tag;

    if (ev.atype == 'signup')       Notifier.growl( go, ev.actor_title + " signed up: &ldquo;"+ ev.msg   +"&rdquo;" );
    if (ev.atype == 'reported')     Notifier.growl( go, ev.actor_title + " reports: &ldquo;"+ ev.msg   +"&rdquo;" );
    if (ev.atype == 'answered')     Notifier.growl( go, ev.actor_title + " responded: &ldquo;"+ ev.msg +"&rdquo;" );
    if (ev.atype == 'answered_yes') Notifier.growl( go, ev.actor_title + " answered yes" );
    if (ev.atype == 'answered_no')  Notifier.growl( go, ev.actor_title + " answered no" );
    if (ev.atype == 'accepted')     Notifier.growl( go, ev.actor_title + " has accepted your assignment" );
    if (ev.atype == 'declined')     Notifier.growl( go, ev.actor_title + " has declined your assignment" );
    if (ev.atype == 'completed')    Notifier.growl( go, ev.actor_title + " has completed your assignment" );
    if (ev.atype == 'appreciated')  Notifier.growl( go, ev.actor_title + " has appreciated you" );
    if (ev.atype == 'blocked')      Notifier.growl( go, ev.actor_title + " has blocked you" );
  },

  growl: function(go, msg, options){
    msg = "<a href='#@"+go+"'>"+msg+"</a>";
    $.jGrowl(msg, {
      life: 15*1000,
      open: function(e,m,o){
        $(e).app_paint();
      }
    });
  }

};
