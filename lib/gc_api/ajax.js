var atevent = null;
var test = false;
var cities_grabbed = {};
function at(num){ atevent = num; }

function sms_count(sent, received){
  $('#sms_sent').html(sent);
  $('#sms_received').html(received);
  $('#sms_counter').show();
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
    }).bind("ajaxComplete", function(){
      Ajax.schedule_autoload();
      $(this).removeClass('refresh');
    });

    $.ajaxSetup({
      error: function(req, textStatus, errorThrown){
        if (req.status == 401) {
          $.cookie('back', window.location.href);
          window.location = '../login';
          return;
        }
        if (req.status == 403) {
          console.log("403 for authority: " + window.authority);
          alert('You do not have permission to view or organize on this squad. ' +
            'You may need to sign out and sign back in on another account or ' +
            'request an organizer invitation from the squad leaders.');
          return;
        }
        if (req.status == 404) return;
        if (errorThrown){ throw errorThrown; }
        if (req.responseText) alert(req.responseText);
      }
    });

    Anncs.new_events_are_new = true;
    Resource.handle_changes = true;

    if (demo) return;
    Ajax.autoload();
  },

  schedule_autoload: function(){
    if (demo) return;
    if (Ajax.timer) clearTimeout(Ajax.timer);
    Ajax.timer = setTimeout(function(){Ajax.autoload();}, Ajax.interval);
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
    var uri = 'http://groundcrew.us/api/stream.js?';
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
