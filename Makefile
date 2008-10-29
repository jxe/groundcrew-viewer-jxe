uncompressed: html_and_css
	cat {vendor,lib}/*.js src/*/*.js > dist/viewer.js

compressed: html_and_css
	cat {vendor,lib}/*.js src/*/*.js | jsmin > dist/viewer.js

html_and_css: dist
	cat src/*/*.html > dist/viewer.html
	cat lib/*.css vendor/*.css src/*/*.css > dist/viewer.css

dist:
	mkdir -p dist
	(cd dist && ln -s ../i)

deploy: compressed
	rsync -av dist/viewer.* groundcrew.us:apps/groundcrew/current/public/
	rsync -av i/ groundcrew.us:apps/groundcrew/current/public/i/

deploy_uncompressed: uncompressed
	rsync -av dist/ groundcrew.us:apps/groundcrew/current/public/

grab:
	mkdir -p dist/gc
	wget "http://groundcrew.us/gc/viewer_start.js?codename=$(GCUN)&password=$(GCPW)" -O dist/gc/viewer_start.js
