Chats = [];
var last_ev_id = null;
var last_ev_at = null;

// event - anything that happened
function event(annc_tag, created_at, atype, actor_tag, re, atags, city_id, item_tag, json_etc){
  annc_tag = annc_tag.replace('Annc__', 'e');
  item_tag = item_tag && item_tag.replace('Person__', '');
  actor_tag = actor_tag && actor_tag.replace('Person__', '');
  re = re && re.replace('Person__', '').replace('Op__', '');
  
  return Anncs.add(annc_tag, {
    annc_tag: annc_tag,
    item_tag: item_tag,
    created_at: created_at,
    atype: atype,
    actor_tag: actor_tag,
    re: re,
    atags: atags,
    city_id: city_id
  }, json_etc);
}

// new style events
function ev(city_id, venture_uuid, item_id, created_at, atype, msg, x){
  x = x || {};
  venture_uuid = venture_uuid && venture_uuid.replace('Op__', '');
  item_id = item_id && item_id.replace('Person__', '');

  var annc_tag = x.uuid || ('e' + venture_uuid + item_id + created_at);
  if (last_ev_id == annc_tag && last_ev_at == created_at) return null;
  last_ev_id = annc_tag;
  last_ev_at = created_at;  
  x['msg'] = msg || x['msg'];
  
  var result = Anncs.add(annc_tag, {
    annc_tag: annc_tag,
    item_tag: item_id,
    created_at: created_at,
    atype: atype,
    actor_tag: item_id,
    re: venture_uuid,
    atags: atype,
    city_id: city_id
  }, x);

  if (atype == "chat" && result) Chats.push(Event.improve(result));
  return result;
}

function rem(who, when, what, oids, msg, title){
  return ev(null, null, who, when, what, msg, { 
    actor_title: title || (who && who.resource() && who.resource().title) || 'Unknown Organizer'
  });
};


Events = Anncs = new Resource('Annc', {

  new_events_are_new: false,

  changed: function(what_changed) {
    $.each(what_changed, function(k, v){
      var item = v.item_tag && v.item_tag.resource();
      item && Item.calculate_fields(item);
      Anncs.new_events_are_new && Notifier.did_add_new_event(v);
    });
    if (Anncs.new_events_are_new) {
      $('#chat_palette').app_paint();
      trigger('did_add_events');
    }
  },

  enhancer: function(event) {
    if (event.re) {
      if (!op_children[event.re]) op_children[event.re] = [];
      op_children[event.re].push(event);
      if (!op_last_child[event.re] || (op_last_child[event.re].created_at || 0) < event.created_at) {
        // ignore note event b/c the organizer probably created it and hence doesn't want the
        // operation to jump to the top of the sorted dropdown
        if (event.atype != 'note') op_last_child[event.re] = event;
      }
    } 
    var item = event.item_tag && event.item_tag.resource();
    item && item.recent_events && item.recent_events.push(event);
  }

});


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
    ev.item_title = ev.item && ev.item.title;
    ev.landmark = ev.landmark_tag && ev.landmark_tag.resource();
    ev.landmark_title = ev.landmark && ev.landmark.title;
    if (ev.re) {
      try {
        var op = ev.re.resource();
        ev.opname = op && op.title;        
      } catch(e) {
        App.report_error('error during ev.re.resource() for ev ' + ev, e);
      }
    }
    ev.actor = ev.actor_tag && ev.actor_tag.resource();
    if (ev.actor) ev.actor_title = ev.actor.title;
    if (!ev.actor_title) ev.actor_title = ev.item_title;
    if (!ev.actor_title) ev.actor_title = 'UnknownUser';

    ev.what = (Event.whats[ev.atype] || "#{atype}").t(ev);
    return ev;
  },

  color: function(ev){
    if (ev.atype == 'wish') return "blue";
    if ($w('viewer').indexOf(ev.atype) >= 0) return "invisible";
    if ($w('available enlist unenlist off signup').indexOf(ev.atype) >= 0) return "grey";
    if ($w('said').indexOf(ev.atype) >= 0) return "black";
    if ($w('assignment msg').indexOf(ev.atype) >= 0) return "purple";
    return "green";
  },

  whats: {

    chat: ": #{msg}",
    note: "commented: #{msg}",

    // initiatives
    citywish:
      "where <span class='wish'>#{msg}</span>",
    assignment:
      "gave an assignment to <a href='#@#{item_tag}'>#{item_title}</a>: <span class='assignment'>#{msg}</span>",
    invite:
      "invited #{reach} people to <a href='#@#{landmark_tag}'>#{landmark_title}</a> for #{msg}",
    requested:
      "activated agent <a href='#@#{item_tag}'>#{item_title}</a>",
    wish:
      "wished <span class='wish'>to #{msg}</span>",
    new_landmark:
      "created a <a href='#@#{landmark_tag}'>new landmark</a>: #{item_title}",

    // initiative reports
    dead:       "is no longer available",
    accepted:   "accepted task: <span class='report'>#{opname}</span>",
    // accepted:   "accepted the assignment",
    reported:   "reported: <span class='report'>#{msg}</span>",
    photo:      "sent a photo: <img src=\"#{msg}\"/>",
    declined:   "declined the assignment",
    completed:  "completed <span class='report'>#{opname}</span>",
    summon:     "summoned their squad!",
    agree:      "agreed with a wish",


    // others
    msg:
      "sent a message to <a href='#@#{item_tag}'>#{item_title}</a>: <span class='assignment'>#{msg}</span>",
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
    answered:     "responded \"<span class='assignment'>#{msg}</span>\"",
    answered_yes:     "answered yes",
    answered_no:     "answered no",
    available:  "became available",
    free:       "is free again",
    extended:   "extended their time available",
    relocated:  "reported a new location",
    shout:      "shouted: <span class='shout'>#{msg}</span>"
  }

};
