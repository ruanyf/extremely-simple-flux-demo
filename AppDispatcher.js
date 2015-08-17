var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();
var ListStore = require('./store/ListStore.js');

AppDispatcher.register( function( payload ) {
  switch( payload.eventName ) {
    case 'new-item':
      // We get to mutate data!
      ListStore.items.push( payload.newItem );
      // Tell the world we changed!
      ListStore.trigger( 'change' );
    break;
  }
  return true; // Needed for Flux promise resolution
});

module.exports = AppDispatcher;
