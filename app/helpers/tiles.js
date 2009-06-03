Tiles = {
  
  agent_tile: '\
  <div class="tile" href="#@#{id}">\
    <img src="http://groundcrew.us#{thumb_url}"/>\
    #{title}<b>has</b>#{time_avail}\
  </div>',

  agent_upfor_tile: '\
  <div class="tile" href="#@#{id}">\
    <img src="http://groundcrew.us#{thumb_url}"/>\
    <b>up for</b>#{wants}<b>has</b>#{time_avail}\
  </div>',

  op_tile: '\
  <div class="tile" href="#@#{id}">\
    <img src="#{thumb_url}"/>\
    #{title}\
  </div>',

  place_tile: '\
  <div class="tile" href="#@#{id}">\
    <img src="#{thumb_url}"/>\
    #{title}\
  </div>',

  adventure_tile: '\
  <div class="tile" href="#@#{id}">\
    <img src="#{thumb}"/>\
    #{what}<b>at</b>#{where}\
  </div>',
    
  proj_tile: '\
  <div class="tile2">\
    #{what}\
    <p><b>submitted by</b>#{who}</p>\
  </div>'

  // resource_t: '<div><img src=""/><b>#{what}</b></div>',
   
};
