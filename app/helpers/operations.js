$.extend(Operation, {
  agent_t: 
    '<div class="agent clearfix">\
      <img href="#@#{id}" class="athumb" src="#{thumb_url}" title="#{title}"/>\
      <div class="text"><a href="#@#{id}">#{title}</a></div>\
    </div>'
});

go.push({
  op_created_ts: function() {
    return This._item.created_ts > 0 ? $time_and_or_date(This._item.created_ts) : 'a while ago';
  },
  op_updated_ts: function() {
    var last_update_ts = Operation.last_update_ts(This._item);
    return last_update_ts > 0 ? $time_and_or_date(last_update_ts) : 'a while ago';
  },
  op_organizer_name: function() {
    return This._item.architect_name;
  },
  op_counts: function() {
    return $pairs(Operation.counts(This.item)).map(function(x){
      var type = x.key;
      if (type == 'reported') type = 'report'.pluralize(x.val);
      return x.val > 0 ? tag('li', tag('span.count', x.val + '') + ' ' + type) : '';
    }).join(' ');
  },
  has_op_counts: function() {
    return $values(Operation.counts(This.item)).any(function(x){ return x > 0; });
  },
  op_roster: function() {
    var agents_grouped = $pairs(Operation.agents(This.item)).group_by('val');
    return $keys(agents_grouped).map(function(state){
      var agent_hashes = agents_grouped[state];
      if (agent_hashes.length < 1) return '';
      var agents = agent_hashes.map(function(h){ return h.key.resource(); }).compact();
      return tag('div.state', tag('h3', state.capitalize()) + Operation.agent_t.tt(agents));
    }).join('');
  },

  message_op_agents_form_submitted: function(data) {
    // get agent id's for all agents who have calc'd states, unless they declined
    var agents = $pairs(Operation.agents(This.item)).grep(function(x){
      return x.val != 'declined';
    }).map('.key');

    if (!agents || agents.length < 1) {
      alert('There are no agents to contact');
      return "redo";
    }
    if (!data.assign) {
      alert('Please provide a message!');
      return "redo";
    }

    if (demo) return Demo.message(agents, data.assign, function(){
      return Notifier.success("Message sent!");
    });

    return Operation.exec(CEML.script_for('msg', data.assign), agents.join(' '), agents.join(' '), function(){
      Notifier.success('Message sent!');
    });
  }
});
