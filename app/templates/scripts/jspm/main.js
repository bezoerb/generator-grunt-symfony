import log from 'loglevel';<% if (useBootstrap) { %>
import $ from 'bootstrap'; <% } else { %>
import $ from 'jquery'; <% } if (useUikit) { %>
import UI from 'uikit/uikit';<% } else if (useFoundation) { %>
import Foundation from 'foundation';<% } %>



log.setLevel(0);
log.debug('\'Allo \'Allo');
log.debug('Running jQuery: ',$().jquery);<% if (useBootstrap) { %>
log.debug('Running Bootstrap: ',!!$.fn.scrollspy);<% } if (useUikit) { %>
log.debug('Running UIkit: ',UI.version);<% } else if (useFoundation) { %>
log.debug('Running Foundation: ',Foundation.version);<% } %>
