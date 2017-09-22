const parse5 = require('parse5');
const flatten = require('lodash.flatten');
const React = require('react');
const uuid = require('uuid').v4;

const isBrowser = !!(document && window);

const findScripts = (node) => {
  if (node.tagName && node.tagName === 'script') {
    return (node.childNodes || []).map((n) => n.value);
  }

  return flatten((node.childNodes || []).map(findScripts));
};

class InnerHTML extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.initialState(props);
  }

  clean() {
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
  }

  parse(props) {
    const html = (props || {}).html;

    if (!html || typeof html !== 'string') {
      return;
    }

    return findScripts(parse5.parseFragment(html));
  }

  initialState(props) {
    return {
      id: (this.state || {}).id || uuid(),
      scripts: this.parse(props)
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.html !== nextProps.html;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.html === nextProps.html) {
      return;
    }

    this.clean();
    this.setState(this.initialState(nextProps));
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const scripts = ((this.state || {}).scripts || []);

    var fns = scripts.map((src) => {
      return new Function('require', src);
    }).forEach((fn) => {
      return fn();
    });
  }

  render() {
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
}

export default InnerHTML;
