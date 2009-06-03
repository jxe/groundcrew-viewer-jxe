LiveHTML.widgets.push({
  
  city_name: function() {
    return cities[This.city_id] || 'Global view';
  },
  
  cities_menu: function() {
    var agents_by_city = Agents.find('=city_id');
    var cities_by_num_agents = $keys(agents_by_city).sort_by(function(x){ 
      return -agents_by_city[x].length;
    });
    var more_cities;
    if (cities_by_num_agents.length > 10) {
      more_cities = cities_by_num_agents.slice(11);
      cities_by_num_agents = cities_by_num_agents.slice(0, 10);
    }
    
    var html = '';
    
    $.each(cities_by_num_agents, function(){
      var city_id = this;      
      var city_name = cities[city_id];
      var num_agents = agents_by_city[city_id].length;
      
      html += "<div class='mitem'><a href='#@City__"+city_id+"'>"+city_name+"</a> "
            + "has "+num_agents+" agents ready.</div>";
    });
    
    if (more_cities) {
      html += "<div class='mitem'>There are also agents in ";
      var city_words = [];
      $.each(more_cities, function(){
        var city_id = this;      
        var city_name = cities[city_id];
        city_words.push("<a href='#@City__"+city_id+"'>"+city_name+"</a>");
      });
      html += english_list(city_words) + "</div>";
    };
    return html;
  },
  
  
  cities_all: function(state) {  
    var agents_by_city = Agents.find('=city_id');
    var cities_by_num_agents = $keys(agents_by_city).sort_by(function(x){ 
      return -agents_by_city[x].length;
      // sort by number of agents first, then the city name
      // return [0-agents_by_city[x].length, cities[x]]; 
    });
    var more_cities;
    if (cities_by_num_agents.length > 10) {
      more_cities = cities_by_num_agents.slice(11);
      cities_by_num_agents = cities_by_num_agents.slice(0, 10);
    }
    
    var html = '';
    
    $.each(cities_by_num_agents, function(){
      var city_id = this;      
      var city_name = cities[city_id];
      var num_agents = agents_by_city[city_id].length;
      
      html += "<li><a href='#@City__"+city_id+"'>"+city_name+"</a> "
            + "has "+num_agents+" agents ready.</li>";
    });
    
    if (more_cities) {
      html += "<li>There are also agents in ";
      var city_words = [];
      $.each(more_cities, function(){
        var city_id = this;      
        var city_name = cities[city_id];
        city_words.push("<a href='#@City__"+city_id+"'>"+city_name+"</a>");
      });
      html += english_list(city_words) + "</li>";
    };
    return html;
  }
  
});
