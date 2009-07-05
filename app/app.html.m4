<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
<head>
	<title>Groundcrew Viewer - Tell us what to do</title>
	<link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
  
  <script src="http://maps.google.com/maps?file=api&amp;v=2.x&amp;key=ABQIAAAAGqp2ukVwjWFfmC-XmCCZFRRGsPIMf82DrFSwJZKzmHDVn9CoiRSfPwbMs9LeX9Qw4ba2CuYyrEQBZw&amp;hl=" type="text/javascript"></script> 
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js" type="text/javascript"></script>
  <script src="viewer.js" type="text/javascript"></script>
	<!--[if lte IE 6]>
	<script type="text/javascript" src="/javascripts/supersleight-min.js"></script>
	<![endif]-->
  <script src="data/vstart.js" type="text/javascript"></script>
  <script> login_by_cookie(); </script>
</head>
<body id="viewer" class="loading">
<div id="unsupported">
  Internet Explorer has not been tested.  Try <a href="http://getfirefox.com">Firefox</a>.
</div>

<div id="header" class="magic">
  <div id="header_menubar">
		<img id="load_spinner" src="i/spinner.gif"/>
		<a class="m_item" reveal="help">HELP</a>
		<a class="m_item" target="_" href="http://groups.google.com/group/groundcrew-users">discuss</a>
		<a class="m_item loo" href="/login">log in</a>
		<a class="m_item lio" href="/settings" id="settings">settings</a>
		<a class="m_item lio" href="/logout">sign out</a>
	</div>
	<span id="logo"><strong>Groundcrew</strong></span>
	<form id="squad_nav_form">
	  <div class="button_dropdown">
      <button class="idle">Demo Squad &#9662;</button>
      <div class="dropdown south no_filter no_more">
        <div class="select">
          <ul>
            <li>You have no other squads available.</li>
           </ul>
        </div>
        <div class="more">
          <a href="">Edit items&hellip;</a>
        </div>
      </div>
    </div>
	  <!-- <a id="squad-nav" reveal="squads_menu #cities_menu_place subm" title="switch squads">
	         Demo Squad &#9662;
	      </a> -->
    <input type="text" name="q" fill="query value" id="search" />
    <a if="query" href="##clear_query">(X)</a>
    <!-- <img href="#@" src="i/icons/globe.png" height="15" style="position:relative; top:2px"/> -->
    <!-- <a reveal="cities_menu #cities_menu_place subm" title="switch cities">
      <span fill="city_name"></span> &#9662;
    </a> -->
	</form>
	<span id="cities_menu_place"></span>
	<div id="youbox" class="lio magic" href="##go_to_self">
    You've been involved in <b fill="self_posx_pts">48</b> positive experiences.
    <!-- <b fill="agents_count">0</b> agents are giving you their attention and readiness. -->
    <!-- <img reveal="share_palette" src="i/icons/gift23.png" style="height: 18px; position: relative; top:5px; left: 5px" title="free stuff"/> -->
  </div>
</div>
<div id="screen">
  <div id="flexbar_banner">
    <img class="flexbar-nav" style="position: absolute; top: 15px; left:  3px" src="i/arrows/lw.png"  scrolll="#flexbar"/>
    <img class="flexbar-nav" style="position: absolute; top: 15px; right: 3px" src="i/arrows/rw.png" scrollr="#flexbar"/>
  	<!-- <img reveal="people_palette" src="i/icons/people_icon35.png" title="see available agents" style="position: absolute; right: 5px; bottom: 1px"/> -->
    
    <div id="flexbar">
      <div id="agents">
        <div id="neglected_agents">
          <div id="neglected_agent_thumbs"></div>
          <h2>neglected</h2>
        </div>
        <div id="ready_agents">
          <div id="ready_agent_thumbs"></div>
          <h2>ready</h2>
        </div>
        <div id="assigned_agents">
          <div id="assigned_agent_thumbs"></div>
          <h2>assigned</h2>
        </div>
        <div id="available_agents">
          <div id="available_agent_thumbs"></div>
          <h2>available</h2>
        </div>
        <div id="inaccessible_agents">
          <div id="inaccessible_agent_thumbs"></div>
          <h2>inaccessible</h2>
        </div>
      </div>
    </div>
  </div>
  <div id="group_actions" class="divcenter" style="display:none">
    &uarr; 
    <a href="#//ops/:city">DEPLOY SELECTED AGENTS</a>
    (<a href="##clear_selection">x</a>) 
    &uarr;
  </div>
  <div id="map_div"></div>
  <div id="floaty">
    <span id="floaty_asterisk">*</span>
    Click anywhere on the map to add a landmark.
  </div>
  <div id="console" class="startupmagic">
    <div id="modetray" class="tray">
      <div id="tray_buttons" fill="tool_buttons"></div>
    </div>

    <div id="mode_buttons" style="padding-left: 30px" fill="mode_buttons"></div>
  </div>
  <div id="objects_nav" class="magic">
    <!-- start: cities button_dropdown -->
    <div class="button_dropdown">
      <button class="idle">Cities</button>
      <div class="dropdown north no_filter no_more columns_3">
        <div class="filter">
          <input type="text" class="filter" />
        </div>
        <div class="select" fill="cities_dropdown" style="height: 400px"></div>
        <div class="more">
          <a href="">Edit items&hellip;</a>
        </div>
      </div>
    </div>
    <!-- end: cities button_dropdown -->
    |
    <!-- start: operations button_dropdown -->
    <div class="button_dropdown">
      <button class="idle">Operations</button>
      <div class="dropdown north no_filter no_more">
        <div class="filter">
          <input type="text" class="filter" />
        </div>
        <div class="select" style="height: 400px">
          <!-- put ul or dl with selection options here -->
        </div>
        <div class="more">
          <a href="">Edit items&hellip;</a>
        </div>
      </div>
    </div>
    <!-- end: operations button_dropdown -->
    |
    <!-- start: landmarks button_dropdown -->
    <div class="button_dropdown">
      <button class="idle">Landmarks</button>
      <div class="dropdown north no_filter no_more columns_3">
        <div class="filter">
          <input type="text" class="filter" />
        </div>
        <div class="select" fill="landmark_dropdown" style="height: 400px"></div>
        <div class="more">
          <a href="">Edit items&hellip;</a>
        </div>
      </div>
    </div>
    <!-- end: landmarks button_dropdown -->
    |
    <!-- start: resources button_dropdown -->
    <!-- <div class="button_dropdown">
      <button id="btn-resources" class="idle">Resources</button>
      <div class="dropdown north no_filter no_more">
        <div class="filter">
          <input type="text" class="filter" />
        </div>
        <div class="select">
        </div>
        <div class="more">
          <a href="">Edit items&hellip;</a>
        </div>
      </div>
    </div> -->
    <!-- end: resources button_dropdown -->
  </div>
</div>

m4_syscmd(`cat app/tools/*.html')

<div id="offscreen" style="display:none">
<script>
if($.browser.msie) $('#unsupported').show();
$(function(){App.init()});
</script>

m4_syscmd(`cat app/{chrome,templates}/*.html app/modes/*/*.html')

<div id="idea_bank" class="hidden">
m4_syscmd(`cat app/ideas.ceml')
</div>

</div>
</body>
</html>
