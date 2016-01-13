var React = require('react');

var MyButton = function(props) {
  var items = props.items;
  var itemHtml = items.map(function (listItem, i) {
    return <li key={i}>{listItem}</li>;
  });

  return <div>
    <ul>{itemHtml}</ul>
    <button onClick={props.onClick}>New Item</button>
  </div>;
};

module.exports = MyButton;
