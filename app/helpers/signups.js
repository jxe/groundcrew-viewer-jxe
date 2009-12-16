function table(cols, data, func, blank_msg){
  var table = $('<table/>');
  table.append(tag('tr', cols.map(function(col){ return tag('th', col); }).join('')));
  $.each(data, function(){
    var row_data = this;
    var row = $(tag('tr', func(row_data).map(function(col){ return tag('td', col); }).join('')));
    row.data('row_data', row_data);
    table.append(row);
  });
  if (data.length == 0) {
    table.append('<tr><td colspan="'+cols.length+'">'+blank_msg+'</td></tr>');
  }
  return table;
}


Signups = {
  
  qual_sysid: function(pt) {
    if (!pt) return 'unknown';
    if (!pt.stage) return pt.sysid;
    if (pt.stage == 'confirmed') return pt.sysid + " (confirmed)";
    return pt.sysid + " (unconfirmed)";
  }
  
};


LiveHTML.widgets.push({

  reinvite: function(arg, elem) {
    var id = $(elem).parents('tr').data('row_data').id;
    $.post('/api/people/reinvite', {signup_id:id}, function(){
      $('.current_invitations_tool').app_paint();
    });
  },
  
  invites_table: function() {
    if (demo) return "Demo mode does not show recent invitations";
    $.getJSON('/api/people/signups.json', function(data){
      var html = table(['date', 'role', 'email', 'mobile'], data.results.sort_by('.ts'), function(row){
        var ps = row.points.group_by('sys');
        return [ $time_and_or_date(row.ts), row.groups.join(', '), Signups.qual_sysid(ps.e && ps.e[0]), Signups.qual_sysid(ps.m && ps.m[0]), '<a href="##reinvite">re-invite</a>' ];
      }, 'No recent invites');
      $('.current_invitations_tool div').html(html);
    });
    return "loading...";
  }

});
