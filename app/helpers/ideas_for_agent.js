Popularities = {
  "some quiet time": 10,
  "a chance to roll down a hill": 10,
  "a strange event involving humming": 10,
  "some collaborative sculpture making": 20,
  "a high five": 10,
  "an adventure involving skipping": 20,
  "a song exchange": 20
};


IdeaUtils = {
  
  judge_ideas_for_item: function() {
    var agent = This.item.resource();
    var agent_atags = agent.upfor.split(' ').to_h();
    Gamebook = $values(Gamebook);
    $.each(Gamebook, function(){
      var idea = this;
      idea.atag_arr = idea.provides.split(' ');
      idea.atag_arr_this_guy = idea.atag_arr.grep(agent_atags);
      idea.toptag = idea.atag_arr_this_guy[0];
      idea.score = 0 - idea.atag_arr_this_guy.length;
      idea.sort_score = idea.score + Popularities[idea.name];
    });
  },
  
  winning_ideas_for_item: function() {
    IdeaUtils.judge_ideas_for_item();
    return Gamebook.grep(function(x){ return x.score != 0; }).sort_by('.sort_score');
  }
  
};



HTML = {
  
  dog: function(label) {
    return tag('span.dog', { content: label[0].toUpperCase(), style: "background-color:" + label.to_color(), title: label });
  },
  
  spinner: function(reveal_what) {
    return tag('img.spin', { src: 'i/dblarr.png', reveal: reveal_what + " #iw_menu_place spinner"});
  }
  
};



LiveHTML.widgets.push({
  
  ideas_for_agent: function(){
    var categories = [];
    var ideas_by_category = {};
    
    // populate categories & ideas_by_category
    $.each(IdeaUtils.winning_ideas_for_item(), function(){
      var idea = this;
      var label = idea.atag_arr_this_guy.grep(categories.to_h())[0];
      if (label) {
        ideas_by_category[label].push(idea);
      } else {
        categories.push(idea.toptag);
        ideas_by_category[idea.toptag] = [idea];
      }
    });

    // gather selectable ideas
    var selectable_ideas = tag('div.select_one agent_ideas', {
      content: categories.map(function(category){
        var ideas = ideas_by_category[category];
        var idea = ideas[0];
        if (ideas.length > 1) {
          return tag('div.agent_idea selectable', HTML.dog(category) + 
            tag('span', {id:category + "_item", content: idea.name}) + 
            HTML.spinner(category + '_other_ideas'));
        } else {
          return tag('div.agent_idea selectable', HTML.dog(category) + idea.name);
        }
      }).join('')
    });
    
    // gather menus
    var hidden_menus = tag('div.hidden', categories.map(function(category){
      if (ideas_by_category[category].length < 2) return '';
      return tag('div.menu', {
        id: category+"_other_ideas", 
        content: ideas_by_category[category].map(function(x){ 
          return tag('div', {content: x.name, set: category+"_item"}); 
        }).join('')
      });
    }).join(''));
    
    // emit html
    return selectable_ideas + hidden_menus;
  }

});
