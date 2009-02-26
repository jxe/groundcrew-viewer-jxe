var agent_tag;
var person_item;

ViewerUI = {
  
  init: function() {
    Frame.set_flexbar_size(1);
    // load the user data
    if (!person_item) {
      var user_item_json  = $.cookie('user_item');
      if (!user_item_json) window.location.replace('/auth');
      eval(user_item_json);
      var user_info = eval('('+$.cookie('user_info')+')');
      login(user_info);
    }
    
    this.activateUI();
    var starter_url = "/welcome/beginner";
    if (logged_in) {
      Agents.add_or_update(person_item);
      $('body').addClass('logged_in');
      // starter_url = '/hero/City__' + person_item.city_id;
    } else {
      $('body').addClass('logged_out');
    }
    if (window.location.hash) starter_url = window.location.hash.slice(1);
    Viewer.go(starter_url);
    $('body').removeClass('loading');
    Ajax.init();
    $('#you_img').attr('src', "http://groundcrew.us"+person_item.thumb_url);
    $('#agent_name').html(person_item.title);
  },
  
  activateUI: function() {    
    $('a[rel*=facebox]').facebox();
    setInterval(function(){ $('.from_now').update_times(); }, 20000);
    $(window).resize(function(){
      $('.divcenter').center();
      Frame.set_flexbar_size();
    });
    $('.magic').app_paint();
    LiveHTML.init();
  }

};
