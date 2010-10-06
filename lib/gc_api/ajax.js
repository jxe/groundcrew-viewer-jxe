Ajax = {
  init: function() {    
    $.ajaxSetup({
      error: function(req, textStatus, errorThrown){
        // common
        if (req.status == 400) {
          Notifier.error(req.responseText);
          return;
        }
        else if (req.status == 401) {
          if (demo) return Notifier.error("That action is not supported in demo mode.");
          $.cookie('back', window.location.href);
          window.location = '/'+current_stream+'/login';
          return;
        }
        else if (req.status == 404) return;

        // stream.js
        if (this.url.indexOf(stream_url) >= 0) {
          if (req.status == 0) {
            Notifier.error("You are offline.");
            if (!demo) StreamLoader.schedule_autoload(30 * 1000);
            return;
          }
          else if (req.status == 403) {
            $('#loading_data').remove();
            $('#loading_data_failed').show();
            alert('You do not have permission to view or organize on this squad. ' +
              'You may need to sign out and sign back in on another account or ' +
              'request an organizer invitation from the squad leaders.');
            return;
          }
        }
        // not stream.js
        else {
          if (req.status == 0) {
            Notifier.error("You are offline.");
            return;
          }
          else if (req.status == 403) {
            Notifier.error('You do not have permission to perform that action. ' +
              'You may need to sign out and sign back in on another account or ' +
              'request an organizer invitation from the squad leaders.');
            return;
          }
        }

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
};
