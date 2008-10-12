Ajax = {

  since: null,
  timer: null,

  uuid: function() {
    return agent_tag + '_' + new Date().getTime();
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
        if (errorThrown){ throw errorThrown;  }
        if (req.responseText) $.facebox(req.responseText);
      }
    });

    // Ajax.schedule_autoload();
  },
  
  schedule_autoload: function(){
    if (Ajax.timer) clearTimeout(Ajax.timer);
    Ajax.timer = setTimeout(Ajax.autoload, 20 * 1000);
  },

  autoload: function(){
    Ajax.load('/gc/view');
  },

  fetch: function(url, options, after){
    $.getJSON(url, options, function(obj){
      if (obj.error){ alert("Note: " + obj.error); return; }
      if (after) after(obj);
    });
  },

  load: function(url, options, after){
    if (!options){ options = {}; };
    if (Ajax.since) options['since'] = Ajax.since;
    Ajax.fetch(url, options, function(obj){
      Reactor.handle_json_obj(obj);
      if(after) after();
    });
    return false;
  }

};
