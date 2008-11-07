Gatherings = {
  registered: {},
  
  current: function() {
    var lmtag = MapMarkers.iw_item && MapMarkers.iw_item.landmark_tag;
    var rt = false; //current.goal;
    return Gatherings.registered[lmtag + '/' + rt];
  },
  
  state: function() {
    var x = Gatherings.current();
    if (!x) return "potential";
    return "invited";
  },
  
  report: function() {
    var x = Gatherings.current();
    if (!x) return "No one has been summoned yet.";
    return x.reach + " agents have been invited." + (x.responses || '');
  },
  
  invite: function() {
    if (!logged_in) return Viewer.join_please();
    $.facebox($.template('#invite_dialog').blit());
  },
  
  did_add_new_event: function(ev) {
    // console.log('did add event: ' + ev.atype);
    var g;
    if (ev.atype == 'invite') {
      // console.log(ev);
      ev.tag = "Annc__" + ev.id;
      Gatherings.registered[ev.tag] = ev;
      Gatherings.registered[ev.landmark_tag + '/' + ev.topic] = ev;
      g = ev;
    }
    if (ev.parent) {
      g = Gatherings.registered[ev.parent];
      if (!g.events) g.events = [];
      if (!g.responses) g.responses = "<br/>";
      g.events.push(ev);
      g.responses += ev.msg + "<br/>";
    }
    
    // re-open infowindow if it's showing this (or the parent) gathering
    if (g && MapMarkers.iw_item && MapMarkers.iw_item.landmark_tag){
      if (g == Gatherings.current().tag) {
        Viewer.open(g);
      }
    }
  }
  
};
