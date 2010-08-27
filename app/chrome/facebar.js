Facebar = {
  
  fold_state: {},
  
  agent_thumb: '<div href="#@#{id}" class="athumb agent_photo #{selected} #{id}">' +
    '#{badges}<img class="th" src="#{thumb_url}" title="#{title}"/>' +
    '<b>#{title}</b></div>',

  //     <div class="count">
  //       <h2 id="$2_agent_count"></h2>
  //       <h3 id="$2_agent_selection_count" class="selection_count"></h3>
  //     </div>
  
  populate: function(agents) {
    if (!agents) return;
    if (Agents.everything().length == 0) return $('#empty_text').show(); 
    else $('#empty_text').hide();

    var default_fold_state = agents.length > 300 ? 'folded' : 'straight';
    var groups = agents.group_by('fab_state');
    $('#agents > div.fab_state').hide();
    $.each($keys(groups), function(){
      if (this == null || this == "null") return;
      var group_name = this;
      var group = groups[this];
      var fold_state = Facebar.fold_state[group_name] || default_fold_state;
      var $elem = $('#' + group_name + '_agents');
      var $div  = $elem.children('div');
      var $h2   = $elem.find('h2');
      var $a    = $elem.find('h2 a');
      var group_selected = Selection.is_group_selected(group_name);
      var fold_expand_char;
      var opposite_state;

      $a.unbind('click');
      $h2.unbind('click');

      $h2.click(function(){
        Selection.toggle_group(group_name);
        Facebar.populate(This.agents);
      });
      
      if (fold_state == 'folded') {
        var count = group.length;
        group = group.slice(0,9);
        var html = '<img src="#{thumb_url}"/>'.tt(group);
        html += "<div class='count'>" + count + "</div>";
        count = Selection.count_in_group(group_name);
        if (count != 0)  html += "<div class='selected_count'>" + count + " selected</div>";
        $div.attr('class', 'folded').html(html);
        fold_expand_char = '&#9657;';  // bigger triangle: &#9654;
        opposite_state = 'straight';
      } else {
        group = group.sort_by('.last_ts_ago');
        if (group.length > 50) group = group.slice(0, 50);
        var html = group.map(function(x){
          x.selected = Selection.is_item_selected(x.id) ? 'selected' : '';
          return Facebar.agent_thumb.t(x);
        }).join('');
        $div.attr('class', 'thumbs').html(html);
        fold_expand_char = '&ndash;';
        opposite_state = 'folded';
        if (group.length < 2) $a.hide();
      }
      
      if (group_selected) $div.addClass('selected');
      else $div.removeClass('selected');

      $a.html(fold_expand_char).click(function(){
        Facebar.fold_state[group_name] = opposite_state;
        Facebar.populate(This.agents);
        return false;
      });
      $('#' + group_name + '_agents').show();
    });
    Selection.hide_or_show_options();
  }
  
};
