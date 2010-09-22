SHELL=/bin/bash
LANG=C

# basic builds

auto: uncompressed

open: uncompressed
	open -a WebKit BUILD/index.html

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

base.html:
	cd ../basetheme; make html
	cp ../basetheme/BUILD/basetool.html BUILD/

html: BUILD base.html
	m4 -P app/app.html.m4 > BUILD/index.html


# ======
# = js =
# ======

super.js:
	cd ../basetheme; make js
	cp ../basetheme/BUILD/super.js BUILD/

raw_js: BUILD super.js
	cat BUILD/super.js lib/*/*.js app/*.js app/*/*.js > BUILD/viewer.js

min_js: BUILD super.js
	cat BUILD/super.js lib/*/*.js app/*.js app/*/*.js | jsmin > BUILD/viewer.js


# =======
# = css =
# =======

base.css:
	cd ../basetheme; make css
	cp ../basetheme/BUILD/base.css BUILD/
	cp ../basetheme/i/* i/

buildcss: BUILD base.css
	cat BUILD/base.css css/*.css app/{chrome,helpers,tools}/*.css > BUILD/viewer.css


# ===========
# = actions =
# ===========

deploy: html raw_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,index.html,viewer.*,demo*.js} joe@groundcrew.us:gc/public/viewer_experimental/

stage: html raw_js buildcss
	rsync -avL --delete --exclude-from=.rsync_exclude BUILD/{i,index.html,viewer.*,demo*.js} deploy@b.groundcrew.us:/g/viewer/BUILD/


# ==========
# = random =
# ==========

local_demo_data:
	cp reference/data/demo*.js BUILD/
