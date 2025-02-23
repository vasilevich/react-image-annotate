import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import React from "react";
import Paper from "@material-ui/core/Paper";
import DefaultRegionLabel from "../RegionLabel";
import LockIcon from "@material-ui/icons/Lock";

var copyWithout = function copyWithout(obj) {
  var newObj = _objectSpread({}, obj);

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  for (var _i = 0, _args = args; _i < _args.length; _i++) {
    var arg = _args[_i];
    delete newObj[arg];
  }

  return newObj;
};

export var RegionTags = function RegionTags(_ref) {
  var state = _ref.state,
      regions = _ref.regions,
      projectRegionBox = _ref.projectRegionBox,
      mouseEvents = _ref.mouseEvents,
      regionClsList = _ref.regionClsList,
      regionTagList = _ref.regionTagList,
      onBeginRegionEdit = _ref.onBeginRegionEdit,
      onChangeRegion = _ref.onChangeRegion,
      onCloseRegionEdit = _ref.onCloseRegionEdit,
      onDeleteRegion = _ref.onDeleteRegion,
      layoutParams = _ref.layoutParams,
      imageSrc = _ref.imageSrc,
      RegionEditLabel = _ref.RegionEditLabel,
      onRegionClassAdded = _ref.onRegionClassAdded;
  var RegionLabel = RegionEditLabel != null ? RegionEditLabel : DefaultRegionLabel;
  var mode_onlycurrentRegion = {
    "MOVE_REGION": true,
    "RESIZE_BOX": true,
    "MOVE_POLYGON_POINT": true,
    "MOVE_KEYPOINT": true,
    "DRAW_POLYGON": true,
    "DRAW_EXPANDING_LINE": true
  };
  var ro = state.readOnly; // if(state.mode && mode_onlycurrentRegion[state.mode])
  // {
  //   console.debug('stateinghideothertagsmode!!',state.mode,state.regionId)
  // }
  // console.debug('RegionTags',{nrRe:regions.length,mode:state.mode,regionId:state.regionId})

  return regions.filter(function (r) {
    return (r.visible || r.visible === undefined) && (!state.mode || !state.mode.mode || !mode_onlycurrentRegion[state.mode.mode] || state.mode && state.mode.mode && mode_onlycurrentRegion[state.mode.mode] && state.mode.regionId == r.id);
  }).map(function (region) {
    var pbox = projectRegionBox(region);
    var _layoutParams$current = layoutParams.current,
        iw = _layoutParams$current.iw,
        ih = _layoutParams$current.ih;
    var margin = 8;
    if (region.highlighted && region.type === "box") margin += 6;
    var labelBoxHeight = region.editingLabels && !region.locked ? 170 : region.tags ? 60 : 50;
    var displayOnTop = pbox.y > labelBoxHeight;
    var coords = displayOnTop ? {
      left: pbox.x,
      top: pbox.y - margin / 2
    } : {
      left: pbox.x,
      top: pbox.y + pbox.h + margin / 2
    };

    if (region.locked) {
      return React.createElement("div", {
        key: region.id,
        style: _objectSpread({
          position: "absolute"
        }, coords, {
          zIndex: 10 + (region.editingLabels ? 5 : 0)
        })
      }, React.createElement(Paper, {
        style: _objectSpread({
          position: "absolute",
          left: 0
        }, displayOnTop ? {
          bottom: 0
        } : {
          top: 0
        }, {
          zIndex: 10,
          borderRadius: 4,
          padding: 2,
          paddingBottom: 0,
          opacity: 0.5,
          pointerEvents: "none"
        })
      }, !ro && React.createElement(LockIcon, {
        style: {
          width: 16,
          height: 16,
          color: "#333"
        }
      })));
    }

    return React.createElement("div", {
      key: region.id,
      style: _objectSpread({
        position: "absolute"
      }, coords, {
        zIndex: 10 + (region.editingLabels ? 5 : 0),
        width: 200
      }),
      onMouseDown: function onMouseDown(e) {
        return e.preventDefault();
      },
      onMouseUp: function onMouseUp(e) {
        return e.preventDefault();
      },
      onMouseEnter: function onMouseEnter(e) {
        if (region.editingLabels) {
          mouseEvents.onMouseUp(e);
          e.button = 1;
          mouseEvents.onMouseUp(e);
        }
      }
    }, React.createElement("div", Object.assign({
      style: _objectSpread({
        position: "absolute",
        zIndex: 20,
        left: 0
      }, displayOnTop ? {
        bottom: 0
      } : {
        top: 0
      })
    }, !region.editingLabels ? copyWithout(mouseEvents, "onMouseDown", "onMouseUp") : {}), React.createElement(RegionLabel, {
      allowedClasses: regionClsList,
      allowedTags: regionTagList,
      onOpen: onBeginRegionEdit,
      onChange: onChangeRegion,
      onClose: onCloseRegionEdit,
      onDelete: onDeleteRegion,
      editing: region.editingLabels,
      region: region,
      regions: regions,
      imageSrc: imageSrc,
      onRegionClassAdded: onRegionClassAdded,
      state: state
    })));
  });
};
export default RegionTags;