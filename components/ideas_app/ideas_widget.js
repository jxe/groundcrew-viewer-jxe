// ltypes???
function _idea(tag, rank, type, title, atags, json_etc){
  var parts = tag.split('__');
  Resource.add_or_update($.extend({
    id: parts[1],
    item_tag: tag,
    rank: rank,
    type: type,
    title: title,
    atags: atags
  }, json_etc));
}


_idea('Idea__111', 10, 'meeting',    'some quiet time',          'quiet observation connection peace', {});
_idea('Idea__112', 10, 'rendezvous', 'a high five',              'connection quick inclusion', {});
_idea('Idea__wiz2', 15, 'wizard',     'a group discussion',       'discussion connection debate learning', {});


_idea('Idea__101', 20, 'meeting',    'cleaning a city park',          'volunteering teamwork', {});
_idea('Idea__102', 20, 'meeting',    'hand out flowers to strangers', 'connection kindness teamwork', {});
_idea('Idea__103', 20, 'meeting',    'compliment strangers',          'connection kindness', {});
_idea('Idea__104', 20, 'meeting',    'planting and gardening',        'art volunteering creation dirt peace nature', {});

_idea('Idea__105', 20, 'solo',       'travel without being seen', 'challenge adventure stealth', {});
_idea('Idea__106', 20, 'meeting',    'big dreams',                'discussion connection visions adventure', {});
_idea('Idea__107', 20, 'solo',       'infiltrate a social scene', 'challenge adventure stealth', {});

_idea('Idea__108', 20, 'rendezvous', 'learn a song',             'challenge adventure performance art music connection beauty', {});
_idea('Idea__109', 20, 'meeting',    'group sculpture',          'art connection', {});
_idea('Idea__110', 20, 'meeting',    'knitting circle',          'crafting connection knitting', {});

_idea('Idea__wiz1', 30, 'wizard',     'celebrate ANYTHING',        'celebration fun adventure connection', {});
_idea('Idea__wiz3', 30, 'wizard',     'investigation ANYTHING',    'investigation adventure learning', {});
_idea('Idea__wiz4', 40, 'wizard',     'rendezvous about ANYTHING', 'connection adventure', {});
_idea('Idea__wiz5', 40, 'wizard',     'meet about ANYTHING',       'connection adventure teamwork', {});

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
      var link = tag('a', {href:"#", content:idea.title});
      if (menus[mtag].length > 0) link += menu(mtag, mtag + '_menu');
      return tag('li', link);
    }).join('');
    var div_hidden = '';
    $.each(menus, function(k, v){
      if (v.length == 0) return;
      div_hidden += tag('div.menu', {
        id: k+"_menu", 
        content: v.map(function(x){ return link(x.title, '#'); }).join('')
      });
    });
    return tag('ul.choices', top_choices) + tag('div.hidden', div_hidden);
  }

});
