Notifier = {

  did_add_new_event: function(ev) {
    Event.improve(ev);
    var go = ev.item_tag;
    // we only notify on items that are latched to us.  TODO: turn back on
    // if (!ev.re || ev.re.resource().architect != This.user.tag) return;

    if (ev.atype == 'error')        Notifier.error( ev.msg, go, ev.actor_title );
    if (ev.atype == 'warning')      Notifier.warning( ev.msg, go, ev.actor_title );

    // don't report if we're watching the thing
    if (ev.re == This.item || This.tool == 'view_events') return;

    if (ev.atype == 'signup')       Notifier.growl( go, ev.actor_title + " signed up!" );
    if (ev.atype == 'reported')     Notifier.growl( go, ev.actor_title + " reports: &ldquo;"+ ev.msg   +"&rdquo;" );
    if (ev.atype == 'answered')     Notifier.growl( go, ev.actor_title + " responded: &ldquo;"+ ev.msg +"&rdquo;" );
    if (ev.atype == 'answered_yes') Notifier.growl( go, ev.actor_title + " answered yes" );
    if (ev.atype == 'answered_no')  Notifier.growl( go, ev.actor_title + " answered no" );
    if (ev.atype == 'accepted')     Notifier.growl( go, ev.actor_title + " has accepted your assignment" );
    if (ev.atype == 'declined')     Notifier.growl( go, ev.actor_title + " has declined your assignment" );
    if (ev.atype == 'completed')    Notifier.growl( go, ev.actor_title + " has completed your assignment" );
    if (ev.atype == 'appreciated')  Notifier.growl( go, ev.actor_title + " has appreciated you" );
    if (ev.atype == 'blocked')      Notifier.growl( go, ev.actor_title + " has blocked you" );
    if (ev.atype == 'note')         Notifier.growl( ev.re || go, ev.actor_title + " commented: &ldquo;"+ ev.msg   +"&rdquo;" );
    if (ev.atype == 'chat' && This.tool != 'chat') {
      Notifier.growl( "#tool=chat", ev.actor_title + ": &ldquo;"+ ev.msg +"&rdquo;" );
    }
  },

  success: function(msg, header) {
    if (!header) header = 'Sent';
    Notifier.growl(null, msg, {
      header: header,
      life: 10*1000,
      glue: 'before',
      theme: 'success'
    });
  },

  error: function(msg, go, actor) {
    header = actor ? 'Error for ' + actor : 'Error';
    Notifier.growl(go, msg, {
      header: header,
      life: 25*1000,
      glue: 'before',
      theme: 'error'
    });
  },

  warning: function(msg, go, actor) {
    header = actor ? 'Warning for ' + actor : 'Warning';
    Notifier.growl(go, msg, {
      header: header,
      life: 25*1000,
      glue: 'before',
      theme: 'warning'
    });
  },

  growl_defaults: {
    life: 15*1000,
    open: function(e,m,o){ $(e).app_paint(); }
  },

  growl: function(go, msg, options){
    options = $.extend({}, this.growl_defaults, options);
    if (go && go.charAt(0) != '#' && go.charAt(0) != '@') go = "#@" + go;
    if (go) msg = "<a href='"+go+"'>"+msg+"</a>";
    $.jGrowl(msg, options);
  }

};
