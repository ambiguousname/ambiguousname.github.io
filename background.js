var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Background = function (_React$Component) {
  _inherits(Background, _React$Component);

  function Background() {
    _classCallCheck(this, Background);

    return _possibleConstructorReturn(this, (Background.__proto__ || Object.getPrototypeOf(Background)).apply(this, arguments));
  }

  _createClass(Background, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container-fluid background" },
        React.createElement(
          "div",
          { className: "row", style: { width: "100%", height: "100%", margin: "0" } },
          React.createElement("div", { className: "col bg-success"}),
          React.createElement("div", { className: "col bg-warning" }),
          React.createElement("div", { className: "col bg-danger" }),
          React.createElement("div", { className: "col bg-primary" })
        )
      );
    }
  }]);

  return Background;
}(React.Component);

function callReady() {
  ReactDOM.render(React.createElement(Background, null), document.getElementById("background"));
  $(".background").animate({height: "100%"}, 0);
}
