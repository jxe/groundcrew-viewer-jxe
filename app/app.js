////
// This is the "Application" controller
//
App = {
  initted: false,
  tools: {},

  back: function() { go('mode=;tool='); },

  search_form_submitted: function(data, state, form) {
    go('q=' + data.q);
    return "redo";
  },

  list_of_links: function(obj) {
    if (!obj) return '';
    else return $pairs(obj).sort_by('.val', { compare: 'alpha' }).map(function(x){
      return tag('li', { href: '/'+x.key, content: x.val });
    }).join('');
  },

  clear_query: function() {
    $('#search').val('');
    go('q=');
  },

  query: function() {
    return This.q;
  },

  query_watcher: function(value, chr, obj) {
    setTimeout(function(){
      if (obj.val() == '') return go('q=');
    }, 0);
  },
  
  zoomed_out: function() {
    return !This.city;
  },

  closeclick: function() {
    This.city ? go('@' + This.city) : go('tool=;item=');
  },

  reposition_floaty: function (e) {
    // Tie the floaty to the cursor
    var map = $('#map');
    var floaty = $('#floaty');
    var x = e.pageX - map.offset().left;
    var w = floaty.width()
    floaty.css({
      'left' : Math.min(Math.max(              x - w/2, 0), map.width() - w),
      'right': Math.min(Math.max(map.width() - x - w/2, 0), map.width() - w),
      'top': Math.max(e.pageY - map.offset().top, 0) + 16
    })
  },

  change_state: function() {
    var changed = This.changed;
    if (changed.tool && This.tool && This._item && !changed.item) {
      This.prev_item = This.item;
      go.set('item', This.city);
    } else {
      This.prev_item = null;
    }

    if (changed.item) {
      if (!This.item) {
        This._item = null;
        go.set('city', null);
      } else if (This.item.startsWith('City__')) {
        This._item = null;
        go.set('city', This.item);
      } else {
        This._item = This.item && This.item.resource();
        if (This._item && This._item.city_id) go.set('city', 'City__' + This._item.city_id);
      }
    }

    if (changed.city || changed.q) {
      This.city_id = This.city && This.city.replace('City__', '');
      go.set('agents', Agents.here());
      $('#flexbar').scrollLeft(0);
      if (This.city) $('body').removeClass('zoomed_out');
      else $('body').addClass('zoomed_out');
    }

    if (changed.city && window.GM) {
      if (This.city) Map.set_focus_on_city();
      else Map.set_focus_worldwide();
    }

    if (changed.agents) {
      Facebar.populate(This.agents);
      if (!changed.city) Map.layer_recalculate('agents');
    }

    if (changed.item || changed.mode || changed.tool) App.refresh_itemwindow();
    if (changed.tool && This.tool && This.tool.indexOf('_landmark') >= 0) {
      App.reposition_floaty(This.event);
      $('#map').mousemove(App.reposition_floaty);
    } else if (changed.tool) {
      $('#map').unbind('mousemove', App.reposition_floaty);
    }

    if (This.tool == 'ask_a_question') {
      $('.ask_a_question_tool').app_paint();
    } else if (This.tool == 'send_a_message') {
      $('.send_a_message_tool').app_paint();
    }

    if ($('#group_actions').is(':visible')) {
      $('#group_actions').app_paint();
    }
    if (This.tool || Map.open_window_type) {
      $('#action_list').hide();
    } else {
      $('#action_list').show();
    }

    App.check_selection_mode();
  },

  check_selection_mode: function () {
    if (Map.open_window_type == '#new_mission_landmark'  ||
        // TODO: uncomment this once we widgetize the Nearest/Anyone agentpicker from the new mission landmark
        // Map.open_window_type == '#new_question_landmark' ||
        This.tool == 'send_a_message' ||
        This.tool == 'ask_a_question' ||
        This.tool == 'tag_agents') {
      Selection.mode('multi');
    } else {
      Selection.mode('default');
    }
  },

  selection_mode_changed: function () {
    $('#group_actions').app_paint();
  },

  selection_mode_help_text: function () {
    msg = "Select more";
    if (Selection.mode() == 'default') {
      // change the key name based on OS
      msg += ' using the ' + App.selection_modifier_key_name() + ' key';
    } else {
      msg += ' by clicking on them'
    }
    return msg;
  },

  selection_modifier_key_name: function () {
    return navigator.userAgent.indexOf('Macintosh') >= 0 ? 'command' : 'control';
  },

  did_change_state: function() {
    // LATER: generalize state spaces that require an item window refresh
    if (This.changed.agentbody || This.changed.agentside || This.changed.opbody) {
      App.resize_itemwindow();
    }
  },

  go_admin: function() {
    window.location = '/' + current_stream + '/admin';
  },

  go_home: function() {
    window.location = '/' + current_stream + '/home';
  },

  go_settings: function() {
    window.location = '/' + current_stream + '/settings';
  },

  error_on_non_immediate: function(item_ids) {
    if (!App.use_slow_agents) return false;
    var items = item_ids.map(function(id) { return id && id.resource(); }).compact();
    var slow_items = items.grep(function(item) { return !item.immediate; });
    if (slow_items.length == 0) return false;

    var slow_names = slow_items.map(function(item) { return item.title || "unnamed agent"; }).join(', ');
    var msg = slow_names + (slow_items.length > 1 ? ' are' : ' is') +
      ' reachable only via email, which does not support this operation.';
    alert(msg);
    return true;
  },

  request_agent_update_location: function() {
    if (App.error_on_non_immediate([This.item])) return "redo";

    // TODO: check comm3 and don't allow if we bugged them recently
    if (demo) return Demo.update_loc(This.item);
    return Operation.exec(CEML.script_for("msg", "Our location for you looks old or imprecise. " +
        "Where are you? Please respond with 'at' and then your address."),
      This.item, This.item, function(){
      $('#send_a_message_to_agent').html('Message sent!');
    });
  },


  demo_mode: function() {
    return demo;
  },

  refresh_itemwindow: function() {
    if (!This._item) App.close_itemwindow();
    else {
      var thing = This.item.resource_type().toLowerCase();
      var window_type = 'unknown'; // someday this will be accurate for all window types
      var best_template = $.template('#' + thing + '_for_' + This.mode + '_mode') || $.template('#' + thing + '_for_any_mode');

      // HACK
      if ((thing == 'landmark' || thing == 'agent') && This.mode == 'new_mission') {
        if (thing == 'agent') {
          Selection.select(This.item);
        }
        window_type = '#new_mission_landmark';
        best_template = $.template(window_type);
      }
      // End HACK

      if (best_template) {
        if (MapMarkers.has_loc(This._item)) {
          $('#itemwindow').hide();
          MapMarkers.window(best_template, window_type);
        }
        else {
          Map.close_all_windows();
          var container = $('#itemwindow');
          $('.content', container).html(best_template.app_paint()[0]);
          container.show();
        }
      } else {
        //TODO:  if there's no template, there should be no selection
        console.log('no good template for ' + thing);
        App.close_itemwindow();
      }

      // LATER: generalize this and move it into go
      $.each($w('agentbody agentside opbody'), function() {
        if (This[this]) $('.' + This[this] + '_' + this).activate(this);
      });
      App.resize_itemwindow();
    }
  },

  close_itemwindow: function() {
    $('#itemwindow').hide();
    Map.close_all_windows();
  },

  resize_itemwindow: function() {
    if (This.item) window.GMIW && GMIW.setContent(GMIW.getContent());
  },

  // new events trigger tool/window repainting
  anncs_changed: function() {
    if ($('.live_events:visible').length > 0) {
      $.each(Anncs.what_changed, function(k, ev){
        if (This.item && (ev.re == This.item || ev.item_tag == This.item || ev.actor_tag == This.item)) {
          App.refresh_itemwindow();
          return false;
        }
        // LATER: only repaint if type matches current filter
        if (This.tool == 'view_activity') {
          $('.view_activity_tool').app_paint();
          return false;
        }
        if (This.tool == 'chat' && ev.atype == 'chat') {
          $('#chat_palette').app_paint();
          return false;
        }
      });
    }
  },

  toggle_squad: function(tag) {
    if (!window.authority) return go('tool=join_squad;with_tag=' + tag);

    var agent = Agents.id(This.user.tag) || This.user;
    var agent_atags = agent.atags.split(' ').to_h();
    if (!agent_atags[tag]) {
      // add it
      return $.post_with_squad('/agents/update', { with_tags: tag }, function(){ 
        agent.atags += (" " + tag);
        Agents.handle_change(agent);
        go('tool='); 
      });
      
    } else {
      // remove it
      return $.post_with_squad('/agents/update', { without_tags: tag }, function(){ 
        delete agent_atags[tag];
        agent.atags = $keys(agent_atags).join(' ');
        Agents.handle_change(agent);
        go('tool='); 
      });
    }
  },
  
  at_item: function(url) {
    url = This.new_url.slice(1);
    if (LiveHTML.metaOn && url.startsWith('p')) 
      return Selection.toggle(url);
    if (Selection.mode() == 'multi' && url.startsWith('p')) 
      return Selection.toggle(url);
    return go('mode=;tool=;item=' + url);
  },

  selection_changed: function() {
    console.debug("Selection changed ka-blam!", Selection.count());
    if (Selection.has_selection()) {
      $('#group_actions').show();
      $('.require_selection').hide();
    } else {
      $('#group_actions').hide();
      $('.require_selection').show();
    }

    if (Map.open_window_type == '#new_mission_landmark') {
      $('#new_mission_landmark .anyone_agentpicker').app_paint();
    }
    if (This.tool == 'ask_a_question') {
      $('.ask_a_question_tool').app_paint();
    } else if (This.tool == 'send_a_message') {
      $('.send_a_message_tool').app_paint();
    }
    if ($('#group_actions').is(':visible')) {
      $('#group_actions').app_paint();
    }
  },

  op_event_info: function (type) {
    var events = op_children[This.item] || [];
    if (typeof type == 'string') events = events.grep(function(ev){ return ev.atype == type; });
    $.each(events, function(){ Event.improve(this); });
    return Actions.event_t.tt(events);
  },

  item_event_info: function() {
    if (!This.item || !item_children[This.item]) return '';
    $.each(item_children[This.item], function(){ Event.improve(this); });
    return Actions.event_t.tt(item_children[This.item].slice(0).reverse());
  },

  handle_error: function(msg, uri, line) {
    // map script loading fails sometimes, but seems to automatically reload
    if (msg.type == 'error') {
      uri = msg.target && msg.target.src;
      if (uri && uri.indexOf("http://maps") >= 0) return false;
    }
    if (uri && uri.indexOf("http://www.panoramio.com/map/get_panoramas.php") >= 0) return false;
    if (uri && uri.indexOf("http://maps") >= 0 && msg == "Error loading script") return false;

    go.err(msg, null, uri + ": " + line);
    return false; // don't suppress the error
  },

  notify_error: function() {
    var str = 'An error has occurred in this software.' +
      '\n\nIt has been reported to our developers, but you might need to reload the page. Sorry!';
    Notifier.error(str);
  },


  // ======================
  // = App initialization =
  // ======================
  
  login_complete: function() {
    go('tool=');
  },
  
  initialize: function() {
    window.dontloadcookieonstart = true;
    if($.browser.msie) { $('#unsupported').show(); return; }
    UIExtras.init();
    window.onerror = App.handle_error;
    App.decide_stream();
    App.authenticate();
    App.load_stream();
    window.fbAsyncInit = App.init_facebook;
  },
  
  decide_stream: function() {
    var slug = window.location.pathname.split('/')[1];
    if (location.protocol == 'file:') slug = 'demo';
    if (slug.startsWith('demo')) {
      window.demo = true;
      window.current_stream = 'demo';
      window.stream_url = slug + '.js';
    } else {
      window.demo = false;
      window.current_stream = slug;      
      window.stream_url = '/api/stream.js?stream=' + current_stream;
    }
    if (slug.startsWith('demo+')) {
      window.demo = true;
      window.current_stream = slug.slice(5);
      window.stream_url = '/api/stream.js?stream=' + current_stream;
    };
    if (demo) $('body').addClass('demo_mode');
  },

  user_ready: function() {
    // do nothing, but prevent the user_ready default action
  },
    
  
  authenticate: function() {
    if (window.demo) { 
      App.authenticated = true; 
      window.authority = 'pChad';
      go("#auth_complete");
      return; 
    }
    $.ajax({ url: '/api/auth.js?stream=' + current_stream, dataType: 'script', success: function(){
      go("#auth_complete");
      App.authenticated = true;
      if (App.stream_loaded) App.init_ui();
    }});
  },
  
  load_stream: function() {
    Ajax.init();
    StreamLoader.stream_url = stream_url;
    StreamLoader.load(function(){
      This.changed.item = This.changed.city = true;
      App.stream_loaded = true;
      if (App.authenticated) App.init_ui();
    }, Ajax.error);
  },

  stream_load_failed: function() {
    $('#loading_data').remove();
    $('#loading_data_failed').show();
  },

  update_current_agent: function() {
    This.form_data.stream = current_stream;
    $.post('/api/i' + This.prev_item, This.form_data, go.onwards);
  },

  default_invite_page: function() {
    if (current_stream == 'nrsp') return 'join';
    else return 'signup';
  },
  
  twitter_squad: function(){
    return window.current_stream.contains('_followers');
  },
  
  start_lrl: function() {
    var sidemode = 'sidemode=tutorial;tutmode=tutorial1';
    if (window.current_stream.contains('_followers')) sidemode = 'sidemode=twit_tutorial';
    if (demo) sidemode = 'sidemode=demo;tutmode=tutorial1';
    if (window.location.hash) return window.location.hash.slice(1);
    else {
      var city = App.start_city();
      if (window.authority || !SidebarTags[window.current_stream]) return city + ";" + sidemode;
      else return city + ";tool=welcome;" + sidemode;
    }
  },
    
  start_city: function() {
    // find most active citites
    var agents_by_city = Agents.find('=city_id');
    delete agents_by_city[0];
    var active_cities = $keys(agents_by_city);
    var top_city = active_cities[0];
    if (!top_city && most_recent_item) top_city = most_recent_item.city_id;

    if (active_cities.length > 1 || !top_city) return 'item=';
    else return 'item=City__' + top_city;
  },
  
  init_ui: function() {
    // init the UI
    Frame.init();
    $('body').addClass('stream_role_' + window.stream_role);
    if (current_stream != 'nrsp') $('body').removeClass('collapsed');
    $('body').removeClass('loading');
    Map.establish();

    // start refreshing the stream
    Resource.handle_changes = true;
    if (!demo) StreamLoader.init_autoload();
    $('#loading_data').remove();
    go(App.start_lrl());
    go.trigger('map_loaded');

    if (demo) Demo.init_manual();
  },

  switch_to_question: function(value, ch) {
    if (ch == '?') {
      $('form input[value=question]').attr('checked', 'checked');
    }
  },

  maxchar: function(max, where, value, chr, obj) {
    setTimeout(function(){
      var current = obj.val().length;
      var diff = Number(max) - Number(current);
      $(where).html(diff);
      if (diff < 5) $(where).addClass('red');
      else $(where).removeClass('red');
    }, 50);
  },

  go_to_self: function() {
    go('@' + This.user.tag);
  },

  suggest_squad_form_submitted: function(data) {
    data.kind = "Squad Suggestion";
    data.suggest_for = window.current_stream_name || window.current_stream;
    $.post('/api/fsubmit', data, function(){
      Notifier.success('Thanks!', 'Submitted');
      go('tool=');
    });
  },

  join_squad_form_submitted: function(data) {
    data.stream = window.current_stream;
    if (This.with_tag) {
      data.with_tags = This.with_tag;
      delete This.with_tag;
    }
    $.post('/api/people/join', data, function(){
      Notifier.success('Thanks!', 'Loading your new account...');
      $.ajax({ url: '/api/auth.js?stream=' + current_stream, dataType: 'script', success: function(){
        go("#auth_complete");
        if (data.with_tags) { This.user.atags += data.with_tags; };
        Notifier.success('Thanks!', 'Check your email to complete signup...');
        go('tool=');
      }});
    });
  },
  
  help_form_submitted: function(data) {
    $.post('/api/bugreport', {issue: data.issue}, function(){
      Notifier.success('Thanks!', 'Submitted');
      go('tool=');
    });
  },
  
  reverse_geocode_landmark: function(data) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: new google.maps.LatLng(data.lat, data.lng) }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK && results[0]) {
        data.name = results[0].formatted_address;
        App.post_landmark(data);
      }
    });
  },

  post_landmark: function(data, callback) {
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to edit landmarks.");
    if (!This.city) {
      alert('Sorry, landmarks can only be created in a city.');
      return "redo";
    }

    if (!data.lm_id)  data.lm_id = 'l' + authority + '_' + Date.unix();
    if (!data.lat)    data.lat = This.click_latlng.lat();
    if (!data.lng)    data.lng = This.click_latlng.lng();
    if (!data.kind)   data.kind = 'l';
    if (!data.city)   data.city = This.city_id;
    if (!data.latch)  data.latch = "unlatched";
    if (!data['float']) data['float'] = "onmap";

    if (!data.name) {
      App.reverse_geocode_landmark(data);
      data.name = "Landmark at " + Math.round(data.lat*100)/100 + " latitude and " + 
        Math.round(data.lng*100)/100 + " longitude";
    }

    if (demo) {
      lm = item(data['city'], data['lm_id'], data['name'] || 'A landmark', null,
        data['lat'], data['lng'], data['with_tags'], "unlatched", null, null, {});
      Map.site_add('landmarks', lm.id, MapLandmarks.marker_for_lm(lm));

      callback && callback(lm);
      return true;
    }

    return $.post_with_squad('/items/'+data.lm_id, data, function(landmark_js){
      var lm = eval(landmark_js);
      Map.site_add('landmarks', lm.id, MapLandmarks.marker_for_lm(lm));

      callback && callback(lm);
    }, 'text');
  },

  send_landmark_form_submitted: function(data) {
    if (!data.name) {
      alert('Please provide a location name!');
      return "redo";
    }
    if (This.item && This.item.resource_type() == 'Landmark') {
      data.lm_id = This.item;
      data.lat = This._item.lat;
      data.lng = This._item.lng;
    }
    return App.post_landmark(data, function(lm) { go('@'+lm.id); });
  },

  remove_item: function(data) {
    var item;
    if (!This.item || This.item.startsWith('City')) item = This.prev_item;
    else item = This.item;
    if (!item) return "redo";
    if (!App.stream_role_organizer()) return Notifier.error("You must be a leader of this squad to remove this item.");
    var r = confirm("Are you sure you wish to remove this " + item.resource_type().toLowerCase() + " from your squad?");
    if (!r) return "redo";

    if (demo) {
      off(item);
      return App.closeclick();
    }

    return $.delete_with_squad('/items/' + item, function() {
      off(item);
      App.closeclick();
    });
  },

  radial_invite_form_submitted: function(data) {
    if (data.agents == "require_selection") data.agents = Selection.agent_ids().join(' ');
    // if (App.error_on_non_immediate(data.agents.split(' '))) return "redo";
    if (!data.title) {
      alert('Please provide an assignment!');
      return "redo";
    }
    if (!data.agents) {
      alert('There are no agents to invite!');
      return "redo";
    }
    if (demo) {
      Demo.invite(data.agents.split(' '), This.item, data.title, data.assignment);
    } else {
      Operation.exec(CEML.script_for_invite(data.title, data.assignment), data.agents, This.item);
    }
    Selection.clear();
  },

  mission_landmark_invite_form_submitted: function(data) {
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to run operations.");
    if ($('div.anyone_agentpicker').css('display') != 'none') {
      data.agents = Selection.agent_ids().join(' ');
    }
    // if (App.error_on_non_immediate(data.agents.split(' '))) return "redo";
    if (!data.title) {
      alert('Please provide an assignment!');
      return "redo";
    }
    if (!data.agents || data.agents.size == 0) {
      alert('There are no agents to invite!');
      return "redo";
    }
    if (!This.city) {
      alert('Sorry, landmark missions can only be started in a city.');
      return "redo";
    }
    if (!data.name) {
      data.name = 'Location for "' + data.title + '" mission';
    }

    var make_mission = function(lm) {
      if (demo) {
        Demo.invite(data.agents.split(' '), lm.id, data.title, data.assignment);
      } else {
        Operation.exec(CEML.script_for_invite(data.title, data.assignment), data.agents, lm.id);
      }
      Selection.clear();
    };

    if (This.item.resource_type() == 'Landmark' || This.item.resource_type() == 'Agent') {
      return make_mission({id: This.item});
    } else {
      return App.post_landmark(data, make_mission);
    }
  },

  question_landmark_form_submitted: function(data) {
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to ask questions.");

    if (!data.question || data.question.length < 5) {
      alert('Please provide a question to ask that\'s at least 5 characters!');
      return "redo";
    }
    if (!This.city) {
      alert('Sorry, landmark-based questions can only be asked in a city.');
      return "redo";
    }

    if (data.agents == "require_selection") data.agents = Selection.agent_ids().join(' ');

    if (!data.agents || data.agents.size == 0) {
      alert('There are no agents to ask!');
      return "redo";
    }

    return App.post_landmark(data, function(lm) {
      if (demo) {
        Demo.question(data.question, data.agents.split(' '), lm.id);
      } else {
        Operation.exec(CEML.script_for('question', data.question), data.agents, lm.id);
      }
      Selection.clear();
    });
  },

  ask_a_question_form_submitted: function(data) {
    var agent_ids = Selection.agent_ids();
    if (!agent_ids.length) {
      agent_ids = Agents.here().map('.id');
    }
    if (!agent_ids.length) {
      alert('There are no agents to ask!');
      return "redo";
    }
    if (!This.city) {
      alert('Sorry, asking a question worldwide is not permitted at this time.');
      return "redo";
    }
    if (!data.question || data.question.length < 5) {
      alert('Please provide a question to ask that\'s at least 5 characters!');
      return "redo";
    }
    if (demo) {
      Demo.question(data.question, agent_ids);
    } else {
      agent_ids = agent_ids.join(' ');
      Operation.exec(CEML.script_for('question', data.question), agent_ids, agent_ids);
    }
    Selection.clear();
  },

  public_request_form_submitted: function(data) {
    return Operation.exec(CEML.script_for_invite(data.title, data.assignment), null, null,
      function(op){ $.post_with_squad('/' + op.id + '/broadcasts', { msg: data.msg, sys: 't' }); },
    data.desc);
  },

  blast_message_form_submitted: function(data) {
    if (!data.message || data.message.length < 5) {
      alert('Please provide a message that\'s at least 5 characters!');
      return "redo";
    }
    params = { msg: data.message, sys: 'm' };
    if (data.tags) {
      params['query'] = data.tags.split(/[,\s]+/).map(function(tag) {return 'tag:' + tag;}).join(' ');
    }
    if (This.city_id) params['city'] = This.city_id;
    if (demo) { Notifier.success("Blasting message to agents!"); return go('tool='); }

    if (window.sms_remaining <= 0) {
      $.post('/api/bugreport', {issue: window.current_stream + ' has run out of text messages!'});
      alert('You have reached your limit on text messages!  ' +
        'Please contact Groundcrew support to purchase more.');
      return false;
    }

    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to blast messages.");

    return $.post_with_squad('/blast_message', params, function(data){
      go('tool=');
      Notifier.success("Blasting message to " + data + " agents!");
    });
  },

  blast_email_form_submitted: function(data) {
    if (!data.subject || !data.body || data.body.length < 5) {
      alert('Please provide a subject and a message body!');
      return "redo";
    }
    if (This.city_id) data['city'] = This.city_id;
    if (data.tags) {
      data['query'] = data.tags.split(/[,\s]+/).map(function(tag) {return 'tag:' + tag;}).join(' ');
    }

    if (demo) { Notifier.success("Blasting email to agents!"); return go('tool='); }

    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to blast messages.");

    return $.post_with_squad('/blast_email', data, function(data){
      go('tool=');
      Notifier.success("Blasting email to " + data + " agents!");
    });
  },

  tag_agents_form_submitted: function(data) {
    var agents = Selection.agent_ids();
    if (!agents || agents.length == 0) {alert('Please select some agents to tag.'); return "redo";}
    var tags = data['tags[]'];
    if (!tags) { alert('Please provide some tags!'); return "redo"; }
    tags = tags.join(' ');

    var params = { agent_ids: agents.join(' ') };
    if (tags.startsWith('stream:')) { // hack for putting agents on a stream
      params['with_stream'] = tags.replace(/^stream:/, '');
    } else {
      params['with_tags'] = tags;
    }
    if (demo) return Demo.tag(agents, tags, function(){go('tool='); Selection.clear();});
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to tag agents.");
    return $.post_with_squad('/agents/update_all', params, function(){
      go('tool=');
      Notifier.success("Tagged agents", 'Done');
      Selection.clear();
    });
  },

  tag_remove: function(agent_ids, tag) {
    if (!demo && !App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to remove tags.");

    var r = confirm("Are you sure you want to delete the tag " + tag + "?");
    if (!r) return "redo";

    // hide the tag el
    $.each(agent_ids.split(' '), function(){ $('#' + this + tag).hide(); });

    var params = { agent_ids: agent_ids, without_tag: tag };
    return $.post_with_squad('/agents/update_all', params);
  },

  squad_settings_form_submitted: function(data) {
    if (!data.name || data.name.length == 0 || !data.desc || data.desc.length == 0) {
      alert('Please provide both a name and a description!'); return "redo";
    }
    $.post_with_squad('/me/reports', data.period ? { period: data.period } : {}, function(){
      window.squad_reports[current_stream] = data.period ? Number(data.period) : null;
    });
    return $.post_with_squad('/update', data, function(){
      if (window.stream_names) window.stream_names[current_stream] = data.name;
      window.current_stream_name = data.name;
      window.current_stream_desc = data.desc;
      go('tool=');
      $('.magic').app_paint();
    });
  },

  squad_settings_report_inputs: function() {
    var curr_period = window.squad_reports[current_stream] || null;
    var periods = [86400, 604800, null];
    var names = ['Daily', 'Weekly', 'Never'];
    if (!periods.contains(curr_period)) periods.push(curr_period);
    return periods.map(function(period, i){
      var name = names[i];
      // handle custom settings
      if (!name) {
        name = "Every " + Math.round((period*10) / (60*60*(period < 60*60*24 ? 1 : 24)))/10 +
          (period < 60*60*24 ? " hours" : " days");
      }
      var checked = curr_period == period ? 'checked' : '';
      return '<input type="radio" value="' + (period ? period : '') + '" name="period" ' + checked + '>' + name + '</input>';
    }).join(' ');
  },

  collapse_leftbar: function() {
    $('body').toggleClass('collapsed');
    google.maps.event.trigger(GM, 'resize');
  },
  

  send_a_message_to_agent_submitted: function(data) {
    if (!data.assign) {
      alert('Please provide an assignment!');
      return "redo";
    }

    if (demo) {
      return Demo.message([This.item], data.assign, function () {
        $('#send_a_message_to_agent').html('Message sent!');
      });
    } else {
      return Operation.exec(CEML.script_for('msg', data.assign), This.item, This.item, function(){
        $('#send_a_message_to_agent').html('Message sent!');
      });
    }
  },

  send_a_message_form_submitted: function(data, state, form) {
    var agents = Selection.agent_ids();

    if (!agents || agents.length == 0) {
      alert('Please select some agents first!');
      return "redo";
    }
    if (!This.city) {
      alert('Sorry, messages can only be sent in a city.');
      return "redo";
    }
    if (!data.assign) {
      alert('Please enter a message!');
      return "redo";
    }

    if (demo) {
      return Demo.message(agents, data.assign, function () {
        go('tool='); Notifier.success("Message sent!"); Selection.clear();
      });
    } else {
      return Operation.exec(CEML.script_for('msg', data.assign), agents.join(' '), agents.join(' '), function () {
        Selection.clear();
        go('tool=');
        Notifier.success('Message sent!');
      });
    }
  },

  quick_mission_title: function() {
    This.quick_title = prompt("Quick title:", This.quick_title || '');
  },

  quick_mission: function() {
    if (!This.quick_title) { alert('No title set!'); return; }
    var msg = prompt("Instructions:", This.quick_instructions || '');
    if (!msg) return;
    This.quick_instructions = msg;

    var agents = Selection.agent_ids().join(' ');
    var mission = CEML.sanitize(This.quick_title);
    var script = "\""+mission+"\"\ntell agents: "+This.quick_instructions;

    return Operation.exec(script, agents, agents);
  },

  invite_agents_form_submitted: function(data, state) {
    if (demo) {Notifier.success('Invitations sent!'); return go('tool=;mode=');}
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to invite agents.");
    // var today = (new Date()).toDateString().slice(4).toLowerCase().replace(/ /g, '_');
    // tags = 'invited_on_' + today;
    data.squad = window.current_stream;
    return $.post_with_squad('/s'+current_stream+'/invitations', data, function(){
      go('tool=');
      Notifier.success('Invitations sent!');
    });
  },

  rss_overlay: function() {
    var url = prompt("GeoRSS/KML URL:");
    if (url) {
      var layer = new google.maps.KmlLayer( url );
      layer.setMap(map);
    }
  },
  
  esri_tileset: function() {
    $.ajax({
      url: 'http://groundcrew.us/viewer_experimental/viewer.arcgislink_compressed.js',
      async: false, data: 'script'
    });
    var url = 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer';
    var agsType = new  gmaps.ags.MapType(url,{name:'ArcGIS'});
    map.mapTypes.set('arcgis', agsType);
    map.setMapTypeId('arcgis');
  },  

  go_where: function() {
    var where = prompt("Find:");
    if (!where) return;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: where }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK && results[0]) {
        go('item=' + City.closest(results[0].geometry.location));
        map.fitBounds(results[0].geometry.viewport);
      } else {
        Notifier.error('No location could be found for that address');
      }
    });
  },

  use_slow_agents: function() {
    return App.current_stream_systems().indexOf('e') >= 0;
  },

  stream_has_flag: function(flag) {
    return window.current_stream_flags && window.current_stream_flags.indexOf(flag) >= 0;
  },
  
  blast_message_flag: function() {
    return App.stream_has_flag('blast_message');
  },

  twitter_squad: function() { return App.current_stream_systems().contains('t'); },

  current_stream_systems: function() {
    if (window.demo) return 'm';
    return window.current_stream_systems || '';
  },

  image_upload_action: function() {
    return '/api/squad/' + window.current_stream + '/items/' + This.item + '?no_redirect=1&fmt=json';
  },

  image_upload_widget: function(form) {
    $("input[type='file']", form).change(function(){
      form.iframePostForm({
        post: function() {
          form.addClass('uploading');
        },
        complete: function(response) {
          try {
            eval('var x = ' + response);
            if (x && x.error) Notifier.error('Image upload failed: ' + x.error);
          } catch(e) { go.err('image upload failed'); }
          form.removeClass('uploading');
        }
      });
      form.submit();
    });
  },

  agent_picker_widget: function (agentpicker) {
    if (Selection.count() > 0) {
      $('.anyone_agentpicker', agentpicker).activate('_agentpicker');
    } else {
      $('.nearest_agentpicker', agentpicker).activate('_agentpicker');
    }
  },

  redraw_cities: function(args) {
    Map.layer_recalculate('cities');
    $('#mapnav').app_paint();
  },

  stream_role_leader: function() { return demo || window.stream_role == 'leader'; },
  stream_role_organizer: function() { return demo || window.stream_role == 'leader' || window.stream_role == 'organizer'; }
};


go.push(App);


