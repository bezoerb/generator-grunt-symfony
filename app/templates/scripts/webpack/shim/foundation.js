// shim to make jquery globally available
// needed for libraries depending on the global jquery object
/* global require */
var $ = require('jquery');
window.jQuery = window.$ = $;
require('foundation-sites');

export default window.Foundation;

