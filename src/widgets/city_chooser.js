/*
  This is a HUD that floats in the center and lets you pick a city!
*/
CityChooser = {
  
  wire: function() {
    NQueue.receivers.push(CityChooser);
  },
  
  did_change_selected_city: function() {
    if (Viewer.selected_city) {
      $('#city_chooser').hide();
      return;
    }
    
    var agents_by_city = ItemDb.agents_by_city;
    var cities_by_num_agents = $keys(agents_by_city).sort_by(function(x){ 
      // sort by number of agents first, then the city name
      return [0-agents_by_city[x].length, cities[x]]; 
    });
    var more_cities;
    if (cities_by_num_agents.length > 10) {
      more_cities = cities_by_num_agents.slice(11);
      cities_by_num_agents = cities_by_num_agents.slice(0, 10);
    }
    
    var html = '<b>Choose a city:</b><ul>';
    
    $.each(cities_by_num_agents, function(){
      var city_id = this;      
      var city_name = cities[city_id];
      var num_agents = agents_by_city[city_id].length;
      
      html += "<li><a city_id='"+city_id+"' href='#'>"+city_name+"</a> "
            + "has "+num_agents+" agents ready.</li>";
    });
    
    if (more_cities) {
      html += "<li>There are also agents in ";
      var city_words = [];
      $.each(more_cities, function(){
        var city_id = this;      
        var city_name = cities[city_id];
        city_words.push("<a city_id='"+city_id+"' href='#'>"+city_name+"</a>");
      });
      html += english_list(city_words) + "</li>";
    };
    
    html += "</ul>";
    
    $('#city_chooser').html(html).center().fadeIn().find('a').click(function(){
      var city_id = $(this).attr('city_id');
      Viewer.open(city_id);
      return false;
    });
  }
      
};
