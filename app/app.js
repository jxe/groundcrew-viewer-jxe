var CurrentUser = false;

ViewerUI = {

  init: function() {
    Frame.set_flexbar_size(1);
    // load the user data
    if (!CurrentUser) {
      var user_info = eval('('+$.cookie('user_info')+')');
      if (!user_info) window.location.replace('/auth');
      login(user_info);
    }

    this.activateUI();
    var starter_url = "/welcome/beginner";
    if (CurrentUser.logged_in) {
      Agents.add_or_update(CurrentUser);
      $('body').addClass('logged_in');
      // starter_url = '/hero/City__' + CurrentUser.city_id;
    } else {
      $('body').addClass('logged_out');
    }
    if (window.location.hash) starter_url = window.location.hash.slice(1);
    Viewer.go(starter_url);
    $('body').removeClass('loading');
    Ajax.init();
    $('#you_img').attr('src', "http://groundcrew.us"+CurrentUser.thumb_url);
    $('#agent_name').html(CurrentUser.title);
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
