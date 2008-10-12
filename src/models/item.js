Item = {
  
  calculate_fields: function(item) {
    if (!item.status) item.status = 'off';
    for (var i in Item.calculated_fields){
      item[i] = Item.calculated_fields[i](item);
    }
    
    if (!item || !item.readyto || !item.readyto[0]) return;
    if ((Date.unix() - item.readyto[0][1]) > 10 * 24 * 60 * 60) return;
    item.topready = item.readyto[0][0];
  },
  
  calculated_fields: {
    
    readyto_arr: function(a) {
      if (a.readyto.replace) a.readyto = json_eval(a.readyto);
      if (a.readyto.map) return a.readyto.map(function(x){ return x[0]; });
      else return [];
    },
    
    qualities_arr: function(a) {
      if (a.qualities) return a.qualities.split(' ');
      else return [];
    },
            
    locked: function(a) {
      if (!a.latched_by) return false;
      if (a.latched_by.split(' ').indexOf(agent_tag) >= 0) return false;
      return true;
    },
    
    mystatus: function(a) {
      // You...
      if (a.status == 'off') return "'re <b>summonable</b>";
      if (a.status == 'available') return "'re <b>available</b>";
      if (a.status == 'busy') return "'re <b>currently assigned</b>";
      if (a.status == 'dead') return " <b>will not receive assignments</b>";
      return a.status;
    },
    
    dotimg: function(a) {
      var dot;
      if (a.status == 'available') dot = 'green';
      if (a.status == 'dead')      dot = 'red';
      if (a.status == 'off')       dot = 'yellow';
      if (a.status == 'busy')      dot = 'green';
      return "i/" + dot  + "dot.png";
    },
    
    map_icon: function(a) {
      if (a.item_tag == agent_tag) return 'sman';
      if (a.highlighted) return 'hman';
      if (a.pgoal) return 'rgman';
      return 'wman';
    },    
    
    color: function(a) {
      if (a.item_tag == agent_tag) return 'me';
      if (a.highlighted) return 'yellow';
      if (a.status == 'busy') return 'brown';
      if (a.status == 'unavailable') return 'gray';
      if (a.status == 'available') return 'ninja';
      if (a.byline && a.byline.search(/^wish/) >= 0) return 'wish';
      return 'black';
    },
          
    thumb_url: function(a) {
      if (a.thumb_url) return a.thumb_url;
      return 'i/agent-smith.jpg';
    },
    
    byline3: function(a){
      if (a.status == "available"){
          if (a.byline && a.byline.search(/^wish/) >= 0) return 'WISHING';
          if (a.byline && a.byline == "Awaiting assignment") return "ready";
          if (a.byline) return a.byline;
          return "ready";
      }
      if (a.status == "busy") return "ASSIGNED";
      return "summonable";
    },
    
    blurb: function(a) {
      if (a.status == 'available' && a.available_until) 
        return "+" + $from_now(a.available_until) + " &nbsp; ";
      return '&nbsp;';
    },
    
    person_id: function(a) {
      return a.item_tag.split('__')[1];
    },
    
    item: function(a) {
      return a.item_tag;
    }
          
  }
  
};
