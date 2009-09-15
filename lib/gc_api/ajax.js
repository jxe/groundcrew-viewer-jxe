Ajax = {
  interval: 1 * 1000,
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
    Ajax.timer = setTimeout(Ajax.autoload, Ajax.interval);
  },

  maybe_trigger_load: function() {
    if (Ajax.go_on_load && Agents.all.length > 20) {
      go(Ajax.go_on_load);
      $('#loading_data').remove();
      delete Ajax.go_on_load;
    }
  },

  autoload: function(){
    if (demo) return;
    var base_uri = '/api/stream.js?';
    if (Resource.ts) base_uri += 'since=' + Resource.ts + ';';
    $.getScript(base_uri);
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
