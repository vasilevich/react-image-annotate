import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { Fragment, useState, memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { makeStyles, styled } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import RegionIcon from "@material-ui/icons/PictureInPicture";
import Grid from "@material-ui/core/Grid";
import ReorderIcon from "@material-ui/icons/SwapVert";
import PieChartIcon from "@material-ui/icons/PieChart";
import TrashIcon from "@material-ui/icons/Delete";
import LockIcon from "@material-ui/icons/Lock";
import UnlockIcon from "@material-ui/icons/LockOpen";
import VisibleIcon from "@material-ui/icons/Visibility";
import VisibleOffIcon from "@material-ui/icons/VisibilityOff";
import styles from "./styles";
import classnames from "classnames";
import isEqual from "lodash/isEqual";
var useStyles = makeStyles(styles);
var HeaderSep = styled("div")({
  borderTop: "1px solid ".concat(grey[200]),
  marginTop: 2,
  marginBottom: 2
});

var Chip = function Chip(_ref) {
  var color = _ref.color,
      text = _ref.text;
  var classes = useStyles();
  return React.createElement("span", {
    className: classes.chip
  }, React.createElement("div", {
    className: "color",
    style: {
      backgroundColor: color
    }
  }), React.createElement("div", {
    className: "text"
  }, text));
};

var RowLayout = function RowLayout(_ref2) {
  var region = _ref2.region,
      header = _ref2.header,
      highlighted = _ref2.highlighted,
      order = _ref2.order,
      classification = _ref2.classification,
      area = _ref2.area,
      tags = _ref2.tags,
      trash = _ref2.trash,
      lock = _ref2.lock,
      visible = _ref2.visible,
      onClick = _ref2.onClick,
      state = _ref2.state;
  var classes = useStyles();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      mouseOver = _useState2[0],
      changeMouseOver = _useState2[1];

  var ro = state.readOnly;
  return React.createElement("div", {
    onClick: onClick,
    onMouseEnter: function onMouseEnter() {
      return changeMouseOver(true);
    },
    onMouseLeave: function onMouseLeave() {
      return changeMouseOver(false);
    },
    className: classnames(classes.row, {
      header: header,
      highlighted: highlighted
    }),
    style: ro && {
      padding: '15pt 5pt 15pt 0pt'
    } || {}
  }, React.createElement(Grid, {
    container: true,
    alignItems: "center"
  }, React.createElement(Grid, {
    item: true,
    xs: 2
  }, React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 10
    }
  }, order)), React.createElement(Grid, {
    item: true,
    xs: 5
  }, classification), React.createElement(Grid, {
    item: true,
    xs: 2
  }, React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 6
    }
  }, area)), React.createElement(Grid, {
    item: true,
    xs: 1
  }, !ro && trash), React.createElement(Grid, {
    item: true,
    xs: 1
  }, !ro && lock), React.createElement(Grid, {
    item: true,
    xs: 1
  }, visible)));
};

var RowHeader = function RowHeader(_ref3) {
  var _ref3$regions = _ref3.regions,
      regions = _ref3$regions === void 0 ? emptyArr : _ref3$regions,
      onDeleteRegion = _ref3.onDeleteRegion,
      onChangeRegion = _ref3.onChangeRegion,
      onSelectRegion = _ref3.onSelectRegion,
      state = _ref3.state;
  var vis = React.useState(true);
  return React.createElement(RowLayout, {
    header: true,
    state: state,
    highlighted: false,
    visible: React.createElement(VisibleIcon, {
      className: "icon",
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            visible: !vis[0]
          }));
        });
        vis[1](!vis[0]);
      }
    }),
    classification: React.createElement("div", {
      style: {
        paddingLeft: 10
      }
    }, "Class")
  }) // <RowLayout
  //   header
  //   highlighted={false}
  //   order={<ReorderIcon className="icon" />}
  //   classification={<div style={{ paddingLeft: 10 }}>Class</div>}
  //   area={<PieChartIcon className="icon" />}
  //   trash={<TrashIcon className="icon" />}
  //   lock={<LockIcon className="icon" />}
  //   visible={<VisibleIcon className="icon" />}
  // />
  ;
};

var MemoRowHeader = memo(RowHeader);

var Row = function Row(_ref4) {
  var r = _ref4.region,
      highlighted = _ref4.highlighted,
      onSelectRegion = _ref4.onSelectRegion,
      onDeleteRegion = _ref4.onDeleteRegion,
      onChangeRegion = _ref4.onChangeRegion,
      visible = _ref4.visible,
      locked = _ref4.locked,
      color = _ref4.color,
      cls = _ref4.cls,
      index = _ref4.index,
      state = _ref4.state;
  return React.createElement(RowLayout, {
    header: false,
    region: r,
    state: state,
    highlighted: highlighted,
    onClick: function onClick(e) {
      console.debug("clickedRegionSelector", r);
      onSelectRegion(r);
    },
    order: "#".concat(index + 1),
    classification: React.createElement("div", {
      style: r && r.group && {
        paddingLeft: '16pt'
      } || {}
    }, React.createElement(Chip, {
      text: cls || "",
      color: color || "#ddd"
    })),
    area: "",
    trash: React.createElement(TrashIcon, {
      onClick: function onClick() {
        return onDeleteRegion(r);
      },
      className: "icon2"
    }),
    lock: r.locked ? React.createElement(LockIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          locked: false
        }));
      },
      className: "icon2"
    }) : React.createElement(UnlockIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          locked: true
        }));
      },
      className: "icon2"
    }),
    visible: r.visible || r.visible === undefined ? React.createElement(VisibleIcon, {
      onClick: function onClick(e) {
        e.preventDefault();
        e.stopPropagation();
        onChangeRegion(_objectSpread({}, r, {
          visible: false,
          highlighted: false
        }));
      },
      className: "icon2"
    }) : React.createElement(VisibleOffIcon, {
      onClick: function onClick(e) {
        e.preventDefault();
        e.stopPropagation();
        onChangeRegion(_objectSpread({}, r, {
          visible: true
        }));
      },
      className: "icon2"
    })
  });
};

var MemoRow = memo(Row, function (prevProps, nextProps) {
  return prevProps.highlighted === nextProps.highlighted && prevProps.visible === nextProps.visible && prevProps.locked === nextProps.locked && prevProps.id === nextProps.id && prevProps.index === nextProps.index && prevProps.cls === nextProps.cls && prevProps.color === nextProps.color;
});
var emptyArr = [];
export var RegionSelectorSidebarBox = function RegionSelectorSidebarBox(_ref5) {
  var _ref5$regions = _ref5.regions,
      regions = _ref5$regions === void 0 ? emptyArr : _ref5$regions,
      _onDeleteRegion = _ref5.onDeleteRegion,
      onChangeRegion = _ref5.onChangeRegion,
      onSelectRegion = _ref5.onSelectRegion,
      state = _ref5.state;
  var classes = useStyles();
  return React.createElement(SidebarBoxContainer, {
    title: "Regions",
    key: 'sidebarregionsbox',
    subTitle: "",
    icon: React.createElement(RegionIcon, {
      style: {
        color: grey[700]
      }
    }),
    expandedByDefault: true
  }, React.createElement("div", {
    className: classes.container
  }, React.createElement(MemoRowHeader, {
    regions: regions,
    onDeleteRegion: _onDeleteRegion,
    onChangeRegion: onChangeRegion,
    onSelectRegion: onSelectRegion,
    state: state
  }), React.createElement(HeaderSep, null), regions.map(function (r, i) {
    return React.createElement(MemoRow, Object.assign({
      key: r.id || i
    }, r, {
      region: r,
      state: state,
      index: i,
      onSelectRegion: onSelectRegion,
      onDeleteRegion: function onDeleteRegion() {
        if (window.confirm('DELETE')) {
          _onDeleteRegion.apply(void 0, arguments);
        }
      },
      onChangeRegion: onChangeRegion
    }));
  })));
};

var mapUsedRegionProperties = function mapUsedRegionProperties(r) {
  return [r.id, r.color, r.locked, r.visible, r.highlighted];
};

export default memo(RegionSelectorSidebarBox, function (prevProps, nextProps) {
  return isEqual((prevProps.regions || emptyArr).map(mapUsedRegionProperties), (nextProps.regions || emptyArr).map(mapUsedRegionProperties));
});