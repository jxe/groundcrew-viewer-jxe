SidebarTags = {};
SidebarTags['oilspill'] = [
  ['What can you help with?', [
    [ 'anything',  'Whatever needs doing', 
      'Be available to any org with a real-world, active use for you re: the oil spill.  '+
      'We\'ll evaluate orgs and exclude any that don\'t make good use of folks.' ],
    [ 'boat',  'Volunteer your Boat', 
      'Any organization that has use for a boat near the gulf will see you on their map.' ],
    [ 'boattech', 'Volunteer your Nautical Tech Skills',
      'Help install GPS and tech equipment on boats' ]
  ]],
  ['Which organizations can you help?', [
    [ 'btnep',  'Barataria-Terrebonne National Estuary Program', 
      'Get Direction from the Nat\'l Estuary Program.' ],
    [ 'lwf',  'Louisiana Wildlife Federation', 
      'Get Direction from the LWF.' ],    
    [ 'swb',  'Shrimpers Without Borders', 
      'Do you have a shrimp boat we can use?' ],
    [ 'wwlradio',  'WWL Radio Taskforce', 
      'for WWL Radio Listeners in Louisiana' ]
  ]]
];


Subsquads = {
  
  sidebar_content: function() {
    var agent = Agents.id(This.user.tag) || This.user;
    var agent_atags = agent.atags.split(' ').to_h();
    var agents_by_tag = Agents.find(':atags');
    return SidebarTags[current_stream].map(function(h2){
      return tag('h2', h2[0]) + h2[1].map(function(entry){
        var me = '';
        if (agent_atags[entry[0]]) { me = "<i>You &rsaquo;</i> "; }
        return tag('div.squad', {
          href: "##toggle_squad?" + entry[0],
          content: tag('h3.hoverable', me + entry[1] + tag('div.hoverbox.east', entry[2])) + 
            tag('div.info.clear', (agents_by_tag[entry[0]]||[]).length + " people available live.")
        });
      }).join('');
    }).join('');
  }

};



// return "<h2>Large Organizations</h2><div class='squad'><h3>National Wildlife Fund</h3>" + 
// "<div class='info'>100 people available, 25% utilization</div>"+
// "<a href='#tool=join_squad' class='join_squad'></a></div>"
// ;
