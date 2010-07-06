
AllSubsquads = {
    'oilspill': [
    {
      "id": "btnep",
      "name": "Barataria-Terrebonne National Estuary Program",
      "desc": "Get Direction from the Nat'l Estuary Program.",
      'agents': 100
    },
    {
      "id": "lwf",
      "name": "Louisiana Wildlife Federation",
      "desc": "Get Direction from the LWF.",
      'agents': 100
    },
    {
      "id": "boattech",
      "name": "Boat Technicians",
      "desc": "Help install GPS and tech equipment on boats.",
      'agents': 100
    },
    {
      "id": "swb",
      "name": "Shrimpers Without Borders",
      "desc": "Do you have a shrimp boat we can use?",
      'agents': 100
    },
    {
      "id": "wwlradio",
      "name": "WWL Radio Taskforce",
      "desc": "WWL Radio Listeners",
      'agents': 100
    }
    ]
};

Subsquads = {
  cache: {},
  current: function() {
    return Subsquads.cache[This.subsquad] || function(){
      var bundle = AllSubsquads[current_stream];
      if (!bundle) return {};
      Subsquads.cache = bundle.index_by('id');
      return Subsquads.cache[This.subsquad];
    }();
  },
  
  sidebar_content: function() {
    var subsquads_by_dept = AllSubsquads[current_stream].group_by('dept');
    var my_substreams = (window.posts_to_streams||[]).to_h();
    return $keys(subsquads_by_dept).map(function(dept){
      var subsquads = subsquads_by_dept[dept];
      return subsquads.map(function(subsquad){
          return tag('div.squad', {
            href: "#tool=join_squad;subsquad=" + subsquad.id,
            content: tag('h3', subsquad.name) + 
              tag('div.info', subsquad.agents + " people available &mdash; " + 
              tag('a.join_squad', my_substreams[subsquad.id] ? "you're joined!" : "find out more&hellip;")
            )
          });
        }).join('');
    }).join('');
  }

};


LiveHTML.widgets.push({

  current_subsquad_name: function() { return Subsquads.current().name; },
  current_subsquad_desc: function() { return Subsquads.current().desc; },
  
  current_subsquad_member: function() {
    return ((window.posts_to_streams||[]).contains(This.subsquad));
  }  

});



// return "<h2>Large Organizations</h2><div class='squad'><h3>National Wildlife Fund</h3>" + 
// "<div class='info'>100 people available, 25% utilization</div>"+
// "<a href='#tool=join_squad' class='join_squad'></a></div>"
// ;
