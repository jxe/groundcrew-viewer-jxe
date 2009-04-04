function menu(label, reveal_id){
  var color = label.to_color();
  return tag('span.minimenu', { 
    reveal: reveal_id + " #iw_menu_place subm", 
    content: label, 
    href: "#", 
    style: "color:" + color + "; border-color:" + color 
  });
}

LiveHTML.widgets.push({

  ideas_for_agent: function(state) {
    var agent = state.item.resource();
    var agent_atags = agent.upfor.split(' ').to_h();
    var menus = {};
    var top_choices = Ideas.all.sort_by(function(idea){
      idea.atag_arr = idea.atags.split(' ');
      idea.atag_arr_this_guy = idea.atag_arr.grep(agent_atags);
      var score = 0 - idea.atag_arr_this_guy.length;
      if (score == 0) return null;
      return score + idea.rank;
    }).map(function(idea){
      if (menus[idea.atag_arr_this_guy[0]]) {
        menus[idea.atag_arr_this_guy[0]].push(idea);
        return;
      }
      var mtag = idea.atag_arr_this_guy.reject(menus)[0];
      menus[mtag] = [];
      return [idea, mtag];
    }).compact().map(function(pair){
      var idea = pair[0];
      var mtag = pair[1];
      var link = link(idea.title, "/ideas/:city/:item/" + idea.item_tag);
      if (menus[mtag].length > 0) link += menu(mtag, mtag + '_menu');
      return tag('li', link);
    }).join('');
    var div_hidden = '';
    $.each(menus, function(k, v){
      if (v.length == 0) return;
      div_hidden += tag('div.menu', {
        id: k+"_menu", 
        content: v.map(function(x){ return link(x.title, "/ideas/:city/:item/" + x.item_tag); }).join('')
      });
    });
    return tag('ul.choices', top_choices) + tag('div.hidden', div_hidden);
  }

});
