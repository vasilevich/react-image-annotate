import React from "react";
import { styled } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { iconMapping } from "../icon-mapping.js";
import { useIconDictionary } from "../icon-dictionary";
import Tooltip from "@material-ui/core/Tooltip";
var Container = styled("div")({
  width: 50,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  flexShrink: 0
});
var emptyAr = [];
export var IconSidebar = function IconSidebar(_ref) {
  var _ref$items = _ref.items,
      items = _ref$items === void 0 ? emptyAr : _ref$items,
      onClickItem = _ref.onClickItem,
      _ref$selectedTools = _ref.selectedTools,
      selectedTools = _ref$selectedTools === void 0 ? emptyAr : _ref$selectedTools;
  var customIconMapping = useIconDictionary();
  return React.createElement(Container, null, items.map(function (item) {
    var NameIcon = customIconMapping[item.name.toLowerCase()] || iconMapping[item.name.toLowerCase()] || iconMapping["help"];
    var buttonPart = React.createElement(IconButton, {
      key: item.name,
      color: item.selected || selectedTools.includes(item.name.toLowerCase()) ? "primary" : "default",
      className: item.selected || selectedTools.includes(item.name.toLowerCase()) ? 'selected' : '',
      disabled: Boolean(item.disabled),
      onClick: item.onClick ? item.onClick : function () {
        return onClickItem(item);
      }
    }, item.icon || React.createElement(NameIcon, null));
    if (!item.helperText) return buttonPart;
    return React.createElement(Tooltip, {
      key: item.name,
      title: item.helperText,
      placement: "right"
    }, buttonPart);
  }));
};
export default IconSidebar;