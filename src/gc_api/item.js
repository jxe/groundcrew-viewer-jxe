Item = {

  atag_trans: {
    conn: 'connection',
    bene: 'kindness',
    food: 'food',
    adv: 'adventures',
    mgames: 'puzzles',
    vol: 'volunteering',
    stretchme: 'challenge',
    stealth: 'stealth',
    pchal: 'challenge',
    pgrowth: 'challenge',
    convo: 'conversation',
    beauty: 'beauty',
    raok: 'kindness'
  },
  
  calculate_fields: function(item) {
    for (var i in Item.calculated_fields)
      item[i] = Item.calculated_fields[i](item);
  },
  
  calculated_fields: {
        
    wants: function(a) {
      var readywords = a.atags.split(' ').map(function(x){ return Item.atag_trans[x]; }).compact();
      if (readywords.length == 0) return "???";
      return readywords.choose_random().toUpperCase();
    },
    
    time_avail: function(a) {
      return ['20 MIN', '1 HR', '5 MIN'].choose_random();
    },
    
    readywords: function(a) {
      return a.atags.split(' ').map(function(x){ return Item.atag_trans[x]; }).compact();
    },
            
    locked: function(a) {
      if (!a.latched_by) return false;
      if (a.latched_by.split(' ').indexOf(CurrentUser.tag) >= 0) return false;
      return true;
    },
    
    map_icon: function(a) {
      if (a.item_tag == CurrentUser.tag) return 'sman';
      if (a.pgoal) return 'rgman';
      return 'wman';
    },    
    
    thumb_url: function(a) {
      if (a.thumb_url) return a.thumb_url;
      return 'i/agent-smith.jpg';
    },
        
    availability_status: function(a){
      if (!a.latch || !a.comm) return null;
      var comm = a.comm.split(' ');
      var latch = a.latch.split(' ');
      if (comm.contains("unreachable")) return "available";
      if (!latch.contains("unlatched")) return "busy";
      if (comm.contains("engaged")) {
        var current_time = Date.unix();
        var comm_time = Number(comm.pop());
        if (current_time - comm_time < 30 * 60) return "ready";
        else return "available";
      }
      if (comm.contains("green")) return "ready";
      return "available";
    }
    
  }
  
};
