// @flow weak

import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react"
import type { Node } from "react"
import { Matrix } from "transformation-matrix-js"
import Crosshairs from "../Crosshairs"
import type {
  Region,
  Point,
  Polygon,
  Box,
  Keypoints,
  KeypointsDefinition,
} from "./region-tools.js"
import { makeStyles } from "@material-ui/core/styles"
import styles from "./styles"
import PreventScrollToParents from "../PreventScrollToParents"
import useWindowSize from "../hooks/use-window-size.js"
import useMouse from "./use-mouse"
import useProjectRegionBox from "./use-project-box"
import useExcludePattern from "../hooks/use-exclude-pattern"
import { useRafState } from "react-use"
import PointDistances from "../PointDistances"
import RegionTags from "../RegionTags"
import RegionLabel from "../RegionLabel"
import ImageMask from "../ImageMask"
import RegionSelectAndTransformBoxes from "../RegionSelectAndTransformBoxes"
import VideoOrImageCanvasBackground from "../VideoOrImageCanvasBackground"
import useEventCallback from "use-event-callback"
import RegionShapes from "../RegionShapes"
import useWasdMode from "./use-wasd-mode"
import getActiveImage from "../Annotator/reducers/get-active-image"
import { SetLatestMAtForControl } from "../Annotator/moduleDispatcher"
const useStyles = makeStyles(styles)

type Props = {
  regions: Array<Region>,
  imageSrc?: string,
  videoSrc?: string,
  videoTime?: number,
  keypointDefinitions?: KeypointDefinitions,
  onMouseMove?: ({ x: number, y: number }) => any,
  onMouseDown?: ({ x: number, y: number }) => any,
  onMouseUp?: ({ x: number, y: number }) => any,
  dragWithPrimary?: boolean,
  zoomWithPrimary?: boolean,
  createWithPrimary?: boolean,
  showTags?: boolean,
  realSize?: { width: number, height: number, unitName: string },
  showCrosshairs?: boolean,
  showMask?: boolean,
  showHighlightBox?: boolean,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  regionClsList?: Array<string>,
  regionTagList?: Array<string>,
  allowedArea?: { x: number, y: number, w: number, h: number },
  RegionEditLabel?: Node,
  videoPlaying?: boolean,
  zoomOnAllowedArea?: boolean,
  fullImageSegmentationMode?: boolean,
  autoSegmentationOptions?: Object,
  modifyingAllowedArea?: boolean,

  onChangeRegion: (Region) => any,
  onBeginRegionEdit: (Region) => any,
  onCloseRegionEdit: (Region) => any,
  onDeleteRegion: (Region) => any,
  onBeginBoxTransform: (Box, [number, number]) => any,
  onBeginMovePolygonPoint: (Polygon, index: number) => any,
  onBeginMoveKeypoint: (Keypoints, index: number) => any,
  onAddPolygonPoint: (Polygon, point: [number, number], index: number) => any,
  onSelectRegion: (Region) => any,
  onBeginMovePoint: (Point) => any,
  onImageOrVideoLoaded: ({
    naturalWidth: number,
    naturalHeight: number,
    duration?: number,
  }) => any,
  onChangeVideoTime: (number) => any,
  onRegionClassAdded: () => {},
  onChangeVideoPlaying?: Function,
}

export const defaultMat={
  lastMat:undefined
}
const getDefaultMat = (allowedArea = null, { iw, ih } = {}) => {
  let mat = defaultMat.lastMat || Matrix.from(1, 0, 0, 1, -10, -10)
  if (allowedArea && iw) {
    mat = mat
      .translate(allowedArea.x * iw, allowedArea.y * ih)
  }
  defaultMat.lastMat=mat
  return mat
}

export const ImageCanvas = ({
  state,
  regions,
  imageSrc,
  videoSrc,
  videoTime,
  realSize,
  activeImage,
  showTags,
  onMouseMove = (p) => null,
  onMouseDown = (p) => null,
  onMouseUp = (p) => null,
  dragWithPrimary = false,
  zoomWithPrimary = false,
  createWithPrimary = false,
  pointDistancePrecision = 0,
  regionClsList,
  regionTagList,
  showCrosshairs,
  showHighlightBox = true,
  showPointDistances,
  allowedArea,
  RegionEditLabel = null,
  videoPlaying = false,
  showMask = true,
  fullImageSegmentationMode,
  autoSegmentationOptions,
  onImageOrVideoLoaded,
  onChangeRegion,
  onBeginRegionEdit,
  onCloseRegionEdit,
  onBeginBoxTransform,
  onBeginMovePolygonPoint,
  onAddPolygonPoint,
  onBeginMoveKeypoint,
  onSelectRegion,
  onBeginMovePoint,
  onDeleteRegion,
  onChangeVideoTime,
  onChangeVideoPlaying,
  onRegionClassAdded,
  zoomOnAllowedArea = true,
  modifyingAllowedArea = false,
  keypointDefinitions,
}: Props) => {
  const classes = useStyles()

  const canvasEl = useRef(null)
  const layoutParams = useRef({})
  const [dragging, changeDragging] = useRafState(false)
  const [maskImagesLoaded, changeMaskImagesLoaded] = useRafState(0)
  const [zoomStart, changeZoomStart] = useRafState(null)
  const [zoomEnd, changeZoomEnd] = useRafState(null)
  const [mat, changeMat] = useRafState(getDefaultMat())
  const maskImages = useRef({})
  const windowSize = useWindowSize()
  const LastImageLoaded = useState('')
  const getLatestMat = useEventCallback(() => mat)
  useWasdMode({ getLatestMat, changeMat })

  const { mouseEvents, mousePosition } = useMouse({
    canvasEl,
    dragging,
    mat,
    layoutParams,
    changeMat,
    zoomStart,
    zoomEnd,
    changeZoomStart,
    changeZoomEnd,
    changeDragging,
    zoomWithPrimary,
    dragWithPrimary,
    onMouseMove,
    onMouseDown,
    onMouseUp,
  })

  useLayoutEffect(() => changeMat(mat.clone()), [windowSize])

  const innerMousePos = mat.applyToPoint(
    mousePosition.current.x,
    mousePosition.current.y
  )

  const projectRegionBox = useProjectRegionBox({ layoutParams, mat })

  const [imageDimensions, changeImageDimensions] = useState()
  const imageLoaded = Boolean(imageDimensions && imageDimensions.naturalWidth)
  const canvas = canvasEl.current
  const onVideoOrImageLoaded = useEventCallback(
    ({ naturalWidth, naturalHeight, duration }) => {
      const dims = { naturalWidth, naturalHeight, duration }
      if (onImageOrVideoLoaded) onImageOrVideoLoaded(dims)
      changeImageDimensions(dims)

      // Redundant update to fix rerendering issues
      setTimeout(() => {

        changeImageDimensions(dims)}, 10)
    }
  )

  if (canvas && imageLoaded && LastImageLoaded[0]!=imageSrc) {
    const { clientWidth, clientHeight } = canvas

    const fitScale = Math.max(
      imageDimensions.naturalWidth / (clientWidth - 20),
      imageDimensions.naturalHeight / (clientHeight - 20)
    )
   // const fitScale = 1

    const [iw, ih] = [
      imageDimensions.naturalWidth / fitScale,
      imageDimensions.naturalHeight / fitScale,
    ]

    layoutParams.current = {
      iw,
      ih,
      fitScale,
      canvasWidth: clientWidth,
      canvasHeight: clientHeight,
    }
    LastImageLoaded[1](imageSrc)
    console.debug(`SetLayoutParams`,layoutParams.current)
  }
  const excludePattern = useExcludePattern()




  useEffect(() => {
    if (!imageLoaded) return
    changeMat(
      getDefaultMat(
        zoomOnAllowedArea ? allowedArea : null,
        layoutParams.current
      )
    )
    // eslint-disable-next-line
  }, [imageLoaded])

  defaultMat.lastMat=mat

  useLayoutEffect(() => {
    if (!imageDimensions) return
    const { clientWidth, clientHeight } = canvas
    canvas.width = clientWidth
    canvas.height = clientHeight
    const context = canvas.getContext("2d")

    context.save()
    context.transform(...mat.clone().inverse().toArray())

    const { iw, ih } = layoutParams.current

    if (allowedArea) {
      // Pattern to indicate the NOT allowed areas
      const { x, y, w, h } = allowedArea
      context.save()
      context.globalAlpha = 1
      const outer = [
        [0, 0],
        [iw, 0],
        [iw, ih],
        [0, ih],
      ]
      const inner = [
        [x * iw, y * ih],
        [x * iw + w * iw, y * ih],
        [x * iw + w * iw, y * ih + h * ih],
        [x * iw, y * ih + h * ih],
      ]
      context.moveTo(...outer[0])
      outer.forEach((p) => context.lineTo(...p))
      context.lineTo(...outer[0])
      context.closePath()

      inner.reverse()
      context.moveTo(...inner[0])
      inner.forEach((p) => context.lineTo(...p))
      context.lineTo(...inner[0])

      context.fillStyle = excludePattern || "#f00"
      context.fill()

      context.restore()
    }

    context.restore()
  })

  const { iw, ih } = layoutParams.current

  let zoomBox =
    !zoomStart || !zoomEnd
      ? null
      : {
          ...mat.clone().inverse().applyToPoint(zoomStart.x, zoomStart.y),
          w: (zoomEnd.x - zoomStart.x) / mat.a,
          h: (zoomEnd.y - zoomStart.y) / mat.d,
        }
  if (zoomBox) {
    if (zoomBox.w < 0) {
      zoomBox.x += zoomBox.w
      zoomBox.w *= -1
    }
    if (zoomBox.h < 0) {
      zoomBox.y += zoomBox.h
      zoomBox.h *= -1
    }
  }

  const imagePosition = {
    topLeft: mat.clone().inverse().applyToPoint(0, 0),
    bottomRight: mat.clone().inverse().applyToPoint(iw, ih),
  }

  const highlightedRegion = useMemo(() => {
    const highlightedRegions = regions.filter((r) => r.highlighted)
    if (highlightedRegions.length !== 1) return null
    return highlightedRegions[0]
  }, [regions])

  SetLatestMAtForControl(state,mat)
  return (
    <div
      key="zoomBox_841"
      className="imageCanvasInstaceClass"
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "calc(100vh - 126px)",
        position: "relative",
        overflow: "hidden",
        cursor: createWithPrimary
          ? "crosshair"
          : dragging
          ? "grabbing"
          : dragWithPrimary
          ? "grab"
          : zoomWithPrimary
          ? mat.a < 1
            ? "zoom-out"
            : "zoom-in"
          : undefined,
      }}
    >
      {showCrosshairs && (
        <Crosshairs key="crossHairs" mousePosition={mousePosition} />
      )}
      {imageLoaded && !dragging && (
        <RegionSelectAndTransformBoxes
          key={"regionSelectAndTransformBoxes"}
          state={state}
          regions={
            !modifyingAllowedArea || !allowedArea
              ? regions
              : [
                  {
                    type: "box",
                    id: "$$allowed_area",
                    cls: "allowed_area",
                    highlighted: true,
                    x: allowedArea.x,
                    y: allowedArea.y,
                    w: allowedArea.w,
                    h: allowedArea.h,
                    visible: true,
                    color: "#ff0",
                  },
                ]
          }
          mouseEvents={mouseEvents}
          projectRegionBox={projectRegionBox}
          dragWithPrimary={dragWithPrimary}
          createWithPrimary={createWithPrimary}
          zoomWithPrimary={zoomWithPrimary}
          onBeginMovePoint={onBeginMovePoint}
          onSelectRegion={onSelectRegion}
          layoutParams={layoutParams}
          mat={mat}
          onBeginBoxTransform={onBeginBoxTransform}
          onBeginMovePolygonPoint={onBeginMovePolygonPoint}
          onBeginMoveKeypoint={onBeginMoveKeypoint}
          onAddPolygonPoint={onAddPolygonPoint}
          showHighlightBox={showHighlightBox}
        />
      )}
      {imageLoaded && showTags && !dragging && (
        <PreventScrollToParents key="regionTags">
          <RegionTags
            key="zoomBox_841"
            state={state}
            regions={regions}
            projectRegionBox={projectRegionBox}
            mouseEvents={mouseEvents}
            regionClsList={regionClsList}
            regionTagList={regionTagList}
            onBeginRegionEdit={onBeginRegionEdit}
            onChangeRegion={onChangeRegion}
            onCloseRegionEdit={onCloseRegionEdit}
            onDeleteRegion={onDeleteRegion}
            layoutParams={layoutParams}
            imageSrc={imageSrc}
            RegionEditLabel={RegionEditLabel}
            onRegionClassAdded={onRegionClassAdded}
          />
        </PreventScrollToParents>
      )}
      {!showTags && highlightedRegion && (
        <div
          key="zoomBox_941"
          onClick={()=>{
          console.debug('REACTSTATE',state)
        }} key="topLeftTag" className={classes.fixedRegionLabel}>
          <RegionLabel
            key="zoomBox_945"
            disableClose
            allowedClasses={regionClsList}
            allowedTags={regionTagList}
            onChange={onChangeRegion}
            onDelete={onDeleteRegion}
            editing
            region={highlightedRegion}
            imageSrc={imageSrc}
            state={state}
          />
        </div>
      )}

      {zoomWithPrimary && zoomBox !== null && (
        <div
          key="zoomBox_943"
          style={{
            position: "absolute",
            zIndex: 1,
            border: "1px solid #fff",
            pointerEvents: "none",
            left: zoomBox.x,
            top: zoomBox.y,
            width: zoomBox.w,
            height: zoomBox.h,
          }}
        />
      )}
      {showPointDistances && (
        <PointDistances
          key="regionShapes_8"
          key="pointDistances"
          regions={regions}
          realSize={realSize}
          projectRegionBox={projectRegionBox}
          pointDistancePrecision={pointDistancePrecision}
        />
      )}
      <PreventScrollToParents
        key="regionShapes_5"
        style={{ width: "100%", height: "100%" }}
        {...mouseEvents}
      >
        <>
          {fullImageSegmentationMode && (
            <ImageMask
              key="regionShapes_0"
              hide={!showMask}
              autoSegmentationOptions={autoSegmentationOptions}
              imagePosition={imagePosition}
              regionClsList={regionClsList}
              imageSrc={imageSrc}
              regions={regions}
            />
          )}
          <canvas
            style={{ opacity: 0.25 }}
            className={classes.canvas}
            ref={canvasEl}
          />
          <RegionShapes
            key="regionShapes_1"
            mat={mat}
            keypointDefinitions={keypointDefinitions}
            imagePosition={imagePosition}
            regions={regions}
            fullSegmentationMode={fullImageSegmentationMode}
          />
          <VideoOrImageCanvasBackground
            key="regionShapes_2"
            videoPlaying={videoPlaying}
            state={state}
            imagePosition={imagePosition}
            mouseEvents={mouseEvents}
            onLoad={onVideoOrImageLoaded}
            videoTime={videoTime}
            videoSrc={videoSrc}
            imageSrc={imageSrc}
            useCrossOrigin={fullImageSegmentationMode}
            onChangeVideoTime={onChangeVideoTime}
            onChangeVideoPlaying={onChangeVideoPlaying}
          />
          {activeImage && activeImage.heatmaps && activeImage.heatmaps.length && activeImage.heatmaps.map((url,i)=>{
            return   <VideoOrImageCanvasBackground
            key={url+i}
            state={state}
            videoPlaying={false}
            imagePosition={imagePosition}
            mouseEvents={mouseEvents}
            imageSrc={url}
            useCrossOrigin={fullImageSegmentationMode}
          />
          }) }
        </>
      </PreventScrollToParents>
      <div  onClick={()=>{
        const ac=getActiveImage(state)
          console.debug('REACTSTATE',{img:ac && state.images[ac.currentImageIndex], activeImg:ac,state})
        }} className={`${classes.zoomIndicator} zoomIndicator`}>
        {((1 / mat.a) * 100).toFixed(0)}%
      </div>
    </div>
  )
}

export default ImageCanvas
