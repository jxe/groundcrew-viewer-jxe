Event = {

  improve: function(a) {
    a.when = $time(a.created_at);
    a.color = Event.color(a);
    a.what = (Event.whats[a.atype] || "did something weird (#{atype})").t(a);
    a.item_title = a.item && a.item.title;
    a.landmark = a.landmark_tag && a.landmark_tag.resource();
    a.landmark_title = a.landmark && a.landmark.title;
    if (a.actor_tag) a.actor_name = a.actor_tag.resource().title;
    return a;
  },
  
  color: function(a){
    if (a.atype == 'wish') return "blue";
    if ($w('viewer').indexOf(a.atype) >= 0) return "invisible";
    if ($w('available enlist unenlist off signup').indexOf(a.atype) >= 0) return "grey";
    if ($w('said').indexOf(a.atype) >= 0) return "black";
    if ($w('assignment msg').indexOf(a.atype) >= 0) return "purple";
    return "green";
  },
  
  whats: {

    // chat
    said: ": #{msg}",

    // initiatives
    citywish: 
      "where <span class='wish'>#{msg}</span>",
    assignment: 
      "gave an assignment to <a href='#' item='#{item_tag}'>#{item_name}</a>: <span class='assignment'>#{msg}</span>",
    invite:
      "invited #{reach} people to <a href='#' item='#{landmark_tag}'>#{landmark_title}</a> for #{msg}",
    requested:  
      "activated agent <a href='#' item='#{item_tag}'>#{item_name}</a>",
    wish:
      "wished <span class='wish'>to #{msg}</span>",
    new_landmark: 
      "created a <a href='#' item='#{landmark_tag}'>new landmark</a>: #{item_title}",

    // initiative reports
    dead:       "is no longer available",
    accepted:   "accepted the assignment",
    report:     "reported: <span class='report'>#{msg}</span>",
    declined:   "declined the assignment",
    completed:  "completed the assignment",
    summon:     "summoned their squad!",
    agree:      "agreed with a wish",


    // others
    msg:
      "sent a message to <a href='#' item='#{item_tag}'>#{item_name}</a>: <span class='assignment'>#{msg}</span>",
    freed: 
      "freed <a href='#' item='#{item_tag}'>#{item_name}</a> to do other things",
    enlist:
      "enlisted as part of agent <a href='#' item='#{item_tag}'>#{item_name}</a>'s crew",
    unenlist:
      "removed themselves from agent <a href='#' item='#{item_tag}'>#{item_name}</a>'s crew",
    login:      "logged in",
    unlatched:  "is now free to be organized",
    off:        "is gone",
    summonable: "is now summonable",
    no_response:  "did not respond",
    signup:     "joined Groundcrew!",
    viewer:     "is viewing the map",
    available:  "became available",
    free:       "is free again",
    extended:   "extended their time available",
    relocated:  "reported a new location",
    shout:      "shouted: <span class='shout'>#{msg}</span>"
  }
  
};
