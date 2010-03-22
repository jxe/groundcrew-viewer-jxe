Contacts = {

  qual_sysid: function(pt) {
    if (!pt) return 'unknown';
    if (!pt.stage) return pt.sysid;
    if (pt.stage == 'confirmed') return pt.sysid + " (confirmed)";
    return pt.sysid + " (unconfirmed)";
  },
  
  event_to_item_info: function(metadata, ev) {
    if (!ev.item_tag || !ev.item_tag.resource()) return;
    if (!metadata[ev.item_tag]) metadata[ev.item_tag] = {};
    var meta = metadata[ev.item_tag];
    
    meta.id     = meta.id     || ev.item_tag;
    meta.name   = meta.name   || ev.actor_title;
    meta.state  = meta.state  || ev.atype;
    if (ev.atype == 'answered' || ev.atype == 'answered_yes' || ev.atype == 'answered_no') meta.answer = ev.msg;
    if (ev.atype == 'completed') meta.state = ev.atype; // state overides others
    if (ev.atype == 'reported') {
      if (!meta.reports) meta.reports = [];
      meta.reports.push(ev.msg);
    }
    
    if (window.current_stream == 'highlandvalley') {
      var _item = meta.id.resource();
      var hv_phone_a = _item && _item.answers && _item.answers['What phone number can we provide to the elders you wish to help?'];
      var hv_phone = hv_phone_a && hv_phone_a[0];
      if (hv_phone) meta.m_sysid = hv_phone;
    }
  },
  
  metadata_to_html: function(metadata) {
    var groups = metadata.group_by('state');
    var html = '';
    $.each(groups, function(state, group){
      html += "<h4>" + state + "</h4>";

      html += group.map(function(meta) {
        var html = "<h5>" + meta.name + "</h5>";
        if (meta.m_sysid) html += '<div class="m_sysid">Phone: ' + meta.m_sysid + '</div>'; 
        if (meta.e_sysid) html += '<div class="e_sysid">Email: ' + meta.e_sysid + '</div>';
        if (meta.answer) html += '<div class="answer">Answer: ' + meta.answer + '</div>'; 
        if (meta.reports) {
          html += '<div class="reports">Reports: <ul><li>' + 
            meta.reports.join('</li><li>') + '</li></ul></div>'; 
        }
        return html;
      }).join('');
    });
    return html;
  }
  
};


LiveHTML.widgets.push({
  
  op_title: function() {
    return This.op && This.op.resource() && This.op.resource().title;
  },

  contact_list: function() {
    var op = This.op;
    if (!App.stream_role_organizer()) return "You must be an organizer on this squad to see contact information.";

    var metadata = {};
    $.each(op_children[op] || [], function(){ 
      Event.improve(this);
      Contacts.event_to_item_info(metadata, this);
    });
    var metadata_a = $values(metadata);
    if (metadata_a.length == 0) return "No agents have participated.";
    
    if (demo || !App.stream_role_leader()) return Contacts.metadata_to_html(metadata_a);
    
    var ids = metadata_a.map('.id').join(' ').replace(/Person__/g, '');
    $.getJSON('/api/people.json?ids=' + ids, function(data){
      
      $.each(data.results, function(i, item) {
        var meta = metadata['Person__' + item.id];
        meta.m_sysid = meta.m_sysid || item.phone;
        meta.e_sysid = meta.e_sysid || item.email;
      });
      
      $('.op_contacts_tool div.contacts').html(Contacts.metadata_to_html(metadata_a));
    });
    
    return "loading...";
  }

});
