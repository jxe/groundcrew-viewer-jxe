default: html css js

compressed: html css jsmin

html:
	cat src/*/*.html > ../app/views/gc_viewer_view_html.html
	cat test/viewer_head.html ../app/views/gc_viewer_view_html.html test/viewer_data.html > build/viewer.html

css:
	cat ../public/{stylesheets,facebox}/*.css src/*/*.css > ../public/c/viewer.css

js:
	cat {vendor,lib}/*.js src/*/*.js > ../public/c/viewer.js
	cp lib/gclib.js ../public/c/gclib.js

jsmin:
	cat {vendor,lib}/*.js src/*/*.js | jsmin > ../public/c/viewer.js
	cat lib/gclib.js | jsmin > ../public/c/gclib.js
