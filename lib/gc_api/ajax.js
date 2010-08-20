var atevent = null;
var test = false;
var cities_grabbed = {};
function at(num){ atevent = num; }

function sms_count(sent, received, limit){
  $('#sms_sent').html(sent);
  $('#sms_received').html(received);
  $('#sms_counter').show();

  // todo, rename remaining to sms_remaining
  if (limit > 0) {
    window.remaining = Math.max(limit - sent - received, 0);
    if (window.remaining < 30) $('#youbox').addClass('warning');
  }
};


function q(){};

Ajax = {
  interval: 6 * 1000,
  timer: null,

  uuid: function() {
    return This.user.tag + '_' + new Date().getTime();
  },

  init: function() {
    $("body").bind("ajaxSend", function(){
      clearTimeout(Ajax.timer);
      $(this).addClass('refresh');
    }).bind("ajaxComplete", function(event, req, settings){
      if (!req || req.status != 403 || !settings || !settings.url || settings.url.indexOf('stream.js') < 0) {
        Ajax.schedule_autoload();
      }
      $(this).removeClass('refresh');
    });

    Anncs.new_events_are_new = true;
    Resource.handle_changes = true;

    $.ajaxSetup({
      error: function(req, textStatus, errorThrown){
        if (req.status == 0) {
          Notifier.error("You are offline.");
          Ajax.schedule_autoload(30 * 1000);
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

    if (demo) return;
    Ajax.autoload();
  },

  schedule_autoload: function(interval){
    if (demo) return;
    if (Ajax.timer) clearTimeout(Ajax.timer);
    Ajax.timer = setTimeout(function(){Ajax.autoload();}, interval || Ajax.interval);
  },

  maybe_trigger_load: function() {
    if (Ajax.go_on_load && ($values(Agents.by_tag).length > 0 || most_recent_item)) {
      go(Ajax.go_on_load);
      $('#loading_data').remove();
      delete Ajax.go_on_load;
    }
  },

  autoload: function(callback){
    if (demo) return;
    var uri = '/api/stream.js?stream=' + window.current_stream;
    if (atevent) uri += '&since=' + atevent;
    if (This.city_id) {
      uri += '&city=' + This.city_id;
      if (!cities_grabbed[This.city_id]) {
        uri += '&city_init=1';
        cities_grabbed[This.city_id] = true;
      }
    }

    $.getScript(uri, callback);
    Ajax.maybe_trigger_load();
  },

  fetch: function(url, options, after){
    if (demo) return;
    $.getJSON(url, options, function(obj){
      if (obj.error){ alert("Note: " + obj.error); return; }
      if (after) after(obj);
    });
  }

};

jQuery.extend({
  ajax_with_squad: function(settings) {
    if (!settings.data) settings.data = {};
    settings.data.squad = window.current_stream;
    if (settings.url) settings.url = '/api' + settings.url;
    $.ajax(settings);
  },

  post_with_squad: function(url, data, callback, type) {
    // shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

    return $.ajax_with_squad({type: 'POST', url: url, data: data, success: callback, dataType: type});
  },

  delete_with_squad: function(url, data, callback, type) {
    // shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

    return $.ajax_with_squad({type: 'DELETE', url: url, data: data, success: callback, dataType: type});
  },

  get_with_squad: function(url, data, callback, type) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}
    return $.ajax_with_squad({type: 'GET', url: url, data: data, success: callback, dataType: type});
  },

  getJSON_with_squad: function(url, data, callback) {
    return $.get_with_squad(url, data, callback, 'json');
  }
});
