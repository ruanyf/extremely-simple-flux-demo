This demo is intended as a simplest example for learning Flux architecture.

I implemented it according to Andrew Ray's great article [Flux For Stupid People](http://blog.andrewray.me/flux-for-stupid-people/). If you know nothing about Flux, you should read it.

## How to use

```bash
$ git clone git@github.com:ruanyf/flux-for-stupid-people-demo.git
$ cd flux-for-stupid-people-demo && npm install
$ npm start
```

Visit http://127.0.0.1:8080 with your browser.

![](screenshot.png)

## A Primer on Flux

Flux is an architecture concept to describe "one way" data flow.

'One way' means that data flows as follows.

1. Action triggers Dispatcher
1. Dispatcher updates Stores
1. Store Emits a "Change" Event
1. View Responds to the "Change" Event

### Step 1: Action triggers Dispatcher

Action means user's actions. For example, a user clicks on a button.

```html
<button onClick={ this.createNewItem }>New Item</button>
```

It triggers the Dispatcher.

```javascript
  createNewItem: function( evt ) {
    AppDispatcher.dispatch({
      eventName: 'new-item',
      newItem: { name: 'Marco' } // example data
    });
  }
```

The Dispatcher this demo uses is [Facebook's official Dispatcher](https://github.com/facebook/flux/blob/master/src/Dispatcher.js).

```javascript
var Dispatcher = require('flux').Dispatcher;
```

### Step 2: Dispatcher updates Stores

The Dispatcher contacts the Store.

> What is a Store?
>
> A store is the place to keep your state and data. Its role is somewhat similar to a model in a traditional MVC, but they manage the state of the components.
>
> A store is a singleton, meaning you probably shouldn't declare it with new.

Your Store then responds to the Dispatcher.

```javascript
var ListStore = {

  // Actual collection of model data
  items: [],

  // Accessor method we'll use later
  getAll: function() {
    return this.items;
  }

};

AppDispatcher.register( function( payload ) {

  switch( payload.eventName ) {

    case 'new-item':
      // We get to mutate data!
      ListStore.items.push( payload.newItem );
      break;

    // other eventName
    // ......

    }

  return true; // Needed for Flux promise resolution

});
```

`AppDispatcher.register` method is used to register a callback for `AppDispatcher.dispatch`.

### Step 3: Store emits a "Change" Event

After the Store is updated, it should emit a event.

It means the Store should have the ability to trigger events. But it doesn't use the Dispatcher, but another event library. This is confusing, but it's the Flux way.

In this demo, we use [MicroEvent.js](http://notes.jetienne.com/2011/03/22/microeventjs.html) as the event library.

```javascript
var MicroEvent = require('./lib/MicroEvent.js');
MicroEvent.mixin( ListStore );
```

Then let's trigger the change event in the Dispatcher.

```javascript
AppDispatcher.register( function( payload ) {
  switch( payload.eventName ) {

    case 'new-item':
      ListStore.items.push( payload.newItem );
      // Tell the world we changed!
      ListStore.trigger( 'change' );
      break;
    // other eventName
    // ......

  }

  return true; // Needed for Flux promise resolution
});
```

### Step 4: View Responds to the "Change" Event

The View listens for the `change` event from the Store when the component "mounts", which is when the component is first created.

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

Finally, the View's render function.

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

  return (
    <div>
      <ul>{ itemHtml }</ul>
      <button onClick={ this.createNewItem }>New Item</button>
    </div>
  );
}
```

Now it is all done.

## Afterword: Why Flux is different from MVC?

The real problem with MVC is ...

> There's not a lot of consensus for what MVC is exactly - lots of people have different ideas about what it is.
>
> A controller can send commands to the model to update the model's state (e.g., editing a document). It can also send commands to its associated view to change the view's presentation of the model (e.g., by scrolling through a document).

Flux is really arguing against this kind of bi-directional data flow.

> In Flux, the single-directional data flow is enforced.
>
> The dispatcher is just a central hub for events to reach your stores. It doesn't play the same role as controllers. There's no business logic in the dispatcher.
>
> ([Quoted](http://www.infoq.com/news/2014/05/facebook-mvc-flux) from Chen Jing, the creator of Flux)

## License

MIT
