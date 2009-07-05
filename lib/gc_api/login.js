// login - called to specify the operator of the viewer
function login(user_info){
  This.user = user_info.tag.resource();
  if (This.user.tag == 'Person__Anon') {
    var user_item_json  = $.cookie('user_item');
    eval(user_item_json);
    This.user = user_info.tag.resource();
  }
  $.extend(This.user, user_info);
  This.user.logged_in = true;
  if (This.user.lat) Agents.add_or_update(This.user.tag, This.user);
}

function login_by_cookie(){
  if (!This.user || !This.user.logged_in) {
    var user_info = eval('('+$.cookie('user_info')+')');
    if (user_info) {
      login(user_info);
    } else {
      item(0,"Person__Anon","DemoUser");
      login({ "tag":"Person__Anon", "posx":0 });
    }
  }
  if (This.user.tag == 'Person__Anon') {
    $(function(){ $('body').addClass( 'logged_out' ); });    
  } else {
    $(function(){ $('body').addClass( 'logged_in' ); });
  }
}
