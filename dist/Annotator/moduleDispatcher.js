export var AnnotatorModule = {
  dispatch: function dispatch(a) {},
  controlInjLookupsPerControlId: {
    d: {}
  }
};
export function GetInjectedImageState(state, imgUrl) {
  var cId = state && state.controlId;

  if (cId) {
    var ctl = AnnotatorModule.controlInjLookupsPerControlId.d[cId];

    if (ctl && ctl.getimgdata) {
      return ctl.getimgdata(imgUrl, state);
    }
  }

  return undefined;
}
export function SetLatestMAtForControl(state, mat) {
  var cId = state && state.controlId;

  if (cId) {
    var ctl = AnnotatorModule.controlInjLookupsPerControlId.d[cId];

    if (ctl) {
      return ctl.annotatorLayoutMatrix = mat;
    }
  }
}