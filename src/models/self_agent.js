SelfAgent = {

  clear_ready: function(goal) {
    Ajax.fetch('/agent/readyto_clear', {readyto:goal}, function(x){
      ItemDb.add_or_update(x);
      City.recalc_city();
    });
  },
  
  clear_topready: function() {
    Ajax.fetch('/agent/readyto_clear', {}, function(x){
      ItemDb.add_or_update(x);
      City.recalc_city();
    });
  }

};
