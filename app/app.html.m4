<!DOCTYPE html>
<html xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
	<title>Groundcrew Viewer</title>
  <script>if (window.location.protocol == 'http') document.write('<base href="http://'+window.location.host+'/viewer_experimental/">');</script>
	<link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
</head>

<body id="viewer" class="loading notcollapsed">
  <div id="header" class="magic group">
    <a id="expando" href="##collapse_leftbar">&raquo;</a>
    <div id="header_sidebar">
      <h1 fill="current_stream_name">Loading...</h1>
    </div>
    <a id="collapso" href="##collapse_leftbar">&laquo;</a>

    <form id="search_form">
      <input type="text" name="q" fill="query value" id="search" />
      <a if="query" href="##clear_query">X</a>
    </form>

    <div id="youbox" fill="youbox"></div>

    <img id="load_spinner" src="i/spinner.gif"/>
    <div id="headermenu"></div>
    <div id="soc_logins">
      <fb:login-button class="hide_until_loaded fbloo" perms="sms,email,user_location">Sign in</fb:login-button>
    </div>
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
    </div>
    m4_include(`app/chrome/console.html')
  </div>

  <!-- some offscreen stuff like templates -->
  <div id="offscreen" style="display:none">m4_syscmd(`cat app/maplayers/*.html')</div>
  <div id="screen"></div>
  <div id="fb-root"></div>

  <script src="http://maps.google.com/maps/api/js?sensor=false"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
  <script src="viewer.js"></script>
  <script> App.initialize(); </script>
  <script async="true" src="http://connect.facebook.net/en_US/all.js"></script>
</body>
</html>
