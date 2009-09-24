SHELL=/bin/bash
LANG=C

# basic builds

uncompressed: html_demo raw_js buildcss

test: BUILD buildcss raw_js
	m4 -P tests/test.html.m4 > BUILD/test.html

raw_js: BUILD
	cat lib/*/*.js app/*.js app/*/*.js > BUILD/viewer.js

min_js: BUILD
	cat lib/*/*.js app/*.js app/*/*.js | jsmin > BUILD/viewer.js

buildcss: BUILD
	cat css/*.css app/{chrome,helpers}/*.css > BUILD/viewer.css


# versions

html: BUILD
	m4 -P -DVIEWER_INITIAL_JS='/api/stream.js' app/app.html.m4 > BUILD/viewer.html

html_noho: BUILD
	m4 -P -DVIEWER_INITIAL_JS='/api/stream.js?stream=noho' app/app.html.m4 > BUILD/viewer.html

html_demo: BUILD
	m4 -P -DVIEWER_INITIAL_JS='demostart.js' app/app.html.m4 > BUILD/viewer.html

deploy_twitter: html min_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,viewer.*} joe@groundcrew.us:gc/gvs/twitter/

deploy_noho: html_noho raw_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,viewer.*} joe@groundcrew.us:gc/gvs/noho/

deploy_demo: html_demo min_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,viewer.*,demostart.js} joe@groundcrew.us:gc/gv/

gcapi:
	cat lib/{jsappkit,gc_api}/*.js  | jsmin > BUILD/gcapi.js

gcapi_transplant: gcapi
	cp BUILD/gcapi.js /g/static/site/js/gcapi.js





# setup

grab: BUILD
	mkdir -p BUILD/data
	wget "http://groundcrew.us/auth_js?codename=$(GCUN)&password=$(GCPW)" -O BUILD/data/auth.js
	wget "http://groundcrew.us/data/vstart.js" -O BUILD/data/vstart_snapshot.js
	cat BUILD/data/{auth,vstart_snapshot}.js > BUILD/data/vstart.js

BUILD:
	mkdir -p BUILD
	(cd BUILD && ln -s ../i)





# old stuff

# debug: uncompressed
#   cat BUILD/viewer.html | sed 's/.*maps\.google\.com.*/\<link href=\"..\/debug\/debug.css\" media=\"screen\" rel=\"stylesheet\" type=\"text\/css\" \/>/' | sed 's/http:\/\/ajax\.googleapis\.com\/ajax\/libs\/jquery\/1\.3\.1\/jquery\.min\.js/..\/vendor/jquery\/jquery\.min\.js/' > BUILD/debug.html

# deploy

# deploy_uncompressed: uncompressed
#   rsync -avL BUILD/{i,viewer.*} joe@groundcrew.us:apps/groundcrew/current/public/
# 

