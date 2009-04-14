SHELL=/bin/bash
LANG=C


# basic builds

uncompressed: html raw_js css

compressed: html min_js css

test: BUILD css raw_js
	m4 -P tests/test.html.m4 > BUILD/test.html

html: BUILD
	m4 -P app/app.html.m4 > BUILD/viewer.html

raw_js: BUILD
	cat vendor/*.js lib/*/*.js app/*.js app/*/*.js app/*/*/*.js > BUILD/viewer.js

min_js: BUILD
	jsmin vendor/*.js lib/*/*.js app/*.js app/*/*.js app/*/*/*.js > BUILD/viewer.js

css: BUILD
	cat {css,vendor}/*.css app/{chrome,helpers,modes/*}/*.css > BUILD/viewer.css



debug: uncompressed
	cat BUILD/viewer.html | sed 's/.*maps\.google\.com.*/\<link href=\"..\/debug\/debug.css\" media=\"screen\" rel=\"stylesheet\" type=\"text\/css\" \/>/' | sed 's/http:\/\/ajax\.googleapis\.com\/ajax\/libs\/jquery\/1\.3\.1\/jquery\.min\.js/..\/vendor/jquery\/jquery\.min\.js/' > BUILD/debug.html

# deploy

deploy: compressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/

deploy_uncompressed: uncompressed
	rsync -avL BUILD/{i,viewer.*} groundcrew.us:apps/groundcrew/current/public/


# setup

grab: BUILD
	mkdir -p BUILD/data
	wget "http://groundcrew.us/auth_js?codename=$(GCUN)&password=$(GCPW)" -O BUILD/data/auth.js
	wget "http://groundcrew.us/data/vstart.js" -O BUILD/data/vstart_snapshot.js
	cat BUILD/data/{auth,vstart_snapshot}.js > BUILD/data/vstart.js

BUILD:
	mkdir -p BUILD
	(cd BUILD && ln -s ../i)

