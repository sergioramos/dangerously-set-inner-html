var parse5 = require('parse5');
var flatten = require('lodash.flatten');
var React = require('react');

var findScritps = (node) => {
  if (node.tagName && node.tagName === 'script') {
    return (node.childNodes || []).map((n) => n.value);
  }

  return flatten((node.childNodes || []).map(findScritps));
};

var run = function() {
  const scripts = ((this.state || {}).scripts || []);

  var fns = scripts.map((src) => {
    return new Function('require', src);
  }).forEach((fn) => {
    return fn();
  });
};

module.exports = React.createClass({
  parse: function(props) {
    return findScritps(parse5.parseFragment((props || {}).html));
  },
  initialState: function() {
    return {
      scripts: this.parse(this.props)
    };
  },
  getInitialState: function() {
    return this.initialState();
  },
  componentWillReceiveProps: function() {
    this.setState(initialState());
  },
  componentDidMount: run,
  componentDidUpdate: run,
  render: function() {
    return React.createElement('div', {
      dangerouslySetInnerHTML: {
        __html: this.props.html
      }
    });
  }
});
