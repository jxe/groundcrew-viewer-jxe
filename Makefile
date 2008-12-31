SHELL=/bin/bash

uncompressed: html_and_css
	cat {vendor,data}/*.js {src,apps}/*/*.js > BUILD/viewer.js
	cp pages/localauth.html BUILD/

compressed: html_and_css
	cat {vendor,data}/*.js {src,apps}/*/*.js | jsmin > BUILD/viewer.js

html_and_css: BUILD
	cat pages/viewer.html {src/viewer,apps}/**/*.html pages/viewer_end.html > BUILD/viewer.html
	cat {vendor,css}/*.css src/viewer/widgets/*.css apps/*/*.css > BUILD/viewer.css

BUILD:
	mkdir -p BUILD
	(cd BUILD && ln -s ../i)

deploy: compressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/

deploy_uncompressed: uncompressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/

grab: BUILD
	mkdir -p BUILD/data
	wget "http://groundcrew.us/data/vstart.js" -O BUILD/data/vstart.js
