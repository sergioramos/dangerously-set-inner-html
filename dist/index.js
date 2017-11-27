'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parse5 = require('parse5');
var flatten = require('lodash.flatten');
var React = require('react');
var uuid = require('uuid').v4;

var isBrowser = !!(document && window);

var findScripts = function findScripts(node) {
  if (node.tagName && node.tagName === 'script') {
    return (node.childNodes || []).map(function (n) {
      return n.value;
    });
  }

  return flatten((node.childNodes || []).map(findScripts));
};

var InnerHTML = function (_React$Component) {
  _inherits(InnerHTML, _React$Component);

  function InnerHTML(props, context) {
    _classCallCheck(this, InnerHTML);

    var _this = _possibleConstructorReturn(this, (InnerHTML.__proto__ || Object.getPrototypeOf(InnerHTML)).call(this, props, context));

    _this.state = _this.initialState(props);
    return _this;
  }

  _createClass(InnerHTML, [{
    key: 'clean',
    value: function clean() {
      if (!this.state.id || !isBrowser) {
        return;
      }

      var node = document.getElementById(this.state.id);

      if (!node) {
        return;
      }

      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }
    }
  }, {
    key: 'parse',
    value: function parse(props) {
      var html = (props || {}).html;

      if (!html || typeof html !== 'string') {
        return;
      }

      return findScripts(parse5.parseFragment(html));
    }
  }, {
    key: 'initialState',
    value: function initialState(props) {
      return {
        id: (this.state || {}).id || uuid(),
        scripts: this.parse(props)
      };
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.html !== nextProps.html;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.html === nextProps.html) {
        return;
      }

      this.clean();
      this.setState(this.initialState(nextProps));
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.componentDidUpdate();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var scripts = (this.state || {}).scripts || [];

      var fns = scripts.map(function (src) {
        return new Function('require', src);
      }).forEach(function (fn) {
        try {
          return fn();
        } catch (e) {
          console.error(e);
          return null;
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
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
  }]);

  return InnerHTML;
}(React.Component);

exports.default = InnerHTML;
