build:
	rm -rf dist
	tsc
	mv -f dist/src/* dist/
	rm -rf dist/src

test:
	jest

publish:
	npm publish
