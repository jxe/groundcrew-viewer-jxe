function table(cols, data, func, blank_msg){
  var table = $('<table/>');
  table.append(tag('tr', cols.map(function(col){ return tag('th', col); }).join('')));
  $.each(data, function(){
    var row_data = this;
    $.each(func(row_data), function() {
      var row = $(tag('tr', this.map(function(col){ return tag('td', col); }).join('')));
      row.data('row_data', row_data);
      table.append(row);
    });
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
  },

  sent_missing_reply: function(signup) {
    var sent = signup.sent;
    if (!sent || sent.length < 1 || signup.sent_ts < signup.msg_ts) return null;

    if (sent.match(/[^'"]\?/) || (!sent.match(/^ok/i) && !sent.match(/^okay/i)))
      return "&nbsp;&nbsp;<i>no reply:</i> " + signup.sent;

    return null;
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
      var html = table(['date', 'role', 'email', 'mobile', 'city'], data.results.sort_by('.ts'),
        function(signup){
          var ps = signup.points.group_by('sys');
          var row1 = [
            $time_and_or_date(signup.ts),
            signup.groups.join(', '),
            Signups.qual_sysid(ps.e && ps.e[0]),
            Signups.qual_sysid(ps.m && ps.m[0]),
            signup.city || 'no location',
            '<a href="##reinvite">re-invite</a>' ];
          var sent = Signups.sent_missing_reply(signup);
          if (sent) {
            var row2 = [{content: sent, colspan: '6', 'class': 'warning'}];
            return [row1, row2];
          }
          return [row1];
        }, 'No recent invites');
      $('.current_invitations_tool div').html(html);
    });
    return "loading...";
  }

});
