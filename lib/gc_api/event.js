Event = {
  
  post: function(data, callback) {
    if (demo) { x = Demo.post_event(data); return callback && callback(x); }
    return $.post_with_squad("/event", data, function(result){
      x = eval(result);
      callback && callback(x);
    });
  },

  improve: function(ev) {
    ev.when = $time_and_or_date(ev.created_at);
    ev.color = Event.color(ev);
    ev.item = ev.item || (ev.item_tag && ev.item_tag.resource());
    ev.item_title = ev.item_title || ev.item && ev.item.title;
    ev.landmark = ev.landmark_tag && ev.landmark_tag.resource();
    ev.landmark_title = ev.landmark && ev.landmark.title;
    if (ev.re) {
      try {
        var op = ev.re.resource();
        ev.opname = op && op.title;        
      } catch(e) {
        go.err('error during ev.re.resource() for ev ' + ev, e);
      }
    }
    try { ev.actor = ev.actor_tag && ev.actor_tag.resource(); } catch(e) {
      go.err('error during ev.actor_tag.resource() for ev ' + ev, e);
    }
    ev.actor_title = ev.actor_title || (ev.actor && ev.actor.title) ||
                     ev.actor_name  || ev.item_title || 'UnknownUser';

    ev.what = (Event.whats[ev.atype] || "#{atype}").t(ev);
    return ev;
  },

  color: function(ev){
    if (ev.atype == 'wish') return "blue";
    if ($w('viewer').indexOf(ev.atype) >= 0) return "invisible";
    if ($w('available enlist unenlist off signup').indexOf(ev.atype) >= 0) return "grey";
    if ($w('said').indexOf(ev.atype) >= 0) return "black";
    if ($w('assigned msg pm').indexOf(ev.atype) >= 0) return "purple";
    return "green";
  },

  whats: {

    chat: ": #{msg}",
    note: "commented: #{msg}",

    // initiatives
    citywish:
      "where <span class='wish'>#{msg}</span>",
    requested:
      "activated agent <a href='#@#{item_tag}'>#{item_title}</a>",
    wish:
      "wished <span class='wish'>to #{msg}</span>",
    new_landmark:
      "created a <a href='#@#{landmark_tag}'>new landmark</a>: #{item_title}",

    // initiative reports
    dead:       "is no longer available",
    invited:    "invited #{msg} to: <span class='report'>#{opname}</span>",
    accepted:   "accepted task: <span class='report'>#{opname}</span>",
    assigned:   "gave an assignment to <a href='#@#{item_tag}'>#{item_title}</a>: <span class='assignment'>#{msg}</span>",
    // accepted:   "accepted the assignment",
    reported:   "reported: <span class='report'>#{msg}</span>",
    photo:      "sent a photo: <img src=\"#{msg}\"/>",
    declined:   "declined the assignment",
    completed:  "completed <span class='report'>#{opname}</span>",
    summon:     "summoned their squad!",
    agree:      "agreed with a wish",


    // others
    msg:
      "sent a message to <a href='#@#{item_tag}'>#{item_name}</a>: <span class='assignment'>#{msg}</span>",
    pm: "sent a private message: <span class='assignment'>#{msg}</span>",
    freed:
      "freed <a href='#@#{item_tag}'>#{item_tag}</a> to do other things",
    enlist:
      "enlisted as part of agent <a href='#@#{item_tag}'>#{item_tag}</a>'s crew",
    unenlist: 
      "removed themselves from agent <a href='#@#{item_tag}'>#{item_tag}</a>'s crew",
    import_completed: "import completed: #{msg}",
    error: "error: <span class='error'>#{msg}</span>",
    warning: "<span class='warning'>#{msg}</span>",

    // signup reports
    email_invited: "sent an email invite to #{msg}",
    email_confirmed: "accepted an invitation",
    mobile_contacted: "was contacted via SMS",
    signup:     "signed up!",

    login:      "logged in",
    unlatched:  "is now free to be organized",
    off:        "is gone",
    summonable: "is now summonable",
    no_response:  "did not respond",
    viewer:     "is viewing the map",
    answered:     "answered \"<span class='assignment'>#{msg}</span>\"",
    answered_yes:     "answered yes",
    answered_no:     "answered no",
    available:  "became available",
    free:       "is free again",
    extended:   "extended their time available",
    relocated:  "reported a new location",
    shout:      "shouted: <span class='shout'>#{msg}</span>"
  }

};
