<!DOCTYPE html>
<html>
<head>
	<title>Groundcrew Viewer</title>
	<link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
  <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAGqp2ukVwjWFfmC-XmCCZFRRGsPIMf82DrFSwJZKzmHDVn9CoiRSfPwbMs9LeX9Qw4ba2CuYyrEQBZw&amp;hl=&amp;indexing=true"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
  <script>
    window.current_stream = window.location.href.split('/')[3];
    if (window.location.protocol == 'file:') window.current_stream = 'demo';
    var demo = (current_stream == 'demo' || current_stream.indexOf('demo-') == 0);
    $.ajax({ async: false, url: '/api/auth.js?stream=' + window.current_stream, dataType: 'script' });
  </script>
  <script src="viewer.js"></script>
  <script>
    if (!demo) $.ajax({ async: false, url: '/api/stream.js?stream=' + window.current_stream, dataType: 'script' });
    login_by_cookie();
  </script>
</head>

<body id="viewer" class="loading notcollapsed">
  <h1>Oil Spill Volunteering</h1>
  m4_include(`app/chrome/sidebar.html')

  m4_include(`app/chrome/header.html')
  m4_include(`app/chrome/branding.html')

  <!-- the main block is the main, chrome-y part of the viewer -->
  <!-- it consists of the facebar, the map, and the console -->
  <div id="tool">
    m4_include(`app/chrome/facebar.html')
    <div id="map">
      <div id="gmap"></div>
      <!--> we put some stuff on top of the gmap <-->
      m4_include(`app/chrome/selection_tools.html')
      m4_include(`app/chrome/mapnav.html')
      m4_include(`app/chrome/help_prompt.html')
    </div>
    m4_include(`app/chrome/console.html')
  </div>

  <!-- some offscreen stuff like templates -->
  m4_syscmd(`cat app/tools/*.html')
  <div id="offscreen" style="display:none">m4_syscmd(`cat app/maplayers/*.html')</div>
  <div id="screen"></div>

  <div id="offscreen" style="display:none">
    m4_syscmd(`cat app/maplayers/*.html')
  </div>

  <script>
  if($.browser.msie) $('#unsupported').show();
  if (demo) {
    // try to load the static demo stream
    $.ajax({ async: false, url: current_stream + '.js', dataType: 'script', success: App.init,
      // if there's no static demo stream, try to load a real stream for demo data
      error: function() {
        var base_stream = current_stream.replace(/^demo-/, '');
        if (base_stream.length > 0) {
          $.ajax({ async: false, url: '/api/stream.js?stream=' + base_stream, dataType: 'script',
            success: App.init,
            // if there's still no stream, fail + alert the user
            error: function() {
              $('#loading_data').remove();
              $('#loading_data_failed').show();
            }
          });
        }
      }});

  }
  else $(function(){ App.init(); });
  </script>
</body>
</html>
