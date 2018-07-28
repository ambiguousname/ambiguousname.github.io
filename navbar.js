var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavItem = function (_React$Component) {
  _inherits(NavItem, _React$Component);

  function NavItem(props) {
    _classCallCheck(this, NavItem);

    var _this = _possibleConstructorReturn(this, (NavItem.__proto__ || Object.getPrototypeOf(NavItem)).call(this, props));

    _this.props = props;
    return _this;
  }

  _createClass(NavItem, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "li",
        { className: "nav-item" },
        React.createElement(
          "a",
          { className: "nav-link" + (this.props.active ? " active" : ""), href: (this.props.active) ? "#" : "./" + this.props.url + ".html"  },
          this.props.name
        )
      );
    }
  }]);

  return NavItem;
}(React.Component);

var Navbar = function (_React$Component2) {
  _inherits(Navbar, _React$Component2);

  function Navbar() {
    _classCallCheck(this, Navbar);

    return _possibleConstructorReturn(this, (Navbar.__proto__ || Object.getPrototypeOf(Navbar)).apply(this, arguments));
  }

  _createClass(Navbar, [{
    key: "render",
    value: function render() {
      var pages = ["index", "projects", "about"];
      var names = ["Home", "My Projects", "Contact/About"];
      var url = window.location.pathname;
      var items = [];
      for (var i = 0; i < pages.length; i++) {
        if (url.indexOf(pages[i]) !== -1 || (pages[i] === "index" && url === "/")) {
          items.push(React.createElement(NavItem, { active: true, key: pages[i], name: names[i], url: pages[i] }));
        } else {
          items.push(React.createElement(NavItem, { active: false, key: pages[i], name: names[i], url: pages[i] }));
        }
      }
      return React.createElement(
        "ul",
        { className: "nav justify-content-center nav-pills nav-fill" },
        items
      );
    }
  }]);

  return Navbar;
}(React.Component);
window.onload = function(){
ReactDOM.render(React.createElement(Navbar, null), document.getElementById('navbar'));

if(callReady){
  callReady();
}
if(isReady){
isReady();
}
}
