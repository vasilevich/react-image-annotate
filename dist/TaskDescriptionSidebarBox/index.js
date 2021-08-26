import React, { memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import DescriptionIcon from "@material-ui/icons/Description";
import { styled } from "@material-ui/core/styles";
import Markdown from "react-markdown";
var MarkdownContainer = styled("div")({
  paddingLeft: 16,
  paddingRight: 16,
  fontSize: 12,
  "& h1": {
    fontSize: 18
  },
  "& h2": {
    fontSize: 14
  },
  "& h3": {
    fontSize: 12
  },
  "& h4": {
    fontSize: 12
  },
  "& h5": {
    fontSize: 12
  },
  "& h6": {
    fontSize: 12
  },
  "& p": {
    fontSize: 12
  },
  "& a": {},
  "& img": {
    width: "100%"
  }
});
export var TaskDescriptionSidebarBox = function TaskDescriptionSidebarBox(_ref) {
  var description = _ref.description;
  return React.createElement(SidebarBoxContainer, {
    title: "Task Description",
    icon: React.createElement(DescriptionIcon, null),
    expandedByDefault: description && description !== "" ? false : true
  }, React.createElement(MarkdownContainer, null, React.createElement(Markdown, {
    source: description
  })));
};
export default memo(TaskDescriptionSidebarBox);