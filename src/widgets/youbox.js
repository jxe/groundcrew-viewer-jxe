Youbox = {
  
  init: function() {
    $('#you_img').attr('src', person_item.thumb_url);
    $('#agent_name').html(person_item.title);
    $('#you_img, #youbox_agent').click(function(){ Viewer.open(person_item); return false; });
  }
  
  
};