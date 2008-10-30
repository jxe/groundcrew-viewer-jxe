/*
  This is a HUD that floats in the center and lets you pick a city!
*/
CityChooser = {
    
  update: function() {  
    var agents_by_city = ItemDb.agents_by_city;
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
      
      html += "<li><a href='#/City__"+city_id+"'>"+city_name+"</a> "
            + "<span>"+num_agents+" agents available</span></li>";
    });
    
    if (more_cities) {
      html += "<li>There are also agents in ";
      var city_words = [];
      $.each(more_cities, function(){
        var city_id = this;      
        var city_name = cities[city_id];
        city_words.push("<a href='#/City__"+city_id+"'>"+city_name+"</a>");
      });
      html += english_list(city_words) + "</li>";
    };
    $('#cities_available').html(html);
    $('#city_chooser').blit();
  }
      
};
