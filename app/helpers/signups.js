Signups = {

  qual_sysid: function(pt) {
    if (!pt) return 'unknown';
    if (!pt.stage) return pt.sysid;
    if (pt.stage == 'confirmed') return pt.sysid + " (confirmed)";
    return pt.sysid + " (unconfirmed)";
  },

  sent_missing_reply: function(signup) {
    sent_p = signup.points.sort_by('.sent_ts').last();
    msg_p = signup.points.sort_by('.msg_ts').last();
    var sent = sent_p && sent_p.sent;
    var sent_ts = sent_p && sent_p.sent_ts;
    var msg_ts = msg_p && msg_p.msg_ts;
    if (!sent || sent.length < 1 || sent_ts < msg_ts) return null;

    if (sent.match(/[^'"]\?/) || (!sent.match(/^ok/i) && !sent.match(/^okay/i)))
      return "&nbsp;&nbsp;<i>no reply:</i> " + sent;

    return null;
  }

};


go.push({

  reinvite: function(id) {
    $.post_with_squad('/people/reinvite', {signup_id:id}, function(){
      Notifier.success("Invitation resent!");
    });
  },

  invites_table: function() {
    if (demo) return "Demo mode does not show recent invitations";
    if (!App.stream_role_organizer()) return "You must be an organizer on this squad to see recent invitations";
    
    $.getJSON_with_squad('/people/signups.json', function(data){
      var html = table(['date', 'role', 'name', 'email', 'mobile', 'city'], data.results.sort_by('.ts', { order: 'desc' }),
        function(signup){
          var ps = signup.points.group_by('sys');
          var ept = ps.e && ps.e[0];
          var mpt = ps.m && ps.m[0];
          var reinvite_link = ((ept && ept.stage == 'tentative') || (mpt && mpt.stage == 'tentative')) ?
            '<a href="##reinvite(\'' + signup.id + '\')">re-invite</a>' : '';
          var row1 = [
            $time_and_or_date(signup.ts),
            signup.groups.join(', '),
            signup.name || 'unknown',
            Signups.qual_sysid(ept),
            Signups.qual_sysid(mpt),
            signup.city || 'no location',
            reinvite_link ];
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
