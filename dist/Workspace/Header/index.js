import React from "react";
import HeaderButton from "../HeaderButton";
import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";
var emptyObj = {};

var myContainerDiv = function myContainerDiv(props) {
  return React.createElement("div", props);
};

var Container = styled(myContainerDiv)({
  width: "100%",
  display: "flex",
  //backgroundColor: "#fff",
  borderBottom: "1px solid #ccc",
  alignItems: "center",
  flexShrink: 1,
  boxSizing: "border-box"
});
export var Header = function Header(_ref) {
  var _ref$leftSideContent = _ref.leftSideContent,
      leftSideContent = _ref$leftSideContent === void 0 ? null : _ref$leftSideContent,
      _ref$hideHeaderText = _ref.hideHeaderText,
      hideHeaderText = _ref$hideHeaderText === void 0 ? false : _ref$hideHeaderText,
      items = _ref.items,
      addedItems = _ref.addedItems,
      headerSubSection = _ref.headerSubSection,
      onClickItem = _ref.onClickItem;
  return React.createElement(Container, null, React.createElement(Box, {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center'
    },
    flexGrow: 1
  }, leftSideContent, headerSubSection), items.map(function (item) {
    return React.createElement(HeaderButton, Object.assign({
      key: item.name,
      hideText: hideHeaderText,
      onClick: function onClick() {
        return onClickItem(item);
      }
    }, item));
  }), addedItems);
};
export default Header;