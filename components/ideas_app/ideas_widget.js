// ltypes???
function _idea(tag, label, type, title, atags, json_etc){
  var parts = tag.split('__');
  Resource.add_or_update($.extend({
    id: parts[1],
    item_tag: tag,
    label: label,
    type: type,
    title: title,
    atags: atags
  }, json_etc));
}


_idea('Idea__101', 'restoration',    'meeting',    'cleaning a city park',          'volunteering teamwork', {});
_idea('Idea__102', 'connection',     'meeting',    'hand out flowers to strangers', 'kindness teamwork', {});
_idea('Idea__103', 'connection',     'meeting',    'compliment strangers',          'kindness', {});
_idea('Idea__104', 'creation',       'meeting',    'make peaceful area by planting and gardening', 'volunteering peace nature', {});

_idea('Idea__105', 'challenge',      'solo',       'travel without being seen', 'adventure stealth', {});
_idea('Idea__106', 'discussion',     'meeting',    'big dreams',                'connection visions adventure', {});
_idea('Idea__107', 'challenge',      'solo',       'infiltrate a social scene', 'adventure stealth', {});

_idea('Idea__108',  'challenge',     'rendezvous', 'learn a song',             'adventure performance art music connection beauty', {});
_idea('Idea__109',  'creation',      'meeting',    'group sculpture',          'connection art', {});
_idea('Idea__110',  'creation',      'meeting',    'knitting circle',          'connection crafting knitting', {});


_idea('Idea__wiz1', 'celebration',   'wizard',     'a celebration',            'celebrating fun adventure connection', {});
_idea('Idea__wiz2', 'discussion',    'wizard',     'a group discussion',       'connection debate learning', {});
_idea('Idea__wiz3', 'investigation', 'wizard',     'an on-site investigation', 'investigating adventure learning', {});
_idea('Idea__wiz4', 'rendezvous',    'wizard',     'a new kind of rendezvous', 'connection adventure', {});
_idea('Idea__wiz5', 'meeting',       'wizard',     'a new kind of meeting',    'connection adventure teamwork', {});

function menu(label, reveal_id){
  return tag('a', { reveal: reveal_id + " #iw_menu_place subm", content: label, href: "#" });
}

LiveHTML.widgets.push({

  ideas_for_agent: function(state) {
    var agent = state.item.resource();
    var agent_atags = agent.upfor.split(' ').to_h();
    var winners = Ideas.all.sort_by(function(idea){
      var score = 0;
      if (agent_atags[idea.label]) score -= 10;
      // alert('agent_atags: ' + agent.upfor);
      // alert('idea_atags: ' + idea.atags);
      // alert('overlap: ' + idea.atags.split(' ').grep(agent_atags).join(' '));
      score -= idea.atags.split(' ').grep(agent_atags).length;
      if (score == 0) return null;
      if (idea.type == 'wizard') score += 5;
      return score;
    });
    console.log(winners);
    var by_category = winners.group_by('label');
    var menus = '';
    var entries = winners.map(function(idea){
      var group = by_category[idea.label];
      if (!group) return null;
      if (group.length == 1) {
        if (idea.type == 'wizard') return link("a " + idea.label + "...", "#");
        return link(idea.label + ": " + idea.title, '#');
      }
      menus += tag('div.menu', {
        id: idea.label+"_menu", 
        content: group.map(function(x){ return link(x.title, '#'); }).join('')
      });
      delete by_category[idea.label];
      return menu(idea.label.pluralize() + " &#x25B6;", idea.label + "_menu");
    }).compact();
    var top5 = entries.splice(0, 4).concat([menu("more &#x25B6;", "more_menu")]).map(function(x){
      return "&raquo; " + x + "<br>";
    }).join('');
    menus += tag('div.menu', {id:'more_menu', content:entries.join('')});
    return top5 + tag('div.hidden', menus);
  }
    
});
