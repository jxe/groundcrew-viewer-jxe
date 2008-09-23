uncompressed: html_and_css
	cat {vendor,lib}/*.js src/*/*.js > dist/viewer.js

compressed: html_and_css
	cat {vendor,lib}/*.js src/*/*.js | jsmin > dist/viewer.js

html_and_css:
	mkdir -p dist
	cat src/*/*.html > dist/viewer.html
	cat lib/*.css vendor/*.css src/*/*.css > dist/viewer.css

deploy: compressed
	rsync -av dist/ groundcrew.us:apps/groundcrew/current/public/
