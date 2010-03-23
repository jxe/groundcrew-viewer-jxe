<!DOCTYPE html>
<html>
<head>
	<title>Groundcrew Viewer</title>
	<link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
  <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAGqp2ukVwjWFfmC-XmCCZFRRGsPIMf82DrFSwJZKzmHDVn9CoiRSfPwbMs9LeX9Qw4ba2CuYyrEQBZw&amp;hl=&amp;indexing=true"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
  <!-- // <script src="../vendor/jquery/jquery.min.js"></script> -->
  <script>
    window.current_stream = window.location.href.split('/')[3];
    var demo = (current_stream == 'demo' || current_stream.indexOf('demo-') == 0);
    $.ajax({ async: false, url: '/api/auth.js?stream=' + window.current_stream, dataType: 'script' });
  </script>
  <script src="viewer.js"></script>
  <script>
    if (!demo) $.ajax({ async: false, url: '/api/stream.js?stream=' + window.current_stream, dataType: 'script' });
    login_by_cookie();
  </script>
</head>
<body id="viewer" class="loading">

  <div id="header" class="magic">
    m4_include(`app/chrome/header.html')
    <div id="squad_and_search_navigation">
  	  m4_include(`app/chrome/squad_selection_menu.html')
  	  m4_include(`app/chrome/search_field.html')
  	</div>
  </div>

  <div id="screen">
    m4_include(`app/chrome/facebar.html')
    m4_include(`app/chrome/selection_tools.html')
    <div id="map_div"></div>
    m4_include(`app/chrome/help_prompt.html')
    m4_include(`app/chrome/console.html')
    m4_include(`app/chrome/navigation_menus.html')
  </div>

  m4_syscmd(`cat app/tools/*.html')

  <div id="offscreen" style="display:none">
    m4_syscmd(`cat app/maplayers/*.html')
  </div>

  <script>
  if($.browser.msie) $('#unsupported').show();
  if (demo) $.getScript(current_stream + '.js', App.init);
  else $(function(){ App.init(); });
  </script>
</body>
</html>
