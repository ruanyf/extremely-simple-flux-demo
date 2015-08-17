// Global object representing list data and logic
var ListStore = {

    // Actual collection of model data
    items: [],

    // Accessor method we'll use later
    getAll: function() {
        return this.items;
    }

};
var MicroEvent = require('../lib/microevent.js');
MicroEvent.mixin(ListStore);

module.exports = ListStore;
