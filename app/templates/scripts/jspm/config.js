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