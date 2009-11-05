SHELL=/bin/bash
LANG=C

# basic builds

uncompressed: html raw_js buildcss

test: BUILD buildcss raw_js
	m4 -P tests/test.html.m4 > BUILD/test.html

raw_js: BUILD
	cat lib/*/*.js app/*.js app/*/*.js > BUILD/viewer.js

min_js: BUILD
	cat lib/*/*.js app/*.js app/*/*.js | jsmin > BUILD/viewer.js

buildcss: BUILD
	cat css/*.css app/{chrome,helpers}/*.css > BUILD/viewer.css


# versions

deploy: html raw_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,index.html,viewer.*,demostart.js} joe@groundcrew.us:gc/public/viewer/

html: BUILD
	m4 -P app/app.html.m4 > BUILD/index.html

deploy_twitter: html min_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,viewer.*} joe@groundcrew.us:gc/gvs/twitter/

gcapi:
	cat lib/{jsappkit,gc_api}/*.js  | jsmin > BUILD/gcapi.js

gcapi_transplant: gcapi
	cp BUILD/gcapi.js /g/static/site/js/gcapi.js

local_demo_data:
	cp reference/data/vstart-demo.js BUILD/demo.js


# setup

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

