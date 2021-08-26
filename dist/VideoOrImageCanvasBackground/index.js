import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { styled } from "@material-ui/core/styles";
import useEventCallback from "use-event-callback";
import { useSettings } from "../SettingsProvider";
import { GetInjectedImageState } from "../Annotator/moduleDispatcher";
var Video = styled("video")({
  zIndex: 0,
  position: "absolute"
});
var StyledImage = styled("img")({
  zIndex: 0,
  position: "absolute"
});
var Error = styled("div")({
  zIndex: 0,
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  backgroundColor: "rgba(255,0,0,0.2)",
  color: "#ff0000",
  fontWeight: "bold",
  whiteSpace: "pre-wrap",
  padding: 50
});
export default (function (_ref) {
  var state = _ref.state,
      imagePosition = _ref.imagePosition,
      mouseEvents = _ref.mouseEvents,
      videoTime = _ref.videoTime,
      videoSrc = _ref.videoSrc,
      imageSrc = _ref.imageSrc,
      onLoad = _ref.onLoad,
      _ref$useCrossOrigin = _ref.useCrossOrigin,
      useCrossOrigin = _ref$useCrossOrigin === void 0 ? false : _ref$useCrossOrigin,
      videoPlaying = _ref.videoPlaying,
      onChangeVideoTime = _ref.onChangeVideoTime,
      onChangeVideoPlaying = _ref.onChangeVideoPlaying;
  var settings = useSettings();
  var videoRef = useRef();
  var imageRef = useRef();

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      error = _useState2[0],
      setError = _useState2[1];

  useEffect(function () {
    if (!videoPlaying && videoRef.current) {
      videoRef.current.currentTime = (videoTime || 0) / 1000;
    }
  }, [videoTime]);
  useEffect(function () {
    var renderLoopRunning = false;

    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.play();
        renderLoopRunning = true;

        if (settings.videoPlaybackSpeed) {
          videoRef.current.playbackRate = parseFloat(settings.videoPlaybackSpeed);
        }
      } else {
        videoRef.current.pause();
      }
    }

    function checkForNewFrame() {
      if (!renderLoopRunning) return;
      if (!videoRef.current) return;
      var newVideoTime = Math.floor(videoRef.current.currentTime * 1000);

      if (videoTime !== newVideoTime) {
        onChangeVideoTime(newVideoTime);
      }

      if (videoRef.current.paused) {
        renderLoopRunning = false;
        onChangeVideoPlaying(false);
      }

      requestAnimationFrame(checkForNewFrame);
    }

    checkForNewFrame();
    return function () {
      renderLoopRunning = false;
    };
  }, [videoPlaying]);
  var onLoadedVideoMetadata = useEventCallback(function (event) {
    var videoElm = event.currentTarget;
    videoElm.currentTime = (videoTime || 0) / 1000;
    if (onLoad) onLoad({
      naturalWidth: videoElm.videoWidth,
      naturalHeight: videoElm.videoHeight,
      videoElm: videoElm,
      duration: videoElm.duration
    });
  });
  var onImageLoaded = useEventCallback(function (event) {
    var imageElm = event.currentTarget;
    if (onLoad) onLoad({
      naturalWidth: imageElm.naturalWidth,
      naturalHeight: imageElm.naturalHeight,
      imageElm: imageElm
    });
  });
  var onImageError = useEventCallback(function (event) {
    setError("!\n\n".concat(imageSrc || videoSrc));
  });
  var stylePosition = useMemo(function () {
    var width = imagePosition.bottomRight.x - imagePosition.topLeft.x;
    var height = imagePosition.bottomRight.y - imagePosition.topLeft.y;
    return {
      imageRendering: "pixelated",
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height
    };
  }, [imagePosition.topLeft.x, imagePosition.topLeft.y, imagePosition.bottomRight.x, imagePosition.bottomRight.y]);
  var injectedCanvas = GetInjectedImageState(state, imageSrc || videoSrc || '');
  if (!videoSrc && !imageSrc && !injectedCanvas) return React.createElement(Error, null, "No imageSrc or videoSrc provided");
  if (error) return React.createElement(Error, null, error);
  return React.createElement(React.Fragment, null, injectedCanvas && !!injectedCanvas.CanvasWrapper && React.createElement(injectedCanvas.CanvasWrapper, Object.assign({}, injectedCanvas.props, {
    style: stylePosition
  })) || imageSrc && videoTime === undefined && React.createElement(StyledImage, Object.assign({}, mouseEvents, {
    src: imageSrc,
    ref: imageRef,
    style: stylePosition,
    onLoad: onImageLoaded,
    onError: onImageError,
    crossOrigin: useCrossOrigin ? "anonymous" : undefined
  })) || (imageSrc || videoSrc) && React.createElement(Video, Object.assign({}, mouseEvents, {
    ref: videoRef,
    style: stylePosition,
    onLoadedMetadata: onLoadedVideoMetadata,
    src: videoSrc || imageSrc
  })), ")");
});