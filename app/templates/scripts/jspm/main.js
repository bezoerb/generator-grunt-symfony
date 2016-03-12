import debugFn from 'debug';
import $ from 'jquery';<% if (useBootstrap) { %>
import 'bootstrap';<% } else if (useUikit) { %>
import UI from 'uikit';<% } else if (useFoundation) { %>
import {Foundation} from 'foundation-sites';<% } %>
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';

let debug = debugFn('<%= safeProjectName %>:main');
picturefill();
<% if (useFoundation) { %>$(document).foundation();<% } %>


debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);<% if (useBootstrap) { %>
debug('Running Bootstrap:', $.fn.scrollspy ? '~3.3.0' : false);<% } else if (useUikit) { %>
debug('Running UIkit:', UI.version);<% } else if (useFoundation) { %>
debug('Running Foundation:', Foundation.version);<% } %>

SW.init();
