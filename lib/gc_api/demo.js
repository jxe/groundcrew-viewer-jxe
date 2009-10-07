
$.extend(String.prototype, {

  change_resource: function(changes) {
    var item = this.resource();
    $.extend(item, changes);
    Resource.add_or_update(this, item);
  }
});

Demo = {

  delay: function(delay_min, delay_max) {
    if (delay_min == null) delay_min = 1000;
    if (delay_max == null) delay_max = delay_min * 2;
    return delay_min + Math.rand(delay_max - delay_min);
  },

  update_comm: function(person, i, new_val) {
    var comm_parts = person.resource().comm.split(' ');
    comm_parts[i] = new_val;
    return comm_parts.join(' ');
  },

  offer: function(person, op) {
    setTimeout(function(){

      latch_parts = ["latched", Date.unix() + "-" + (Date.unix() + 60*60), op.id, "joe"];
      person.change_resource({
        latch: latch_parts.join(' '),
        sent: op.title,
        comm: Demo.update_comm(person, 2, Date.unix())});
    }, Demo.delay(50, 250));
  },

  // events

  create_rcv_event: function(atype, person, op, changes, json_etc, delay_min, delay_max) {
    setTimeout(function(){
      var evtag = "Annc__" + Ajax.uuid();
      var now = Date.unix();
      changes["comm"] = Demo.update_comm(person, 1, Date.unix());
      if (changes["msg"] == null) changes["msg"] = "create_rcv_event";
      changes["msg_ts"] = Date.unix();
      person.change_resource(changes);
      event(evtag, now, atype, person, op.id, null, op.city_id, person, json_etc);
    }, Demo.delay(delay_min, delay_max));
  },

  // operations

  create_op: function(site, title, atype, body) {
    var optag = "Op__" + Ajax.uuid();
    var city_id = site.resource().city_id;
    op_watch = optag;
    return op(city_id, optag, title, site, This.user.tag, atype, body);
  },

  assign: function(agents, assignment, callback) {
    var op = Demo.create_op(agents[0], "\""+assignment+"\"", 'assignment', assignment);
    callback && callback(op);

    $.each(agents, function(i, agent){
      Demo.offer(agent, op);
      Demo.create_rcv_event('accepted', agent, op,
        {latch: "latched 1-10000 " + op.id + " " + This.user.tag, msg: "ok"}, null, 10*1000);
      Demo.create_rcv_event('completed', agent, op, {latch: "unlatched", msg: "done"}, null, 3*60*1000);
    });
  },

  invite: function(landmark, title, assignment, callback) {
    var op = Demo.create_op(landmark, "\""+title+"\"", 'assignment invite', title);
    callback && callback(op);

    // TODO: this doesn't replicate radius-based invitations to landmarks
    $.each(Agents.in_city(op.city_id).slice(0, 10), function(i, agent){
      Demo.offer(agent, op);
      Demo.create_rcv_event('accepted', agent.id, op,
        {latch: "latched 1-10000 " + op.id + " " + This.user.tag, msg: "ok"}, null, 10*1000);
      Demo.create_rcv_event('completed', agent.id, op, {latch: "unlatched", msg: "done"}, null, 3*60*1000);
    });
  },

  question: function(question, agents) {
    console.log(question + " asked of " + agents);
    var op = Demo.create_op(agents[0], "question: " + question, 'assignment question', question);

    $.each(agents, function(i, agent){
      Demo.offer(agent, op);
      answer = "I'm answering your question";
      // TODO: clone answers -- this will update the agent's answer dict immediately
      answers = agent.resource().answers;
      answers[question] = [answer, Date.unix() + 3*60*1000];
      Demo.create_rcv_event('answered', agent, op,
        {latch: "unlatched", msg: answer, answers: answers}, {msg: answer},
        null, 3*60*1000);
    });
  }

};
