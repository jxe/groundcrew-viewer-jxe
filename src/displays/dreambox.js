Dreambox = {
  
  wire: function() {
    var hidden_part = $('#dreambox_hud_hidden');
    
    hidden_part.click(function(e){ e.stopPropagation(); });
    
    $('#dbox_hideshow_others').click(Dreambox.hideshow_others);
    
    $(document).click(function(){
      if (hidden_part.is(':visible') && !$('#dreambox_your_initiatives').is(':visible')) 
        hidden_part.hide(50);
    });

    NQueue.receivers.push(Dreambox);
  },
  
  hideshow_others: function() {
    var x = $('#dreambox_other_hide');
    if (x.is(':visible')) {
      x.slideUp(100);
      $('#dbox_hideshow_others').html('show other people\'s dreams');
    } else {
      x.slideDown(100);
      $('#dbox_hideshow_others').html('hide other people\'s dreams');
    }
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
  
    
  did_change_selected_city: function() {
    var city_name = cities[Viewer.selected_city];
    $(document).blit();
    // $('.city_name').html(city_name);
  },
  
  show: function(args) {
    $('#dreambox_hud_hidden').slideDown(100);
  },
  
  click: function(link, parent_link) {
    var action = link.attr('action');
    var itag = link.attr('itag') || parent_link.attr('itag');
    var i = Initiatives.all[itag];
    if (action == 'flag') {
      if (!logged_in) return Viewer.join_please();
      $('#dreambox_hud .coverpane').show().click(function(){ return false; });
      Ajax.fetch('/gc/flag', {item:itag, words:link.text()}, EventDb.new_event);
    }
    if (action == 'agree') {
      $('#dreambox_hud .coverpane').show().click(function(){ return false; });
      Ajax.fetch('/gc/flag', {item:itag, words:'pos squadm'}, EventDb.new_event);
    }
    if (action == 'plan') {
      if (!logged_in) return Viewer.join_please();
      Planner.show(i);
    }
    if (action == 'assign') {
      var agents = i.agents();
      if (agents.length == 1) return Viewer.open(agents[0]);
      if (agents.length > 1)  return Tour.start(agents, { topic: "with this desire", initiative: i, atag: i.atag });
      alert('there are no agents available who are up for this.');
    }
  },
  
  popper_process: function(elem, link) {
    var itag = link.parents('.initiative').attr('initiative');
    var i = Initiatives.all[itag];
    if (!i) {
      elem.find('td').wire_popper_links();
      elem.find('input').val('type to add your own dream').css('color', '#777').focus(function(){
        this.value = '';
        $(this).css('color', 'black');
      });
      elem.find('form').submit(Dreambox.new_citywish);      
      return;
    }
    var html = '';
    
    // if it has an eventplan:
    //   //  - see location / planview if eventplan made
    
    if (!i.i_agree) {
      html += "<a href='#' itag='"+itag+"' action='agree'>volunteer to help with this</a>";
    }
    if (i.needs_plan) {
      html += "<a href='#' itag='"+itag+"' action='plan'>plan an event</a>";
    }
    if (i.agreecount > 1) {
      html += "<a href='#' itag='"+itag+"' action='assign'>give assignments</a>";
    }
    html += "<a href='#flags' class='subm' itag='"+itag+"'>flag this as...</a>";
    elem.find('.insert_content_here').html(html);
  },
  
  new_citywish: function(ev) {
    var data = ev.stopPropagation ? $(this).find('input').val() : ev.attr('href');
    Ajax.fetch('/gc/citywish', {msg:data}, EventDb.new_event);
    return false;
  },  

  mine_clicked: function(ev) {
    var i = $(this.parentNode).attr('initiative');
    Viewer.open(Initiatives.all[i]);
    return false;
  },
  
  update: function() {
    var mine = Initiatives.mine();
    var other_recent = Initiatives.other_recent();
    if (mine.length > 0) {
      $('#dreambox_your_initiatives_content').html(Dreambox.render_mine(mine));
      $('#dreambox_your_initiatives').show().find('a').click(Clicker.click);
      
      var x = $('#dreambox_other_hide');
      if (x.is(':visible')) {
        x.slideUp(100);
        $('#dbox_hideshow_others').html('show other people\'s dreams');
      }

      $('#dbox_hideshow_others').show();
    } else {
      $('#dreambox_your_initiatives').hide();
      $('#dbox_hideshow_others').hide();
    }
    $('#dreambox_initiatives').html(Dreambox.render_other_recent(other_recent));
    $('#dreambox_hud .coverpane').hide();
    $('#dreambox_initiatives .initiative .title, #addyer').wire_popper_links();
  },
  
  render_mine: function(initiatives) {
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
    return html;
  },
  
  render_other_recent: function(initiatives) {
    var first = 0;
    var html = '';
    var city_name = cities[Viewer.selected_city];
    $.each(initiatives, function(){
      var i = this;

      // print the event view      
      html += "<span class='initiative' initiative='"+ i.tag() +"'>";
      html += '<span class="title" popper="#dreambox_pmenu/bcl" title="'+i.agreecount+' agents">';
      html += i.town();
      
      if (i.agreecount > 1) html += ' (+' + (i.agreecount - 1) + ')';
        
      html += "</span>";
      // reports:
      // "<div class='indent'>";
      // html += "<div>&gt; plan something</div>";
      //   //  - eventplan made?
      //   //  - eventplan idea
      
      html += "</span>, ";
    });
    return html;
  },
  
  did_change_initiatives: function(){ 
    Dreambox.update(); 
  }
      
};
