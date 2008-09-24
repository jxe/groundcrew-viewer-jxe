// ANNCS HAVE
// :msg, :actor_name, :item_doc, :actor_tag, :item_name, :landmark_doc
// :item_tag, :atype, :actor_id, :atags, :suggestion_tag, :landmark_tag
// :created_at

// - report says things like
//     "13 agents might be up for it"
//     "now asking who will lead"
//     "jerod will lead"
//     "<b>4 agents</b> will participate"

function Initiative(event){ return $.extend(this, event).init(); }

Initiative.createLocal = function(atype, msg, options){
  return new Initiative($.extend({
    id: Ajax.uuid(),
    atype: atype,
    msg: msg,
    actor_tag: agent_tag,
    created_at: Date.unix(),
    actor_name: person_item.title
  }, options || {}));
};

Initiative.valid_atypes = $w('suggestion wish citywish assignment requested invite').to_h();
Initiative.org_atypes = $w('suggestion assignment requested invite').to_h();

Initiative.prototype = {
  
  tag:       function() { return 'Annc__' + this.id; },  
  
  init: function() {
    if (!this.msg) return;  // backend bug
    Initiatives.all[this.tag()] = this;
    this.events = [];
    this.agent_tags = [this.actor_tag];
    this.agreecount = 1;
    if (this.actor_tag == agent_tag) {
      this.i_agree = true;
      if (Initiative.org_atypes[this.atype]) this.mine = true;
    }
    if (this.kudos) {
      var m;
      this.flags = [];
      if (m = this.kudos.match(/squadm (\d+) (\d+)/)) {
        this.agreecount += Number(m[2]);
      }
      if (this.kudos.match(/lame/)) this.flags.push('lame');
      if (this.kudos.match(/awesome/)) this.flags.push('awesome');
    }
    if (!Initiative.org_atypes[this.atype]) this.needs_plan = true;
    if (this.atype == 'invite') {
      this.invited = true;
      this._report = "invitations have been sent out via SMS";
    }
    this.atag = this.atag || this.atags || (this.msg[0] == '#' && this.msg.slice(1));
    NQueue.fire('did_change_initiatives');
    return this;
  },
  
  absorb: function(ev) {
    this.events.push(ev);
    this.agent_tags.push(ev.actor_tag);
    if (ev.atype == 'reviewed') {
      if (ev.msg.match(/pos/)) {
        this.agreecount++;
        if (ev.actor_tag == agent_tag) this.i_agree = true;
      }
      if (ev.msg.match(/lame|awesome/)) {
        if (!this.flags) this.flags = [];
        this.flags.push(ev.msg);
      }
    } else if (ev.actor_tag == agent_tag) {
      this.mine = true;
    }
    if (ev.atype == 'invite') {
      this.invited = true;
      this._report = "invitations have been sent out via SMS";
    }
  },
  
  agents: function() {
    return $.map(this.agent_tags, function(x){ return ItemDb.items[x]; });
  },
  
  time: function() {
    return $time(this.created_at);
  },
  
  town: function() {
    if (this.msg[0] == '#') {
      return atag_desc(this.msg.slice(1)).toLowerCase();
    } else {
      return this.msg;
    }
  },
  
  count: function() {
    return "+" + this.agreecount;
    // html += '<a href="#" item="'+i.actor_tag+'">'+i.actor_name+'</a> ';
    // if (i.agreecount) {
    //   html += "and <b>" + i.agreecount + "</b> other agents want this ";
    // } else {
    //   html += "wants this ";
    // }
    // if (!i.i_agree) html += "(<a href='#' class='smbutton' action='agree'>me too!</a>)";    
  },
  
  you_title: function() {
    if (this.atype == 'suggestion') return "You suggested: <b>" + this.msg + "</b>";
    if (this.atype == 'invite') {
      var lm = LandmarkDb.find_by_tag(this.landmark_tag).title;
      return "You invited: <b>" + this.msg + "</b> at " + lm;
    }
    if (this.atype == 'assignment') return "You assigned someone to: <b>" + this.msg + "</b>";
    if (this.atype == 'requested') return "You activated agent <b>" + this.item.title + "</b>";
    return "you" + this.atype + ": <b>" + this.msg + "</b>";
  },
  
  report: function() {
    return this._report;
  }
  
};

Initiatives = { 
  
  all: {},

  mine: function() {
    return $.grep($values(Initiatives.all), function(x){ return x.mine; });
  },
  
  other_recent: function() {
    // var initiatives = $.grep($values(Initiatives.all), function(x){ return x.msg[0] != '#'; });
    var initiatives = $.grep($values(Initiatives.all), function(x){ return !x.mine; });
    var biggest =      initiatives.sort(function(a, b){ return b.agreecount - a.agreecount; });
    var latest  = biggest.slice(4).sort(function(a, b){ return b.created_at - a.created_at; });
    return biggest.slice(0, 4).concat(latest.slice(0, 3));
  },




  // event handling

  did_change_selected_city: function() {
    // make sure all city items that have wishes are loaded as initiatives
    // if (!Viewer.selected_city) return;
    // var agents = ItemDb.agents_by_city[Viewer.selected_city];
    // $.each(agents, function(){ 
    //   if (this.pgoal) html += '<a href="#" item="'+this.item_tag+'" class="mchoice">'+this.pgoal+'</a>';
    // });
  },

  did_add_new_event: function(ev) {
    var i;
    if (i = Initiatives.all[ev.suggestion_tag]) i.absorb(ev);
    if (Initiative.valid_atypes[ev.atype]) new Initiative(ev);
  }
    
};
