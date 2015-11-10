System.config({
    "baseURL": "./",
    "defaultJSExtensions": true,
    "transpiler": "babel",
    "babelOptions": {
        "optional": [
            "runtime",
            "optimisation.modules.system"
        ]
    },
    "paths": {
        "*": "app/Resources/public/*",
        "github:*": "../../../jspm_packages/github/*.js",
        "npm:*": "../../../jspm_packages/npm/*.js"
    }
});

System.config({
    "map": {
        "babel": "npm:babel-core@5.8.25",
        "babel-runtime": "npm:babel-runtime@5.8.25",
        "core-js": "npm:core-js@1.2.1",
        "jquery": "github:components/jquery@2.1.4",
        "loglevel": "npm:loglevel@1.4.0",
        "picturefill": "npm:picturefill@3.0.1",
        "github:jspm/nodelibs-assert@0.1.0": {
            "assert": "npm:assert@1.3.0"
        },
        "github:jspm/nodelibs-process@0.1.2": {
            "process": "npm:process@0.11.2"
        },
        "github:jspm/nodelibs-util@0.1.0": {
            "util": "npm:util@0.10.3"
        },
        "npm:assert@1.3.0": {
            "util": "npm:util@0.10.3"
        },
        "npm:babel-runtime@5.8.25": {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:core-js@1.2.1": {
            "fs": "github:jspm/nodelibs-fs@0.1.2",
            "process": "github:jspm/nodelibs-process@0.1.2",
            "systemjs-json": "github:systemjs/plugin-json@0.1.0"
        },
        "npm:inherits@2.0.1": {
            "util": "github:jspm/nodelibs-util@0.1.0"
        },
        "npm:process@0.11.2": {
            "assert": "github:jspm/nodelibs-assert@0.1.0"
        },
        "npm:util@0.10.3": {
            "inherits": "npm:inherits@2.0.1",
            "process": "github:jspm/nodelibs-process@0.1.2"
        },<% if (useBootstrap) { %>
        "bootstrap": "github:twbs/bootstrap@3.3.4",<% } else if (useFoundation) { %>
        "foundation": "github:zurb/bower-foundation@5.5.1",<% } else if (useUikit) { %>
        "uikit": "github:uikit/uikit@2.18.0",<% } %>
        "npm:loglevel@1.4.0": {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:picturefill@3.0.1": {
            "child_process": "github:jspm/nodelibs-child_process@0.1.0",
            "process": "github:jspm/nodelibs-process@0.1.2"
        }
    }
});
