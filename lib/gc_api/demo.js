
$.extend(String.prototype, {

  change_resource: function(changes) {
    var item = this.resource();
    $.extend(item, changes);
    Resource.add_or_update(this, item);
  }
});

Demo = {

  delay: function(delay_min, delay_rand) {
    if (delay_min == null) delay_min = 1000;
    if (delay_rand == null) delay_rand = Math.rand(2000);
    return delay_min + delay_rand;
  },

  // events

  create_event: function(atype, person, op, changes, json_etc, delay_min, delay_rand) {
    setTimeout(function(){
      var evtag = "Annc__" + Ajax.uuid();
      var now = Date.unix();
      person.change_resource(changes);
      event(evtag, now, atype, person, op.id, null, op.city_id, person, json_etc);
    }, Demo.delay(delay_min, delay_rand));
  },

  // operations

  create_op: function(site, title, atype, body) {
    var optag = "Op__" + Ajax.uuid();
    var city_id = site.resource().city_id;
    op_watch = optag;
    return op(city_id, optag, title, site, This.user.tag, atype, body);
  },

  group_assign_demo: function(agents, what, callback) {
    var op = Demo.create_op(agents[0], "\""+what+"\"", 'assignment group', what);
    callback && callback(op);

    $.each(agents, function(i, agent){
      Demo.create_event('accepted', agent, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag}, 4000, 10000);
    });
  },

  assign_demo: function(person, assignment, callback) {
    var op = Demo.create_op(person, "\""+assignment+"\"", 'assignment individual', assignment);
    callback && callback(op);

    Demo.create_event('accepted', person, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag}, 2000);
    Demo.create_event('completed', person, op, {latch: "unlatched"}, 8000, 7000);
  },

  invite_demo: function(landmark, title, assignment, callback) {
    var op = Demo.create_op(landmark, "\""+title+"\"", 'assignment invite', title);
    callback && callback(op);

    $.each(Agents.in_city(op.city_id).slice(0, 10), function(i, agent){
      Demo.create_event('accepted', agent.id, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag}, 2000, 10000);
    });
  },

  question_demo: function(question, agents) {
    console.log(question + " asked of " + agents);
    var op = Demo.create_op(agents[0], "question: " + question, 'assignment question', question);

    $.each(agents, function(i, agent){
      // setTimeout(function(){
      //   // TODO(NHM):
      // }, 100 + Math.rand(300));

      Demo.create_event('answered', agent, op, {latch: "unlatched"}, {msg: "wow, you're a real cool cat"}), 1000, 500;
    });
  }

};
