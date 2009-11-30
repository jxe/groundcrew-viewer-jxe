function table(cols, data, func){
  var table = $('<table/>');
  table.append(tag('tr', cols.map(function(col){ return tag('th', col); })));
  $.each(data, function(){
    var row_data = this;
    var row = $(tag('tr', func(row_data).map(function(col){ return tag('td', col); }).join()));
    row.data('row_data', row_data);
    table.append(row);
  });
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
      $('.outstanding_invites_tool').app_paint();
    });
  },
  
  invites_table: function() {
    $.getJSON('/api/signups.json', function(data){
      $('.outstanding_invites_tool div').html(table(['date', 'role', 'email', 'mobile'], data.results.sort_by('.ts'), function(row){
        var ps = row.points.group_by('sys');
        return [ $time_and_or_date(row.ts), row.groups.join(', '), Signups.qual_sysid(ps.e && ps.e[0]), Signups.qual_sysid(ps.m && ps.m[0]), '<a href="##reinvite">reinvite</a>' ];
      }));
    });
    return "loading...";
  }

});
