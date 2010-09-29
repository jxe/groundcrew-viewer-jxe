Notifier = {
  
  did_add_new_event: function(ev) {
    // Don't notify events unless app is now looking for changes (as opposed to loading initial state)
    if (!Resource.handle_changes) return;

    Event.improve(ev);
    var go = ev.item_tag;
    // we only notify on items that are latched to us.  TODO: turn back on
    // if (!ev.re || ev.re.resource().architect != This.user.tag) return;

    if (ev.atype == 'error')        Notifier.error( ev.msg, go, ev.actor_title );
    if (ev.atype == 'warning')      Notifier.warning( ev.msg, go, ev.actor_title );

    // don't report if we're watching the thing
    if (ev.re == This.item || This.tool == 'view_activity') return;

    if (ev.atype == 'signup')       Notifier.growl(ev.actor_title + " signed up!", go);
    if (ev.atype == 'reported')     Notifier.growl(ev.actor_title + " reports: &ldquo;" + ev.msg + "&rdquo;", go);
    if (ev.atype == 'pm')           Notifier.growl(ev.actor_title + " sent a private message: &ldquo;" + ev.msg + "&rdquo;", go);
    if (ev.atype == 'answered')     Notifier.growl(ev.actor_title + " answered: &ldquo;" + ev.msg + "&rdquo;", go);
    if (ev.atype == 'accepted')     Notifier.growl(ev.actor_title + " has accepted your assignment", go);
    if (ev.atype == 'declined')     Notifier.growl(ev.actor_title + " has declined your assignment", go);
    if (ev.atype == 'completed')    Notifier.growl(ev.actor_title + " has completed your assignment", go);
    if (ev.atype == 'appreciated')  Notifier.growl(ev.actor_title + " has appreciated you", go);
    if (ev.atype == 'blocked')      Notifier.growl(ev.actor_title + " has blocked you", go);
    if (ev.atype == 'note')         Notifier.growl(ev.actor_title + " commented: &ldquo;" + ev.msg +"&rdquo;", ev.re || go);
    if (ev.atype == 'chat' && This.tool != 'chat') {
      Notifier.growl(ev.actor_title + ": &ldquo;"+ ev.msg +"&rdquo;", "#tool=chat" );
    }
  },

  success: function(msg, header) {
    if (!header) header = 'Sent';
    Notifier.growl(msg, null, {
      header: header,
      life: 10*1000,
      glue: 'before',
      theme: 'success'
    });
  },

  error: function(msg, go, actor) {
    var header = actor ? 'Error for ' + actor : 'Error';
    Notifier.growl(msg, go, {
      header: header,
      life: 25*1000,
      glue: 'before',
      theme: 'error'
    });
  },

  warning: function(msg, go, actor) {
    var header = actor ? 'Warning for ' + actor : 'Warning';
    Notifier.growl(msg, go, {
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

  growl: function(msg, go, options){
    options = $.extend({}, this.growl_defaults, options);
    if (go && go.charAt(0) != '#' && go.charAt(0) != '@') go = "#@" + go;
    if (go) msg = "<a href='"+go+"'>"+msg+"</a>";
    $.jGrowl(msg, options);
  }

};
