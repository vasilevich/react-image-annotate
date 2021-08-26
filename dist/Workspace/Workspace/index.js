import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React from "react";
import { styled } from "@material-ui/core/styles";
import Header from "../Header";
import IconSidebar from "../IconSidebar";
import RightSidebar from "../RightSidebar";
import WorkContainer from "../WorkContainer";
import useDimensions from "react-use-dimensions";
import { IconDictionaryContext } from "../icon-dictionary.js";
var emptyAr = [];
var emptyObj = {};
var Container = styled("div")({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  maxWidth: "100vw"
});
var SidebarsAndContent = styled("div")({
  display: "flex",
  flexGrow: 1,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  maxWidth: "100vw"
});
export default (function (_ref) {
  var _ref$style = _ref.style,
      style = _ref$style === void 0 ? emptyObj : _ref$style,
      _ref$iconSidebarItems = _ref.iconSidebarItems,
      iconSidebarItems = _ref$iconSidebarItems === void 0 ? emptyAr : _ref$iconSidebarItems,
      _ref$selectedTools = _ref.selectedTools,
      selectedTools = _ref$selectedTools === void 0 ? ["select"] : _ref$selectedTools,
      _ref$headerItems = _ref.headerItems,
      headerItems = _ref$headerItems === void 0 ? emptyAr : _ref$headerItems,
      headerAddedItems = _ref.headerAddedItems,
      headerSubSection = _ref.headerSubSection,
      _ref$rightSidebarItem = _ref.rightSidebarItems,
      rightSidebarItems = _ref$rightSidebarItem === void 0 ? emptyAr : _ref$rightSidebarItem,
      onClickHeaderItem = _ref.onClickHeaderItem,
      onClickIconSidebarItem = _ref.onClickIconSidebarItem,
      _ref$headerLeftSide = _ref.headerLeftSide,
      headerLeftSide = _ref$headerLeftSide === void 0 ? null : _ref$headerLeftSide,
      _ref$iconDictionary = _ref.iconDictionary,
      iconDictionary = _ref$iconDictionary === void 0 ? emptyObj : _ref$iconDictionary,
      rightSidebarExpanded = _ref.rightSidebarExpanded,
      _ref$rightSidebarOnLe = _ref.rightSidebarOnLeft,
      rightSidebarOnLeft = _ref$rightSidebarOnLe === void 0 ? false : _ref$rightSidebarOnLe,
      _ref$hideHeader = _ref.hideHeader,
      hideHeader = _ref$hideHeader === void 0 ? false : _ref$hideHeader,
      _ref$hideHeaderText = _ref.hideHeaderText,
      hideHeaderText = _ref$hideHeaderText === void 0 ? false : _ref$hideHeaderText,
      children = _ref.children;

  var _useDimensions = useDimensions(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      sidebarAndContentRef = _useDimensions2[0],
      sidebarAndContent = _useDimensions2[1];

  return React.createElement(IconDictionaryContext.Provider, {
    value: iconDictionary
  }, React.createElement(Container, {
    style: style
  }, !hideHeader && React.createElement(Header, {
    addedItems: headerAddedItems,
    hideHeaderText: hideHeaderText,
    leftSideContent: headerLeftSide,
    headerSubSection: headerSubSection,
    onClickItem: onClickHeaderItem,
    items: headerItems
  }), React.createElement(SidebarsAndContent, {
    ref: sidebarAndContentRef
  }, iconSidebarItems.length === 0 ? null : React.createElement(React.Fragment, null, React.createElement(IconSidebar, {
    onClickItem: onClickIconSidebarItem,
    selectedTools: selectedTools,
    items: iconSidebarItems
  }), rightSidebarOnLeft && React.createElement(RightSidebar, {
    style: rightSidebarOnLeft && {
      right: 'auto',
      left: 0
    },
    rightSidebarOnLeft: rightSidebarOnLeft,
    initiallyExpanded: rightSidebarExpanded,
    height: sidebarAndContent.height || 0
  }, rightSidebarItems)), React.createElement(WorkContainer, null, children), rightSidebarItems.length === 0 || rightSidebarOnLeft ? null : React.createElement(RightSidebar, {
    initiallyExpanded: rightSidebarExpanded,
    height: sidebarAndContent.height || 0
  }, rightSidebarItems))));
});