import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { memo } from "react";
import colorAlpha from "color-alpha";

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

var RegionComponents = {
  point: memo(function (_ref) {
    var region = _ref.region,
        iw = _ref.iw,
        ih = _ref.ih;
    return React.createElement("g", {
      transform: "translate(".concat(region.x * iw, " ").concat(region.y * ih, ")")
    }, React.createElement("path", {
      d: "M0 8L8 0L0 -8L-8 0Z",
      strokeWidth: 2,
      stroke: region.color,
      fill: "transparent"
    }));
  }),
  box: memo(function (_ref2) {
    var region = _ref2.region,
        iw = _ref2.iw,
        ih = _ref2.ih;
    var point0 = [region.x, region.y];
    return React.createElement(React.Fragment, null, region.text && point0 && React.createElement("text", {
      x: point0[0] * iw,
      y: point0[1] * ih,
      style: {
        fontWeight: 'bold',
        background: '#77777722',
        padding: 3,
        fontSize: region.highlighted && '23pt' || '14pt'
      },
      fill: region.color
    }, region.text), React.createElement("g", {
      transform: "translate(".concat(region.x * iw, " ").concat(region.y * ih, ")")
    }, React.createElement("rect", {
      strokeWidth: 2,
      x: 0,
      y: 0,
      width: Math.max(region.w * iw, 0),
      height: Math.max(region.h * ih, 0),
      stroke: colorAlpha(region.color, region.highlighted && 1 || 0.75),
      fill: colorAlpha(region.color, region.highlighted && 0.4 || 0.25)
    })));
  }),
  geometry: memo(function (_ref3) {
    var _region$geometry;

    var region = _ref3.region,
        iw = _ref3.iw,
        ih = _ref3.ih;
    var point0 = ((_region$geometry = region.geometry) === null || _region$geometry === void 0 ? void 0 : _region$geometry.coordinates) && region.geometry.coordinates[0] && region.geometry.coordinates[0][0];
    return region.geometry && region.geometry.coordinates && React.createElement(React.Fragment, null, region.text && point0 && React.createElement("text", {
      x: point0[0] * iw,
      y: point0[1] * ih,
      style: {
        fontWeight: 'bold',
        background: '#77777722',
        padding: 3,
        fontSize: region.highlighted && '23pt' || '14pt'
      },
      fill: region.color
    }, region.text), React.createElement("path", {
      fill: colorAlpha(region.color, region.highlighted && 0.6 || 0.37),
      fillRule: "evenodd",
      d: region.geometry.coordinates.map(function (coords) {
        return "M ".concat(coords.map(function (coord) {
          return "".concat(coord[0] * iw, " ").concat(coord[1] * ih);
        }).join(" "), " Z");
      }).join(" ")
    }));
  }),
  polygon: memo(function (_ref4) {
    var region = _ref4.region,
        iw = _ref4.iw,
        ih = _ref4.ih,
        fullSegmentationMode = _ref4.fullSegmentationMode;
    var Component = region.open ? "polyline" : "polygon";
    var alphaBase = fullSegmentationMode ? 0.5 : 1;
    var point0 = region.points && region.points[0];
    return React.createElement(React.Fragment, null, region.text && point0 && React.createElement("text", {
      x: point0[0] * iw,
      y: point0[1] * ih,
      style: {
        fontWeight: 'bold',
        background: '#77777722',
        padding: 3,
        fontSize: region.highlighted && '23pt' || '14pt'
      },
      fill: region.color
    }, region.text), React.createElement(Component, {
      points: region.points.map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            x = _ref6[0],
            y = _ref6[1];

        return [x * iw, y * ih];
      }).map(function (a) {
        return a.join(" ");
      }).join(" "),
      strokeWidth: 2,
      stroke: colorAlpha(region.color, region.highlighted && 1 || 0.75),
      fill: colorAlpha(region.color, region.highlighted && 0.5 || 0.25)
    }));
  }),
  keypoints: function keypoints(_ref7) {
    var region = _ref7.region,
        iw = _ref7.iw,
        ih = _ref7.ih,
        keypointDefinitions = _ref7.keypointDefinitions;
    var points = region.points,
        keypointsDefinitionId = region.keypointsDefinitionId;

    if (!keypointDefinitions[keypointsDefinitionId]) {
      throw new Error("No definition for keypoint configuration \"".concat(keypointsDefinitionId, "\""));
    }

    var _keypointDefinitions$ = keypointDefinitions[keypointsDefinitionId],
        landmarks = _keypointDefinitions$.landmarks,
        connections = _keypointDefinitions$.connections;
    return React.createElement("g", null, Object.entries(points).map(function (_ref8, i) {
      var _ref9 = _slicedToArray(_ref8, 2),
          keypointId = _ref9[0],
          _ref9$ = _ref9[1],
          x = _ref9$.x,
          y = _ref9$.y;

      return React.createElement("g", {
        key: i,
        transform: "translate(".concat(x * iw, " ").concat(y * ih, ")")
      }, React.createElement("path", {
        d: "M0 8L8 0L0 -8L-8 0Z",
        strokeWidth: 2,
        stroke: landmarks[keypointId].color,
        fill: "transparent"
      }));
    }), connections.map(function (_ref10) {
      var _ref11 = _slicedToArray(_ref10, 2),
          kp1Id = _ref11[0],
          kp2Id = _ref11[1];

      var kp1 = points[kp1Id];
      var kp2 = points[kp2Id];
      var midPoint = {
        x: (kp1.x + kp2.x) / 2,
        y: (kp1.y + kp2.y) / 2
      };
      return React.createElement("g", {
        key: "".concat(kp1.x, ",").concat(kp1.y, ".").concat(kp2.x, ",").concat(kp2.y)
      }, React.createElement("line", {
        x1: kp1.x * iw,
        y1: kp1.y * ih,
        x2: midPoint.x * iw,
        y2: midPoint.y * ih,
        strokeWidth: 2,
        stroke: landmarks[kp1Id].color
      }), React.createElement("line", {
        x1: kp2.x * iw,
        y1: kp2.y * ih,
        x2: midPoint.x * iw,
        y2: midPoint.y * ih,
        strokeWidth: 2,
        stroke: landmarks[kp2Id].color
      }));
    }));
  },
  "expanding-line": memo(function (_ref12) {
    var region = _ref12.region,
        iw = _ref12.iw,
        ih = _ref12.ih;
    var _region$expandingWidt = region.expandingWidth,
        expandingWidth = _region$expandingWidt === void 0 ? 0.005 : _region$expandingWidt,
        points = region.points;
    expandingWidth = points.slice(-1)[0].width || expandingWidth;
    var pointPairs = points.map(function (_ref13, i) {
      var x = _ref13.x,
          y = _ref13.y,
          angle = _ref13.angle,
          width = _ref13.width;

      if (!angle) {
        var n = points[clamp(i + 1, 0, points.length - 1)];
        var p = points[clamp(i - 1, 0, points.length - 1)];
        angle = Math.atan2(p.x - n.x, p.y - n.y) + Math.PI / 2;
      }

      var dx = Math.sin(angle) * (width || expandingWidth) / 2;
      var dy = Math.cos(angle) * (width || expandingWidth) / 2;
      return [{
        x: x + dx,
        y: y + dy
      }, {
        x: x - dx,
        y: y - dy
      }];
    });
    var firstSection = pointPairs.map(function (_ref14) {
      var _ref15 = _slicedToArray(_ref14, 2),
          p1 = _ref15[0],
          p2 = _ref15[1];

      return p1;
    });
    var secondSection = pointPairs.map(function (_ref16) {
      var _ref17 = _slicedToArray(_ref16, 2),
          p1 = _ref17[0],
          p2 = _ref17[1];

      return p2;
    }).asMutable();
    secondSection.reverse();
    var lastPoint = points.slice(-1)[0];
    return React.createElement(React.Fragment, null, React.createElement("polygon", {
      points: firstSection.concat(region.candidatePoint ? [region.candidatePoint] : []).concat(secondSection).map(function (p) {
        return "".concat(p.x * iw, " ").concat(p.y * ih);
      }).join(" "),
      strokeWidth: 2,
      stroke: colorAlpha(region.color, 0.75),
      fill: colorAlpha(region.color, 0.25)
    }), points.map(function (_ref18, i) {
      var x = _ref18.x,
          y = _ref18.y,
          angle = _ref18.angle;
      return React.createElement("g", {
        key: i,
        transform: "translate(".concat(x * iw, " ").concat(y * ih, ") rotate(").concat(-(angle || 0) * 180 / Math.PI, ")")
      }, React.createElement("g", null, React.createElement("rect", {
        x: -5,
        y: -5,
        width: 10,
        height: 10,
        strokeWidth: 2,
        stroke: colorAlpha(region.color, 0.75),
        fill: colorAlpha(region.color, 0.25)
      })));
    }), React.createElement("rect", {
      x: lastPoint.x * iw - 8,
      y: lastPoint.y * ih - 8,
      width: 16,
      height: 16,
      strokeWidth: 4,
      stroke: colorAlpha(region.color, 0.5),
      fill: "transparent"
    }));
  }),
  pixel: function pixel() {
    return null;
  }
};
export var WrappedRegionList = memo(function (_ref19) {
  var regions = _ref19.regions,
      keypointDefinitions = _ref19.keypointDefinitions,
      iw = _ref19.iw,
      ih = _ref19.ih,
      fullSegmentationMode = _ref19.fullSegmentationMode;
  return regions.filter(function (r) {
    return r.visible !== false || r.highlighted;
  }).map(function (r) {
    var Component = RegionComponents[r.type];
    return React.createElement(Component, {
      key: r.regionId,
      region: r,
      iw: iw,
      ih: ih,
      keypointDefinitions: keypointDefinitions,
      fullSegmentationMode: fullSegmentationMode
    });
  });
}, function (n, p) {
  return n.regions === p.regions && n.iw === p.iw && n.ih === p.ih;
});
export var RegionShapes = function RegionShapes(_ref20) {
  var mat = _ref20.mat,
      imagePosition = _ref20.imagePosition,
      _ref20$regions = _ref20.regions,
      regions = _ref20$regions === void 0 ? [] : _ref20$regions,
      keypointDefinitions = _ref20.keypointDefinitions,
      fullSegmentationMode = _ref20.fullSegmentationMode;
  var iw = imagePosition.bottomRight.x - imagePosition.topLeft.x;
  var ih = imagePosition.bottomRight.y - imagePosition.topLeft.y;
  if (isNaN(iw) || isNaN(ih)) return null;
  return React.createElement("svg", {
    width: iw,
    height: ih,
    style: {
      position: "absolute",
      zIndex: 2,
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      pointerEvents: "none",
      width: iw,
      height: ih
    }
  }, React.createElement(WrappedRegionList, {
    key: "wrapped-region-list",
    regions: regions,
    iw: iw,
    ih: ih,
    keypointDefinitions: keypointDefinitions,
    fullSegmentationMode: fullSegmentationMode
  }));
};
export default RegionShapes;