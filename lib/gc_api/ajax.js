Ajax = {
  init: function() {    
    $.ajaxSetup({
      error: function(req, textStatus, errorThrown){
        if (req.status == 0) {
          Notifier.error("You are offline.");
          StreamLoader.schedule_autoload(30 * 1000);
        }
        if (req.status == 400) {
          Notifier.error(req.responseText);
          return;
        }
        if (req.status == 401) {
          if (demo) return Notifier.error("That action is not supported in demo mode.");
          $.cookie('back', window.location.href);
          window.location = current_stream+'/login';
          return;
        }
        if (req.status == 403) {
          console.log("403 for authority: " + window.authority);
          if (this.url.indexOf('stream.js') >= 0) {
            $('#loading_data').remove();
            $('#loading_data_failed').show();
            alert('You do not have permission to view or organize on this squad. ' +
              'You may need to sign out and sign back in on another account or ' +
              'request an organizer invitation from the squad leaders.');
            return;
          }
          Notifier.error('You do not have permission to perform that action. ' +
            'You may need to sign out and sign back in on another account or ' +
            'request an organizer invitation from the squad leaders.');
          return;
        }
        if (req.status == 404) return;
        if (errorThrown){ throw errorThrown; }
        if (req.responseText) {
          console.log(req.responseText);
          // this is a little white lie -- this actually usually occurs due to a server bug
          Notifier.error("Oops!  It looks like your connection is having problems. "+
            "Please try that action again soon.");
        }
      }
    });
  }
}
