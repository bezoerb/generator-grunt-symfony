import debug from 'debug';
import $ from 'jquery'; <% if (useBootstrap) { %>
import 'bootstrap'; <% } else if (useUikit) { %>
import UI from 'uikit';<% } else if (useFoundation) { %>
import Foundation from 'foundation';<% } %>
import picturefill from  'picturefill';

let log = debug('<%= safeProjectName %>:main');
picturefill();

log('\'Allo \'Allo');
log('Running jQuery:',$().jquery);<% if (useBootstrap) { %>
log('Running Bootstrap:',Boolean($.fn.scrollspy)? '~3.3.0' : false);<% } else if (useUikit) { %>
log('Running UIkit:',UI.version);<% } else if (useFoundation) { %>
log('Running Foundation:',Foundation.version);<% } %>
