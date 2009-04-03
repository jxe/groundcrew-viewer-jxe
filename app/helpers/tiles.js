Tiles = {
  
  agent_tile: '\
  <div class="tile" onclick="Viewer.open(\'#{item_tag}\');">\
    <img src="http://groundcrew.us#{thumb_url}"/>\
    <b>up for</b>#{wants}<b>has</b>#{time_avail}\
  </div>',

  adventure_tile: '\
  <div class="tile" onclick="Viewer.open(\'#{item_tag}\');">\
    <img src="#{thumb}"/>\
    #{what}<b>at</b>#{where}\
  </div>',
    
  proj_tile: '\
  <div class="tile2">\
    #{what}\
    <p><b>submitted by</b>#{who}</p>\
  </div>',

  // resource_t: '<div><img src=""/><b>#{what}</b></div>',
   
}
