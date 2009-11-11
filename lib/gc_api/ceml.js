CEML = {
  
  sanitize: function(msg) {
    return msg.replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, ' ');
  },

  script_for: function(kind, msg) {
    if (kind == "mission")  return "\""+CEML.sanitize(msg)+"\"";
    if (kind == "question") return "ask agents: "+msg;
    if (kind == "msg")      return "tell agents: "+msg;
    throw 'unrecognized CEML script kind: ' + kind;
  },
  
  script_for_invite: function(mission, msg) {
    mission = CEML.sanitize(mission);
    if (!msg || msg.length == 0) return "\""+mission+"\"";
    return "\""+mission+"\"\ntell agents: "+msg;
  }
  
};
