go.push({
  
  city_name: function() {
    return cities[This.city_id] || 'Worldwide';
  },
  
  cities_dropdown: function() {  
    var agents_by_city = Agents.find('=city_id');
    var cities_by_num_agents = $keys(agents_by_city).sort_by(function(x){ 
      return -agents_by_city[x].length;
      // sort by number of agents first, then the city name
      // return [0-agents_by_city[x].length, cities[x]]; 
    });
    
    var html = '';
    
    $.each(cities_by_num_agents, function(){
      var city_id = this;      
      var city_name = cities[city_id];
      var num_agents = agents_by_city[city_id].length;
      
      html += "<dl href='#@City__"+city_id+"'><dt>"+city_name+"</dt>"
            + "<dd>has "+num_agents+" agents ready</dd></dl>";
    });
    return html;
  }
  
  
});
