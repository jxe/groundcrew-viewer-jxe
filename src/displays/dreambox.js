Dreambox = {
  
  wire: function() {
    var hidden_part = $('#dreambox_hud_hidden');
    
    hidden_part.click(function(e){ e.stopPropagation(); });
    
    $(document).click(function(){
      if (hidden_part.is(':visible') && !$('#dreambox_your_initiatives').is(':visible')) 
        hidden_part.hide(50);
    });

    NQueue.receivers.push(Dreambox);
  },
    
  toggle_dreambox: function() {
    var hidden_part = $('#dreambox_hud_hidden');
    if (hidden_part.is(':visible')) {
      hidden_part.hide();
    } else {
      Dreambox.update();
      hidden_part.slideDown(100);
    }
    return false;
  },
  
  show: function(args) {
    $('#dreambox_hud_hidden').slideDown(100);
  },
  
  update: function() {
    var initiatives = Initiatives.mine();
    if (mine.length > 0) {
      
      var html = '';
      $.each(initiatives, function(){
        var i = this;
        var title = i.you_title();
        var report = i.report();
        html += "<div class='initiative'>";
        html += '<a href="#" item="'+i.tag()+'" class="title">' + title + "</div>";
        if (report) html += "<div class='report'>" + report + "</div>";
        html += "</div>";
      });
      
      $('#dreambox_your_initiatives_content').html(html).blit();
    }
  }
    
  // did_change_initiatives: function(){ 
  //   Dreambox.update(); 
  // }
      
};
