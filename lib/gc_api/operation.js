var op_watch = null;
function op(city, tag, title, focii, architect, atype, body, x){
  var result = Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    focii: focii,
    architect: architect,
    atype: atype,
    body: body
  }, x);
  if (tag == op_watch) {
    go('@' + tag);
    op_watch = null;
  }
}


Ops = new Resource('Op', {
  enhancer: function(x){
    x.children = [];
    x.site = x.focii && x.focii.split(' ')[0];
    x.thumb_url = x.site && x.site.resource() && x.site.resource().thumb_url;
  }
});


Operation = {

  exec: function(script, players, location, callback) {
    var params = {
      channel: 'noho',
      script:  script,
      items:   players.replace(/Person__/g, '')
    };

    if (test) return alert("CEML exec: " + $.param(params));

    $.get('/api/exec', params, function(optag){
      op_watch = optag;
      Ajax.autoload(callback);
    }, 'text');
  },



  // demo mode stuff

  create: function(site, title, atype, body) {
    var optag = "Op__" + Ajax.uuid();
    var city_id = site.resource().city_id;
    return op(city_id, optag, title, site, This.user.tag, atype, body);
  },

  group_assign_demo: function(agents, what, callback) {
    // console.log(agents);
    var op = Operation.create(agents[0], "\""+what+"\"", 'assignment group', what);
    callback(op);

    $.each(agents, function(i, agent){
      var delay = 4000 + Math.rand(10000);
      setTimeout(function(){
        Event.create('accepted', agent, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag});
      }, delay);
    });
  },

  assign_demo: function(person, assignment, callback) {
    var op = Operation.create(person, "\""+assignment+"\"", 'assignment individual', assignment);
    callback(op);

    setTimeout(function(){
      Event.create('accepted', person, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag});
    }, 3000);

    setTimeout(function(){
      Event.create('completed', person, op, {latch: "unlatched"});
    }, 15000);

  },

  invite_demo: function(landmark, title, assignment, callback) {
    var op = Operation.create(landmark, "\""+title+"\"", 'assignment invite', title);
    callback(op);

    $.each(Agents.in_city(op.city_id).slice(0, 10), function(i, agent){
      var delay = 2000 + Math.rand(10000);
      setTimeout(function(){
        Event.create('accepted', agent.id, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag});
      }, delay);
    });
  }  ,

  question_demo: function(question, agents) {
    var op = Operation.create(agents[0], "question: " + question, 'assignment question', question);

    $.each(agents, function(i, agent){
      var delay = 4000 + Math.rand(10000);
      setTimeout(function(){
        Event.create('accepted', agent, op, {latch: "unlatched"}, {msg: "wow, you're a real cool cat"});
      }, delay);
    });
  }

};
