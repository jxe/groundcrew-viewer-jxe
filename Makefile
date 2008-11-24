uncompressed: html_and_css
	cat {vendor,data}/*.js {src,src_apps}/*/*.js > BUILD/viewer.js

compressed: html_and_css
	cat {vendor,data}/*.js {src,src_apps}/*/*.js | jsmin > BUILD/viewer.js

html_and_css: BUILD
	cat src/*/*.html src_apps/*/widgets/*.html > BUILD/viewer.html
	cat vendor/*.css src/*/*.css src_apps/*/widgets/*.css > BUILD/viewer.css

BUILD:
	mkdir -p BUILD
	(cd BUILD && ln -s ../i)

deploy: compressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/

deploy_uncompressed: uncompressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/

grab:
	mkdir -p BUILD/gc
	wget "http://groundcrew.us/gc/viewer_start.js?codename=$(GCUN)&password=$(GCPW)" -O BUILD/gc/viewer_start.js
