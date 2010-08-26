SHELL=/bin/bash
LANG=C

# basic builds

auto: uncompressed

BUILD/base.css: BUILD basetheme/css/*
	cd basetheme; make css
	cp basetheme/BUILD/base.css BUILD/
	cp basetheme/i/* i/

BUILD/base.js: BUILD basetheme/js/* basetheme/gojs/go.js
	cd basetheme; make js
	cp basetheme/BUILD/base.js BUILD/

BUILD:
	mkdir -p BUILD
	(cd BUILD && ln -s ../i)


# ============
# = versions =
# ============

uncompressed: html raw_js buildcss


# ========
# = html =
# ========

html: BUILD
	m4 -P app/app.html.m4 > BUILD/index.html


# ======
# = js =
# ======

raw_js: BUILD/base.js
	cat BUILD/base.js lib/*/*.js app/*.js app/*/*.js > BUILD/viewer.js

min_js: BUILD/base.js
	cat BUILD/base.js lib/*/*.js app/*.js app/*/*.js | jsmin > BUILD/viewer.js


# =======
# = css =
# =======

buildcss: BUILD/base.css
	cat BUILD/base.css css/*.css app/{chrome,helpers,tools}/*.css > BUILD/viewer.css


# ===========
# = actions =
# ===========

deploy: html raw_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,index.html,viewer.*,demo*.js} joe@groundcrew.us:gc/public/viewer_experimental/


# ==========
# = random =
# ==========

local_demo_data:
	cp reference/data/demo*.js BUILD/
