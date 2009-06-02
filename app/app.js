This.user = false;

ViewerUI = {

  init: function() {
    // load the user data
    if (!This.user) {
      var user_info = eval('('+$.cookie('user_info')+')');
      if (user_info) login(user_info);
      else login_anonymous_demo();
    }

    // interface init
    Frame.set_flexbar_size(1);
    // setInterval(function(){ $('.from_now').update_times(); }, 20000);
    $(window).resize(function(){
      $('.divcenter').center();
      Frame.set_flexbar_size();
    });
    $('.magic').app_paint().center();
    LiveHTML.init();
    $('body').addClass( This.user.logged_in ? 'logged_in' : 'logged_out' );
    
    // starter url
    var starter_url = "/demo/welcome/leader";
    if (window.location.hash) starter_url = window.location.hash.slice(1);
    App.go(starter_url);

    // fire it up
    CEML.parse($('#idea_bank').html());
    $('body').removeClass('loading');
    Ajax.init();
  }

};
