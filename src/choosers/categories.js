Category = {
  bene: 'Good deeds',
  adv: 'Adventures',
  beauty: 'Meditations',
  conn: 'Parties'
};

Categories = {
  
  update_chooser: function() {
    var city = Viewer.state.city.split('__')[1];
	  var local_agents = ItemDb.agents_by_city[city];
    var counts = rebuzz(local_agents, '.atag_arr').bins;
    $('.categories div').each(function(){
      var div = $(this);
      var href = div.find('a.cat').attr('href');
      if (href) 
        div.find('span').html(pluralize(counts[href.slice(1)].length, 'agent') + " available");
    });
  }

};
