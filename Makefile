install:
	npm install
	mkdir -p ./src

init-css:
	yes | cp ./_templates/css/* ./src/

init-cssjs:
	yes | cp ./_templates/cssjs/* ./src/

init-medium:
	yes | cp ./_templates/medium/* ./src/

init-preact:
	yes | cp ./_templates/preact/* ./src/

init-canvas2d:
	yes | cp ./_templates/canvas2d/* ./src/

init-three:
	yes | cp ./_templates/three/* ./src/

check:
	npx html-validator ./src/index.html
	npx stylelint ./src/style.css
	npx doiuse ./src/style.css
	npx eslint ./src/script.js

watch:
	npx browser-sync start --server ./src --no-inject-changes & \
	while true; do \
		npx browser-sync reload; \
		inotifywait -qre close_write ./src; \
	done

clean:
	rm -rf ./node_modules/

