var React = require('react');
var ListStore = require('../store/ListStore.js');
var ListActions = require('../action/ListActions.js');

var MyButton = React.createClass({

  createNewItem: function(evt) {
    ListActions.add({ name: 'Marco' });
  },

  componentDidMount: function() {
    ListStore.bind( 'change', this.listChanged );
  },

  componentWillUnmount: function() {
    ListStore.unbind( 'change', this.listChanged );
  },

  listChanged: function() {
    // Since the list changed, trigger a new render.
    this.forceUpdate();
  },

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

    return (<div>
      <ul>{ itemHtml }</ul>
      <button onClick={ this.createNewItem }>New Item</button>
    </div>);
  }

});

module.exports = MyButton;
