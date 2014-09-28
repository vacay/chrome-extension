define release
    VERSION=`node -pe "require('./manifest.json').version"` && \
    NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
    node -e "\
        var j = require('./package.json');\
        j.version = \"$$NEXT_VERSION\";\
        var s = JSON.stringify(j, null, 4);\
        require('fs').writeFileSync('./package.json', s);" && \
    node -e "\
        var j = require('./bower.json');\
        j.version = \"$$NEXT_VERSION\";\
        var s = JSON.stringify(j, null, 4);\
        require('fs').writeFileSync('./bower.json', s);" && \
    node -e "\
        var j = require('./manifest.json');\
        j.version = \"$$NEXT_VERSION\";\
        var s = JSON.stringify(j, null, 4);\
        require('fs').writeFileSync('./manifest.json', s);" && \
    git commit -m "Version $$NEXT_VERSION" -- package.json manifest.json bower.json && \
    git tag "$$NEXT_VERSION" -m "Version $$NEXT_VERSION"
endef

install:
	npm install
	bower install

release-patch:
	@$(call release,patch)

release-minor:
	@$(call release,minor)

release-major:
	@$(call release,major)

push:
	git push
	git push --tags origin HEAD:master

build: push
	grunt production
	zip -r dist.zip dist
