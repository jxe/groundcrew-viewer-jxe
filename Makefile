SHELL=/bin/bash
LANG=C

# bash doesn't know **/*, so we need find
COMPS = $(shell find components -name "*.html")

# main tasks

uncompressed: html_and_css
	cat {vendor,data}/*.js {src,components}/*/*.js > BUILD/viewer.js
	cp pages/localauth.html BUILD/

compressed: html_and_css
	cat {vendor,data}/*.js {src,components}/*/*.js | jsmin > BUILD/viewer.js

deploy: compressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/

deploy_uncompressed: uncompressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/

grab: BUILD
	mkdir -p BUILD/data
	wget "http://groundcrew.us/auth_js?codename=$(GCUN)&password=$(GCPW)" -O BUILD/data/auth.js
	wget "http://groundcrew.us/data/vstart.js" -O BUILD/data/vstart_snapshot.js
	cat BUILD/data/{auth,vstart_snapshot}.js > BUILD/data/vstart.js

# building blocks

BUILD:
	mkdir -p BUILD
	(cd BUILD && ln -s ../i)

html_and_css: BUILD
	cat pages/viewer.html $(COMPS) pages/viewer_end.html > BUILD/viewer.html
	cat {vendor,css}/*.css components/*/*.css > BUILD/viewer.css
