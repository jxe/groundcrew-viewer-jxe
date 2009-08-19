SHELL=/bin/bash
LANG=C

# basic builds

uncompressed: html raw_js buildcss

compressed: html min_js buildcss

test: BUILD buildcss raw_js
	m4 -P tests/test.html.m4 > BUILD/test.html

html: BUILD
	m4 -P app/app.html.m4 > BUILD/viewer.html

raw_js: BUILD
	cat lib/*/*.js app/*.js app/*/*.js > BUILD/viewer.js

min_js: BUILD
	cat lib/*/*.js app/*.js app/*/*.js | jsmin > BUILD/viewer.js

buildcss: BUILD
	cat css/*.css app/{chrome,helpers}/*.css > BUILD/viewer.css



debug: uncompressed
	cat BUILD/viewer.html | sed 's/.*maps\.google\.com.*/\<link href=\"..\/debug\/debug.css\" media=\"screen\" rel=\"stylesheet\" type=\"text\/css\" \/>/' | sed 's/http:\/\/ajax\.googleapis\.com\/ajax\/libs\/jquery\/1\.3\.1\/jquery\.min\.js/..\/vendor/jquery\/jquery\.min\.js/' > BUILD/debug.html

# deploy

deploy_twitter: compressed
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,viewer.*} joe@groundcrew.us:gc/gvs/twitter/

deploy_demo: compressed
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,viewer.*,demostart.js} joe@groundcrew.us:gc/gv/

# deploy_uncompressed: uncompressed
#   rsync -avL BUILD/{i,viewer.*} joe@groundcrew.us:apps/groundcrew/current/public/
# 

# setup

grab: BUILD
	mkdir -p BUILD/data
	wget "http://groundcrew.us/auth_js?codename=$(GCUN)&password=$(GCPW)" -O BUILD/data/auth.js
	wget "http://groundcrew.us/data/vstart.js" -O BUILD/data/vstart_snapshot.js
	cat BUILD/data/{auth,vstart_snapshot}.js > BUILD/data/vstart.js

BUILD:
	mkdir -p BUILD
	(cd BUILD && ln -s ../i)

