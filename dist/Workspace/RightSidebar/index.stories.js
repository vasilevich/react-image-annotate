import React from "react";
import RightSidebar from "./";
import SidebarBox from "../SidebarBox";
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo";
export default {
  title: "RightSidebar",
  component: RightSidebar
};
export var Basic = function Basic() {
  return React.createElement("div", {
    style: {
      width: 500,
      height: 500
    }
  }, React.createElement(RightSidebar, null, React.createElement(SidebarBox, {
    icon: React.createElement(FeaturedVideoIcon, null),
    title: "Region Selector"
  }, "Content inside sidebar box"), React.createElement(SidebarBox, {
    icon: React.createElement(FeaturedVideoIcon, null),
    title: "Region Selector"
  }, "Content inside sidebar box")));
};
export var NoChildren = function NoChildren() {
  return React.createElement("div", {
    style: {
      width: 500,
      height: 500
    }
  }, React.createElement(RightSidebar, null));
};