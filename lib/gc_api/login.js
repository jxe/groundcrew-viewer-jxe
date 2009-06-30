// login - called to specify the operator of the viewer
function login(user_info){
  This.user = user_info.tag.resource();
  if (!This.user) {
    var user_item_json  = $.cookie('user_item');
    eval(user_item_json);
    This.user = user_info.tag.resource();
  }
  $.extend(This.user, user_info);
  This.user.logged_in = true;
  if (This.user.lat) Agents.add_or_update(This.user.tag, This.user);
}

function login_by_cookie(){
  var user_info = eval('('+$.cookie('user_info')+')');
  if (user_info) {
    login(user_info);
    $(function(){ $('body').addClass( 'logged_in' ); });
  } else {
    item(0,"Person__Anon","DemoUser");
    login({ "tag":"Person__Anon", "posx":0 });
    $(function(){ $('body').addClass( 'logged_out' ); });
  }
}
