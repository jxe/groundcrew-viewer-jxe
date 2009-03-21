// adventure
// art
// beauty
// celebrating
// challenge
// connection
// crafting
// creation
// debate
// discussion
// fun
// investigating
// kindness??
// knitting
// learning
// meeting
// music
// nature
// peace
// performance
// rendezvous
// restoration
// stealth
// teamwork
// visions
// volunteering



Item = {

  atags_to_upfors: {
    conn: 'connection',
    // bene: 'kindness',
    // food: 'food',
    art: 'art',
    adv: 'adventure',
    // mgames: 'puzzles',
    vol: 'volunteering',
    stretchme: 'challenge',
    stealth: 'stealth',
    pchal: 'challenge',
    pgrowth: 'challenge',
    convo: 'discussion debate',
    beauty: 'nature quiet',
    // raok: 'kindness',
    cornerfun: 'strangeness'
  },
  
  calculate_fields: function(item) {
    for (var i in Item.calculated_fields)
      item[i] = Item.calculated_fields[i](item);
  },
  
  calculated_fields: {
    
    upfor: function(item) {
      return item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact().uniq().join(' ');
    },
    
    wants: function(item) {
      var readywords = item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact().join(' ').split(' ').uniq();
      if (readywords.length == 0) return "???";
      return readywords.choose_random().toUpperCase();
    },
    
    time_avail: function(item) {
      return ['20 MIN', '1 HR', '5 MIN'].choose_random();
    },
    
    readywords: function(item) {
      return item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact();
    },
            
    locked: function(item) {
      if (!item.latched_by) return false;
      if (item.latched_by.split(' ').indexOf(CurrentUser.tag) >= 0) return false;
      return true;
    },
    
    map_icon: function(item) {
      if (item.item_tag == CurrentUser.tag) return 'sman';
      if (item.pgoal) return 'rgman';
      return 'wman';
    },    
    
    thumb_url: function(item) {
      if (item.thumb_url) return item.thumb_url;
      return 'i/agent-smith.jpg';
    },
        
    availability_status: function(item){
      if (!item.latch || !item.comm) return null;
      var comm = item.comm.split(' ');
      var latch = item.latch.split(' ');
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
