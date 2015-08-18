This demo is implemented for Andrew Ray's article [Flux For Stupid People](http://blog.andrewray.me/flux-for-stupid-people/).

## How to use

```bash
$ git clone git@github.com:ruanyf/flux-for-stupid-people-demo.git
$ cd flux-for-stupid-people-demo && npm install
$ npm start
```

Visit http://127.0.0.1:8080 with your browser.

## A Primer on Flux

Flux is an architecture concept to describe "one way" data flow with the Flux Dispatcher and a Javascript event library.

'One way' means that data flows as follows.

1. Dispatcher receives Actions
1. Dispatcher updats Stores
1. Store Emits a "Change" Event
1. View Responds to the "Change" Event

### Step One: Dispatcher receives Actions

For example, user clicks on a button.

```html
<button onClick={ this.createNewItem }>New Item</button>
```

Your component dispachs an action to the Dispatcher.

```javascript
var AppDispatcher = new Dispatcher();

var MyButton = React.createClass({
  createNewItem: function( evt ) {
    AppDispatcher.dispatch({
      eventName: 'new-item',
      newItem: { name: 'Marco' } // example data
    });
  }
});
```

This demo uses [Facebook's official Dispatcher](https://github.com/facebook/flux/blob/master/src/Dispatcher.js) and [MicroEvent.js](http://notes.jetienne.com/2011/03/22/microeventjs.html) as the event library.

```javascript
var Dispatcher = require('flux').Dispatcher;
var MicroEvent = require('./lib/MicroEvent.js');
```

### Step two: Dispatcher updats Stores

You need a store to keep your state. A store is a singleton, meaning you probably shouldn't declare it with new.

```javascript
// Global object representing list data and logic
var ListStore = {

    // Actual collection of model data
    items: [],

    // Accessor method we'll use later
    getAll: function() {
        return this.items;
    }

};
```

Your store then responds to the dispatched event. `AppDispatcher.register` method is used to register a callback for `AppDispatcher.dispatch`.

```javascript
AppDispatcher.register( function( payload ) {

    switch( payload.eventName ) {

        case 'new-item':

            // We get to mutate data!
            ListStore.items.push( payload.newItem );
            break;

    }

    return true; // Needed for Flux promise resolution

});
```

The dispatcher only exists to send messages from views to stores.

### Step three: Store Emits a "Change" Event

> Your store emits an event, but not using the dispatcher. This is confusing, but it's the Flux way. Let's give our store the ability to trigger events.

```javascript
MicroEvent.mixin( ListStore );
```

Then let's trigger the change event in your Dispatcher.

```javascript
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
```

### Step four: View Responds to the "Change" Event

> let's listen for the change event from our ListStore when the component "mounts," which is when the component is first created.

```javascript
componentDidMount: function() {
  ListStore.bind( 'change', this.listChanged );
},

listChanged: function() {
  // Since the list changed, trigger a new render.
  this.forceUpdate();
},

componentWillUnmount: function() {
  ListStore.unbind( 'change', this.listChanged );
},
```

Finally, our render function.

```javascript
render: function() {

    // Remember, ListStore is global!
    // There's no need to pass it around
    var items = ListStore.getAll();

    // Build list items markup by looping
    // over the entire list
    var itemHtml = items.map( function( listItem ) {

        // "key" is important, should be a unique
        // identifier for each list item
        return <li key={ listItem.id }>
            { listItem.name }
          </li>;

    });

    return <div>
        <ul>
            { itemHtml }
        </ul>

        <button onClick={ this.createNewItem }>New Item</button>

    </div>;
}
```

## License

MIT
