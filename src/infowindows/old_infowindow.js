function $L(obj, str) {
  return obj[obj[str]] || obj[str];
}

MessageIW = {
  
  asDOMObj: function(x) {
    var tag = x.status;
    if (!logged_in) tag = "lo_" + tag;
    if (x.locked)   tag = tag + "_locked";
    var msg = $L(this.msgs, tag);
    if (!msg) return null;
    x.contents = msg.t(x);
    return $(this.t.t(x))[0];
  },
  
  t: '<div><img class="thumb" src="#{thumb_url}"/>agent <b>#{title}</b><div>#{contents}</div></div>',
  
  msgs: {
    requested:        "activation request sent.  <br/>waiting for agent's response.",
    available_locked: 'this agent had been summoned by someone <br/>else and is awaiting assignment.',
    requested_locked: 'this agent has just been activated by someone else, <br/>and we are waiting to see if they are available',
    lo_available_locked: "available_locked",
    lo_requested_locked: "requested_locked"
  }
  
};
