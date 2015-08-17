var AppDispatcher = require('../AppDispatcher.js');

var ListActions = {

    add: function( item ) {
        AppDispatcher.dispatch({
            eventName: 'new-item',
            newItem: item
        });
    }

};

module.exports = ListActions;
