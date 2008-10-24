SelfAgent = {

  topready_options: function() {
    if (!person_item.topready) return;
    x = "<a href='#' class='clear_topready q'>clear</a> &nbsp; ";
    var others = City.agents_by_readiness[person_item.topready];
    if (others && others.length >= 2) {
      var agent_tags = others.map('.item_tag').join(' ');
      return x + " " + tag('a.plink.q', {content: 'organize', popper:'#lmark_popup/bc', goal:person_item.topready, agent_tags:agent_tags});
    } else {
      return x + " " + tag('a.go_summary.q', 'find others with similar wishes');
    }
  },
  
  other_readytos: function() {
    var arr = $.grep(person_item.readyto_arr, function(x){ 
      return (x != person_item.topready); 
    });
    if (arr.length < 1) return;
    var elided = false;
    if (arr.length > 7) {
      elided = true;
      arr = arr.slice(0, 5);
    }
    var list = arr.map(function(x){
      return tag('a.join_readyness.gray.b', {goal:x, content:x}) + ' ' + 
        tag('a.clear_readyness.gray.small', {goal:x, content:'(x)'}) + '';
    }).join(', ');
    if (elided) list += " <i>and more..</i>";
    return "<b>Also</b>, you might " + list;
  },
  
  all_readytos: function() {
    var arr = person_item.readyto_arr;
    if (arr.length < 1) return;
    var elided = false;
    if (arr.length > 7) {
      elided = true;
      arr = arr.slice(0, 5);
    }
    var list = arr.map(function(x){
      return tag('a.join_readyness.gray.b', {goal:x, content:x}) + ' ' + 
        tag('a.clear_readyness.gray.small', {goal:x, content:'(x)'}) + '';
    }).join(', ');
    if (elided) list += " ...";
    return list;
  },
  
  clear_ready: function(goal) {
    Ajax.fetch('/agent/readyto_clear', {readyto:goal}, function(x){
      ItemDb.add_or_update(x);
      City.recalc_city();
    });
  },
  
  clear_topready: function() {
    Ajax.fetch('/agent/readyto_clear', {}, function(x){
      ItemDb.add_or_update(x);
      City.recalc_city();
    });
  }

};
