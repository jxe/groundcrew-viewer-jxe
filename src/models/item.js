function atag_desc(atag) { return atag_descs[atag] || atag; }

Item = {
  
  calculate_fields: function(item) {
    if (!item.status) item.status = 'off';
    for (var i in Item.calculated_fields){
      item[i] = Item.calculated_fields[i](item);
    }
    if (!item.for_atag && item.status != 'busy') {
      Item.atag_links(item);
      item.up_for = $T('<b class="tinysmall">up for:</b> #{atag_links_top5}...', item);
    } else {
      item.up_for = '';
    }
  },

  atag_links: function(a) {
    var atags = a.atags.split(' ');
    var atag_links = [];
    for (var i=0; i < atags.length; i++) {
      if (atags[i].indexOf('/') >= 0)
        atag_links.push(atag_desc(atags[i]));
    };
    
    a.atag_links_top5 = atag_links.slice(0, 5).join(', ');      
    return atag_links;
  },
  
  summon_options: function(a) {
    var tags = a.atags.split(' ');
    var html = '';
    $.each(tags.index_by(/^(.*)\//), function(k, v){
      html += $T("<optgroup label='#{desc}'>", {desc: atag_desc(k.slice(0, -1))});
      $.each(v, function(){
        html += $T("<option value='#{atag}'>#{desc}</option>", {atag: this, desc: atag_desc(this)});
      });
      html += "</optgroup>";
    });
    return html;
  },
  
  calculated_fields: {
    
    upfor: function(a) {
      if (!a.atags) return 'nothing';
      var atags = a.atags.split(' ').sort(function(a, b){ return Math.random() > 0.5 ? 1 : -1; }).slice(0, 5);
      var html = '';
      for (var i=0; i < atags.length; i++) {
        html += "<li>&bull; " + atag_desc(atags[i]) + "</li>";
      };
      return html;
    },
        
    locked: function(a) {
      if (!a.latched_by) return false;
      if (a.latched_by.split(' ').indexOf(agent_tag) >= 0) return false;
      return true;
    },
    
    mystatus: function(a) {
      // You...
      if (a.status == 'off') return "'re <b>summonable</b>";
      if (a.status == 'available') return "'re <b>available</b>";
      if (a.status == 'busy') return "'re <b>currently assigned</b>";
      if (a.status == 'dead') return " <b>will not receive assignments</b>";
      return a.status;
    },
    
    dotimg: function(a) {
      var dot;
      if (a.status == 'available') dot = 'green';
      if (a.status == 'dead')      dot = 'red';
      if (a.status == 'off')       dot = 'yellow';
      if (a.status == 'busy')      dot = 'green';
      return "i/" + dot  + "dot.png";
    },
    
    map_icon: function(a) {
      if (a.item_tag == agent_tag) return 'sman';
      if (a.highlighted) return 'hman';
      if (a.pgoal) return 'rgman';
      return 'wman';
    },    
    
    color: function(a) {
      if (a.item_tag == agent_tag) return 'me';
      if (a.highlighted) return 'yellow';
      if (a.status == 'busy') return 'brown';
      if (a.status == 'unavailable') return 'gray';
      if (a.status == 'available') return 'ninja';
      if (a.byline && a.byline.search(/^wish/) >= 0) return 'wish';
      return 'black';
    },
          
    thumb_url: function(a) {
      if (a.thumb_url) return a.thumb_url;
      return 'i/agent-smith.jpg';
    },
    
    atag_h: function(a) {
      var h = {};
      $.each(a.atags.split(' '), function(){ h[this] = true; });
      return h;
    },
          
    byline2: function(a){
      if (a.byline) return a.byline;
      if (a.pgoal) return "wish: " + a.pgoal;
      return 'last active 2 days ago';
    },

    looking_for: function(a) {
      var x = a.pgoal;
      if (!x) return atag_desc(a.atags.split(' ')[0]).toLowerCase();
      if (x[0] == '#') return atag_desc(x.slice(1)).toLowerCase();
      return x;
    },
    
    byline3: function(a){
      if (a.status == "available"){
          if (a.byline && a.byline.search(/^wish/) >= 0) return 'WISHING';
          if (a.byline && a.byline == "Awaiting assignment") return "ready";
          if (a.byline) return a.byline;
          return "ready";
      }
      if (a.status == "busy") return "ASSIGNED";
      return "summonable";
    },
    
    blurb: function(a) {
      if (a.status == 'available' && a.available_until) 
        return "+" + $from_now(a.available_until) + " &nbsp; ";
      return '&nbsp;';
    },
    
    person_id: function(a) {
      return a.item_tag.split('__')[1];
    },
    
    item: function(a) {
      return a.item_tag;
    }
          
  }
  
};
