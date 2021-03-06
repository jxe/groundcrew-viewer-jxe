<!DOCTYPE html>
<html xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
	<title>Groundcrew Viewer</title>
  <script>if (window.location.protocol == 'http:') document.write('<base href="http://'+window.location.host+'/viewer_experimental/">');</script>
	<link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
</head>

<body id="viewer" class="loading collapsed">
  <div id="header" class="magic group">
    <a id="expando" href="##collapse_leftbar">&raquo;</a>
    <div id="header_sidebar">
      <h1 fill="current_stream_name">Loading...</h1>
    </div>
    <a id="collapso" href="##collapse_leftbar">&laquo;</a>

    <form id="search_form" class="compact_dropdowns">
      <input type="search" name="q" hint="Search agents" fill="query value" id="search" class="hide_until_loaded" observe="query_watcher"/>
      <a if="query" href="##clear_query" class="hide_until_loaded"><img src="i/clear_query.png"></a>

      <div class="button_dropdown" id="tags">
        <button type="button" class="idle">Tags <span style="font-size: 9px;">&#9660;</span></button>
        <div class="dropdown south east no_filter no_more">
          <div class="select"><ul fill="tags_as_lis"></ul></div>
        </div>
      </div>

    </form>

    <div id="soc_logins" class="hide_until_loaded">
      <span class="loo"><a href="#tool=login">Login</a></span>
      <span class="lio">
        <a href="##go_home" fill="user_name"></a> &middot; <a href="##logout">Logout</a>
      </span>
    </div>

    <div id="youbox" fill="youbox_text"></div>
    <img id="load_spinner" src="i/spinner.gif"/>
  </div>
  m4_include(`app/chrome/sidebar.html')

  <!-- tool consists of the facebar, the map, and the console -->
  <div id="tool">
    m4_include(`app/chrome/facebar.html')
    <div id="map">
      <div id="fog"></div>
      <div id="gmap"></div>
      <!-- we put some stuff on top of the gmap -->
      m4_include(`app/chrome/selection_tools.html')
      m4_include(`app/chrome/mapnav.html')
      m4_include(`app/chrome/help_prompt.html')
      m4_syscmd(`cat app/tools/*.html')
      m4_syscmd(`cat BUILD/basetool.html')
    </div>
    m4_include(`app/chrome/console.html')
  </div>

  <!-- some offscreen stuff like templates -->
  <div id="offscreen" style="display:none">m4_syscmd(`cat app/maplayers/*.html')</div>
  <div id="screen"></div>
  <div id="fb-root"></div>
  <script src="http://connect.facebook.net/en_US/all.js"></script>
  <script>
    FB.init({appId: '31986400134', apiKey: 'cbaf8df3f5953bdea9ce66f77c485c53', cookie: true, xfbml: true});
  </script>
  <script src="http://maps.google.com/maps/api/js?sensor=false"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
  <script src="viewer.js"></script>
  <script> App.initialize(); </script>
</body>
</html>
