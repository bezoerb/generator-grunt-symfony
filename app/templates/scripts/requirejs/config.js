/* jshint -W098,-W079 */
var require = {
    baseUrl: '/bower_components',
    paths: {
        main: '../app/Resources/public/scripts/main',
        app: '../app/Resources/public/scripts/app',
        modules: '../app/Resources/public/scripts/modules',
        jquery: 'jquery/dist/jquery',
        'visionmedia-debug': 'visionmedia-debug/dist/debug'<% if (useFoundation) { %>,
        foundation: 'foundation-sites/dist/foundation'<% } else if (useBootstrap && !useSass) { %>,
        bootstrap: 'bootstrap/dist/js/bootstrap',
        'bootstrap/affix': 'bootstrap/js/affix',
        'bootstrap/alert': 'bootstrap/js/alert',
        'bootstrap/button': 'bootstrap/js/button',
        'bootstrap/carousel': 'bootstrap/js/carousel',
        'bootstrap/collapse': 'bootstrap/js/collapse',
        'bootstrap/dropdown': 'bootstrap/js/dropdown',
        'bootstrap/modal': 'bootstrap/js/modal',
        'bootstrap/popover': 'bootstrap/js/popover',
        'bootstrap/scrollspy': 'bootstrap/js/scrollspy',
        'bootstrap/tab': 'bootstrap/js/tab',
        'bootstrap/tooltip': 'bootstrap/js/tooltip',
        'bootstrap/transition': 'bootstrap/js/transition'<% } else if (useBootstrap) { %>,
        bootstrap: 'bootstrap-sass-official/assets/javascripts/bootstrap',
        'bootstrap/affix': 'bootstrap-sass-official/assets/javascripts/bootstrap/affix',
        'bootstrap/alert': 'bootstrap-sass-official/assets/javascripts/bootstrap/alert',
        'bootstrap/button': 'bootstrap-sass-official/assets/javascripts/bootstrap/button',
        'bootstrap/carousel': 'bootstrap-sass-official/assets/javascripts/bootstrap/carousel',
        'bootstrap/collapse': 'bootstrap-sass-official/assets/javascripts/bootstrap/collapse',
        'bootstrap/dropdown': 'bootstrap-sass-official/assets/javascripts/bootstrap/dropdown',
        'bootstrap/modal': 'bootstrap-sass-official/assets/javascripts/bootstrap/modal',
        'bootstrap/popover': 'bootstrap-sass-official/assets/javascripts/bootstrap/popover',
        'bootstrap/scrollspy': 'bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy',
        'bootstrap/tab': 'bootstrap-sass-official/assets/javascripts/bootstrap/tab',
        'bootstrap/tooltip': 'bootstrap-sass-official/assets/javascripts/bootstrap/tooltip',
        'bootstrap/transition': 'bootstrap-sass-official/assets/javascripts/bootstrap/transition'<% } %>
    },
    shim: {<% if (useUikit) { %>
        uikit: ['jquery']<% } else if (useFoundation) { %>
        foundation: { exports: 'Foundation', deps: [ 'jquery' ] }<% } else if (useBootstrap) { %>
        bootstrap: { exports: '$', deps: ['jquery'] },
        'bootstrap/affix': { exports: '$.fn.affix', deps: ['jquery'] },
        'bootstrap/alert': { exports: '$.fn.alert', deps: ['jquery'] },
        'bootstrap/button': { exports: '$.fn.button', deps: ['jquery'] },
        'bootstrap/carousel': { exports: '$.fn.carousel', deps: ['jquery'] },
        'bootstrap/collapse': { exports: '$.fn.collapse', deps: ['jquery'] },
        'bootstrap/dropdown': { exports: '$.fn.dropdown', deps: ['jquery'] },
        'bootstrap/modal': { exports: '$.fn.modal', deps: ['jquery'] },
        'bootstrap/popover': { exports: '$.fn.popover', deps: ['jquery'] },
        'bootstrap/scrollspy': { exports: '$.fn.scrollspy', deps: ['jquery'] },
        'bootstrap/tab': { exports: '$.fn.tab', deps: ['jquery'] },
        'bootstrap/tooltip': { exports: '$.fn.tooltip', deps: ['jquery'] },
        'bootstrap/transition': { exports: '$.fn.transition', deps: ['jquery'] }<% } %>
    },
    packages: [

    ]
};
