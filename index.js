var parse5 = require('parse5');
var flatten = require('lodash.flatten');
var React = require('react');
var uuid = require('uuid').v4;

const isBrowser = !!(document && window);

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
  clean: function() {
    if (!this.state.id || !isBrowser) {
      return;
    }

    const node = document.getElementById(this.state.id);

    if (!node) {
      return;
    }

    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
  },
  parse: function(props) {
    const html = (props || {}).html;

    if (!html || typeof html !== 'string') {
      return;
    }

    return findScritps(parse5.parseFragment(html));
  },
  initialState: function(props) {
    return {
      id: (this.state || {}).id || uuid(),
      scripts: this.parse(props)
    };
  },
  getInitialState: function() {
    return this.initialState(this.props);
  },
  shouldComponentUpdate: function(nextProps) {
    return this.props.html !== nextProps.html;
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.html === nextProps.html) {
      return;
    }

    this.clean();
    this.setState(this.initialState(nextProps));
  },
  componentDidMount: run,
  componentDidUpdate: run,
  render: function() {
    if (typeof this.props.html !== 'string') {
      return null;
    }

    return React.createElement('div', {
      id: this.state.id,
      dangerouslySetInnerHTML: {
        __html: this.props.html
      }
    });
  }
});
