System.config({
    "baseURL": "/",
    "transpiler": "6to5",
    "paths": {
        "*": "*.js",
        "github:*": "../../../jspm_packages/github/*.js",
        "npm:*": "../../../jspm_packages/npm/*.js"
    }
});

System.config({
    "map": {
        "jquery": "github:components/jquery@2.1.3",
        "loglevel": "npm:loglevel@1.2.0",
        "picturefill": "npm:picturefill@2.2.1",
        "github:jspm/nodelibs-process@0.1.1": {
            "process": "npm:process@0.10.0"
        },
        "npm:loglevel@1.2.0": {
            "process": "github:jspm/nodelibs-process@0.1.1"
        },
        "npm:picturefill@2.2.1": {
            "child_process": "github:jspm/nodelibs-child_process@0.1.0",
            "process": "github:jspm/nodelibs-process@0.1.1"
        }
    }
});


