import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import React, { memo } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles";
import classnames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TrashIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { asMutable } from "seamless-immutable";
var useStyles = makeStyles(styles);
export var RegionLabel = function RegionLabel(_ref) {
  var region = _ref.region,
      editing = _ref.editing,
      allowedClasses = _ref.allowedClasses,
      allowedTags = _ref.allowedTags,
      onDelete = _ref.onDelete,
      _onChange = _ref.onChange,
      onClose = _ref.onClose,
      onOpen = _ref.onOpen,
      onRegionClassAdded = _ref.onRegionClassAdded,
      state = _ref.state;
  var classes = useStyles();
  var ro = state.readOnly;
  return React.createElement(Paper, {
    onClick: function onClick() {
      return !editing ? onOpen(region) : null;
    },
    className: classnames(classes.regionInfo, {
      highlighted: region.highlighted
    })
  }, !editing || ro ? React.createElement("div", null, region.cls && React.createElement("div", {
    className: "name"
  }, React.createElement("div", {
    className: "circle",
    style: {
      backgroundColor: region.color
    }
  }), region.cls), region.tags && React.createElement("div", {
    className: "tags"
  }, region.tags.map(function (t) {
    return React.createElement("div", {
      key: t,
      className: "tag"
    }, t);
  }))) : React.createElement("div", {
    style: {
      width: 200
    }
  }, !ro && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row"
    }
  }, !ro && React.createElement("div", {
    style: {
      display: "flex",
      backgroundColor: region.color || "#888",
      color: "#fff",
      padding: 4,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 4,
      fontWeight: "bold",
      textShadow: "0px 0px 5px rgba(0,0,0,0.4)"
    }
  }, region.type), React.createElement("div", {
    style: {
      flexGrow: 1
    }
  }), !ro && React.createElement(IconButton, {
    onClick: function onClick() {
      return onDelete(region);
    },
    tabIndex: -1,
    style: {
      width: 22,
      height: 22
    },
    size: "small",
    variant: "outlined"
  }, React.createElement(TrashIcon, {
    style: {
      marginTop: -8,
      width: 16,
      height: 16
    }
  }))), (allowedClasses || []).length > 0 && React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, !ro && React.createElement(CreatableSelect, {
    placeholder: "Classification",
    onChange: function onChange(o, actionMeta) {
      if (actionMeta.action == "create-option") {
        onRegionClassAdded(o.value);
      }

      return _onChange(_objectSpread({}, region, {
        cls: o.value
      }));
    },
    value: region.cls ? {
      label: region.cls,
      value: region.cls
    } : null,
    options: asMutable(allowedClasses.map(function (c) {
      return {
        value: c,
        label: c
      };
    }))
  }) || React.createElement("div", null, region.cls)), false && (allowedTags || []).length > 0 && React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, !ro && React.createElement(Select, {
    onChange: function onChange(newTags) {
      return _onChange(_objectSpread({}, region, {
        tags: newTags && newTags.map(function (t) {
          return t.value;
        }) || []
      }));
    },
    placeholder: "Tags",
    value: (region.tags || []).map(function (c) {
      return {
        label: c,
        value: c
      };
    }),
    isMulti: true,
    options: asMutable(allowedTags.map(function (c) {
      return {
        value: c,
        label: c
      };
    }))
  }) || (region.tags || []).map(function (tag) {
    return React.createElement("div", {
      key: tag,
      style: {
        padding: 4
      }
    }, tag);
  })), onClose && React.createElement("div", {
    style: {
      marginTop: 4,
      display: "flex"
    }
  }, React.createElement("div", {
    style: {
      flexGrow: 1
    }
  }), React.createElement(Button, {
    onClick: function onClick() {
      return onClose(region);
    },
    size: "small",
    variant: "contained",
    color: "primary"
  }, React.createElement(CheckIcon, null)))));
};
export default memo(RegionLabel, function (prevProps, nextProps) {
  return prevProps.editing === nextProps.editing && prevProps.region === nextProps.region;
});