build:
	rm -rf dist
	tsc
	mv -f dist/src/* dist/
	rm -rf dist/src

test:
	npx jest

publish:
	npm publish
