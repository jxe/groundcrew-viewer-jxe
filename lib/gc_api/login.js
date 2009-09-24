// login - called to specify the operator of the viewer
function login(user_info){}

function login_by_cookie(){
  This.user = { tag: window.authority || 'Anon', title: 'Viewer user', posx: 38, logged_in: true };
  $(function(){ $('body').addClass( 'logged_in' ); });
}
