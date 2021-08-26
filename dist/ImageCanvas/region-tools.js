import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export var getEnclosingBox = function getEnclosingBox(region) {
  switch (region.type) {
    case "polygon":
      {
        var box = {
          x: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            return x;
          }))),
          y: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                x = _ref4[0],
                y = _ref4[1];

            return y;
          }))),
          w: 0,
          h: 0
        };
        box.w = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              x = _ref6[0],
              y = _ref6[1];

          return x;
        }))) - box.x;
        box.h = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              x = _ref8[0],
              y = _ref8[1];

          return y;
        }))) - box.y;
        return box;
      }

    case "geometry":
      {
        var _box = {
          x: region.coordinates && region.coordinates[0] && Math.min.apply(Math, _toConsumableArray(region.coordinates[0].map(function (_ref9) {
            var _ref10 = _slicedToArray(_ref9, 2),
                x = _ref10[0],
                y = _ref10[1];

            return x;
          }))) || 0,
          y: region.coordinates && region.coordinates[0] && Math.min.apply(Math, _toConsumableArray(region.coordinates[0].map(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
                x = _ref12[0],
                y = _ref12[1];

            return y;
          }))) || 0,
          w: 0,
          h: 0
        };

        if (region.coordinates && region.coordinates[0]) {
          _box.w = Math.max.apply(Math, _toConsumableArray(region.coordinates[0].map(function (_ref13) {
            var _ref14 = _slicedToArray(_ref13, 2),
                x = _ref14[0],
                y = _ref14[1];

            return x;
          }))) - _box.x;
          _box.h = Math.max.apply(Math, _toConsumableArray(region.coordinates[0].map(function (_ref15) {
            var _ref16 = _slicedToArray(_ref15, 2),
                x = _ref16[0],
                y = _ref16[1];

            return y;
          }))) - _box.y;
        }

        return _box;
      }

    case "keypoints":
      {
        var minX = Math.min.apply(Math, _toConsumableArray(Object.values(region.points).map(function (_ref17) {
          var x = _ref17.x,
              y = _ref17.y;
          return x;
        })));
        var minY = Math.min.apply(Math, _toConsumableArray(Object.values(region.points).map(function (_ref18) {
          var x = _ref18.x,
              y = _ref18.y;
          return y;
        })));
        var maxX = Math.max.apply(Math, _toConsumableArray(Object.values(region.points).map(function (_ref19) {
          var x = _ref19.x,
              y = _ref19.y;
          return x;
        })));
        var maxY = Math.max.apply(Math, _toConsumableArray(Object.values(region.points).map(function (_ref20) {
          var x = _ref20.x,
              y = _ref20.y;
          return y;
        })));
        return {
          x: minX,
          y: minY,
          w: maxX - minX,
          h: maxY - minY
        };
      }

    case "expanding-line":
      {
        var _box2 = {
          x: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref21) {
            var x = _ref21.x,
                y = _ref21.y;
            return x;
          }))),
          y: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref22) {
            var x = _ref22.x,
                y = _ref22.y;
            return y;
          }))),
          w: 0,
          h: 0
        };
        _box2.w = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref23) {
          var x = _ref23.x,
              y = _ref23.y;
          return x;
        }))) - _box2.x;
        _box2.h = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref24) {
          var x = _ref24.x,
              y = _ref24.y;
          return y;
        }))) - _box2.y;
        return _box2;
      }

    case "box":
      {
        return {
          x: region.x,
          y: region.y,
          w: region.w,
          h: region.h
        };
      }

    case "point":
      {
        return {
          x: region.x,
          y: region.y,
          w: 0,
          h: 0
        };
      }

    default:
      {
        return {
          x: 0,
          y: 0,
          w: 0,
          h: 0
        };
      }
  }

  throw new Error("unknown region");
};
export var moveRegion = function moveRegion(region, x, y) {
  if (x < 0) {
    x = 0;
  }

  if (x > 1) {
    x = 1;
  }

  if (y < 0) {
    y = 0;
  }

  if (y > 1) {
    y = 1;
  }

  var halfw = region.w / 2;

  if (x - halfw < 0) {
    x = halfw;
  }

  if (x + halfw > 1) {
    x = 1 - halfw;
  }

  var halfh = region.h / 2;

  if (y - halfh < 0) {
    y = halfh;
  }

  if (y + halfh > 1) {
    y = 1 - halfh;
  }

  switch (region.type) {
    case "point":
      {
        return _objectSpread({}, region, {
          x: x,
          y: y
        });
      }

    case "box":
      {
        return _objectSpread({}, region, {
          x: x - region.w / 2,
          y: y - region.h / 2
        });
      }
  }

  return region;
};