Op_Agents = {

  op_contacts_html: '<!DOCTYPE html><html><head><title>Agent Details</title> \
    <link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/></head> \
    <body class="popup"><h1>Agent Details</h1><h2>#{op_title}</h2> \
    <div class="op_agents">#{op_agents_list}</div></body></html>',

  event_to_item_info: function(metadata, ev) {
    if (!ev.item_tag || !ev.item_tag.resource()) return;
    if (ev.atype == 'note') return;
    if (!metadata[ev.item_tag]) metadata[ev.item_tag] = {};
    var meta = metadata[ev.item_tag];

    meta.id     = meta.id     || ev.item_tag;
    meta.name   = meta.name   || ev.actor_title;
    meta.state  = meta.state  || ev.atype;
    if (ev.atype == 'answered' || ev.atype == 'answered_yes' || ev.atype == 'answered_no') meta.answer = ev.msg;
    if (ev.atype == 'completed' || ev.atype == 'answered' || ev.atype == 'answered_yes' || ev.atype == 'answered_no') meta.state = ev.atype; // completion states overide others
    if (ev.atype == 'reported') {
      if (!meta.reports) meta.reports = [];
      meta.reports.push(ev.msg);
    }

    if (window.current_stream.indexOf('highlandvalley') >= 0) {
      var _item = meta.id.resource();
      var hv_phone_a = _item && _item.answers && _item.answers['What phone number can we provide to the elders you wish to help?'];
      var hv_phone = hv_phone_a && hv_phone_a[0];
      if (hv_phone) meta.m_sysid = hv_phone;
    }
  },

  metadata_to_html: function(metadata) {
    var metadata_grouped = metadata.group_by('state');
    var groups = $keys(metadata_grouped).sort();
    var html = '';
    $.each(groups, function(i, state){
      var group = metadata_grouped[state];
      html += '<div class="op_state_group ' + state + '"><h3 class="op_state">' + state.replace(/_/g, ' ') + '</h3>';

      html += group.map(function(meta) {
        var html = '<div class="agent"><h4 class="name">' + meta.name + '</h4>';
        if (meta.m_sysid) html += '<div class="sysid m"><span class="header">Phone: </span>' + meta.m_sysid + '</div>';
        if (meta.e_sysid) html += '<div class="sysid e"><span class="header">Email: </span>' + meta.e_sysid + '</div>';
        if (meta.answer) html += '<div class="answer"><span class="header">Answer: </span>' + meta.answer + '</div>';
        if (meta.reports) {
          html += '<div class="reports"><span class="header">Reports: </span><ul><li>' +
            meta.reports.join('</li><li>') + '</li></ul></div>';
        }
        return html + '</div>';
      }).join('') + '</div>';
    });
    return html;
  },

  update_op_agents_window: function(win, data) {
    win.document.open();
    win.document.write(Op_Agents.op_contacts_html.t(data));
    win.document.close();
    if (window.focus) win.focus();
  }
};


LiveHTML.widgets.push({

  op_agents_window: function() {
    var op = This.item;
    if (!op) return;

    var win = window.open("", "OperationAgents", ",width=800,height=700,location=0,resizable=1,scrollbars=1");
    var win_data = { op_title: op.resource() && op.resource().title };

    var metadata = {};
    $.each(op_children[op] || [], function(){
      Event.improve(this);
      Op_Agents.event_to_item_info(metadata, this);
    });
    var metadata_a = $values(metadata);
    if (metadata_a.length == 0) {
      win_data.op_agents_list = "No agents have participated.";
      Op_Agents.update_op_agents_window(win, win_data);
      return;
    }

    if (demo || ! (App.stream_role_leader() || App.stream_has_flag('organizer_people_permission'))) {

      if (demo) {
        $.each(metadata_a, function(i, meta) {
          meta.m_sysid = meta.m_sysid || "888 123 4567";
          meta.e_sysid = meta.e_sysid || meta.name + "@" + window.current_stream + ".org";
        });
      }

      win_data.op_agents_list = Op_Agents.metadata_to_html(metadata_a);
      Op_Agents.update_op_agents_window(win, win_data);
      return;
    }

    var ids = metadata_a.map('.id').join(',');
    $.getJSON_with_squad('/people.json?ids=' + ids, function(data){

      $.each(data.results, function(i, item) {
        var meta = metadata[item.id];
        meta.m_sysid = meta.m_sysid || item.phone && item.phone.pretty_m_sysid();
        meta.e_sysid = meta.e_sysid || item.email;
      });

      win_data.op_agents_list = Op_Agents.metadata_to_html(metadata_a);
      Op_Agents.update_op_agents_window(win, win_data);
    });
  }

});
