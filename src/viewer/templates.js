Templates = {

  agent_thumb: '<img src="http://groundcrew.us/#{thumb_url}" title="#{title}" onclick="Viewer.open(\'#{item_tag}\');"/>',
  
  agent_tile: '\
  <div class="tile" onclick="Viewer.open(\'#{item_tag}\');">\
    <img src="http://groundcrew.us#{thumb_url}"/>\
    <b>up for</b>#{wants}<b>has</b>#{time}\
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

  event:
    '<div class="event #{color}">\
     <span class="time">#{when}</span>\
     <a href="#" item="#{actor_tag}">#{actor_name}</a>\
     #{what}\
     </div>'

}
