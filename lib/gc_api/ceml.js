CEML = {
  
  script_for: function(kind, msg) {
    if (kind == "mission")  return "\""+msg+"\"";
    if (kind == "question") return "ask agents: "+msg;
    if (kind == "msg")      return "tell agents: "+msg;
    alert('unrecognized kind: ' + kind);
  },
  
  script_for_invite: function(mission, msg) {
    return "\""+mission+"\"\ntell agents: "+msg;
  }
  
};
