// @flow

import type {Node} from "react"
import React, {useCallback, useRef} from "react"
import {makeStyles, styled} from "@material-ui/core/styles"
import ImageCanvas from "../ImageCanvas"
import styles from "./styles"
import type {Action, MainLayoutState} from "./types"
import useKey from "use-key-hook"
import classnames from "classnames"
import {useSettings} from "../SettingsProvider"
import SettingsDialog from "../SettingsDialog"
import {FullScreen, useFullScreenHandle} from "react-full-screen"
import getActiveImage from "../Annotator/reducers/get-active-image"
import useImpliedVideoRegions from "./use-implied-video-regions"
import {useDispatchHotkeyHandlers} from "../ShortcutsManager"
import {withHotKeys} from "react-hotkeys"
import iconDictionary from "./icon-dictionary"
import KeyframeTimeline from "../KeyframeTimeline"
import Workspace from "../Workspace/Workspace"
import DebugBox from "../DebugSidebarBox"
import TagsSidebarBox from "../TagsSidebarBox"
import KeyframesSelector from "../KeyframesSelectorSidebarBox"
import TaskDescription from "../TaskDescriptionSidebarBox"
import RegionSelector from "../RegionSelectorSidebarBox"
import ChangesInSessionBox from "../ChangesInSessionBox"
import HistoryBox from "../HistoryBox"
import useEventCallback from "use-event-callback"
import getHotkeyHelpText from "../utils/get-hotkey-help-text"

const emptyArr = []
const useStyles = makeStyles(styles)

const HotkeyDiv = withHotKeys(({hotKeys, children, divRef, ...props}) => (
  <div {...{...hotKeys, ...props}} ref={divRef}>
    {children}
  </div>
))

const FullScreenContainer = styled("div")({
  width: "100%",
  height: "100%",
  "& .fullscreen": {
    width: "100%",
    height: "100%",
  },
})

type Props = {
  state: MainLayoutState,
  RegionEditLabel?: Node,
  dispatch: (Action) => any,
  alwaysShowNextButton?: boolean,
  alwaysShowPrevButton?: boolean,
  onRegionClassAdded: () => {},
  hideHeader?: boolean,
  hideHeaderText?: boolean,
  //from tinus
  hideRightSidebarSections: {
    'tasks': boolean,
    history: boolean
  },
  rightSidebarInjectedSections: [],
  rightSidebarInjectedSectionsBottom: [],
  controlId?: string,
  rightSidebarOnLeft: boolean,
  topBarOpts: {},
  readOnly: Boolean,
  buttonsWithDispatch: any[],
  underCanvasComponent?:any,
}

export const MainLayout = ({
                             state,
                             dispatch,
                             alwaysShowNextButton = false,
                             alwaysShowPrevButton = false,
                             RegionEditLabel,
                             onRegionClassAdded,
                             hideHeader,
                             hideHeaderText,
                             headerAddedItems,
                             readOnly,
                             rightSidebarOnLeft,
                             hideRightSidebarSections = {
                               'tasks': true,
                               history: false
                             },
                             rightSidebarInjectedSections = [],
                             rightSidebarInjectedSectionsBottom = [],
                             topBarOpts,
                             headerSubSection,
                             controlId,
                             hideNext = false,
                             hidePrev = false,
                             hideSave = false,
                             buttonsWithDispatch = (dispatch) => null,
                             underCanvasComponent = null,
                           }: Props) => {
  const classes = useStyles()
  const settings = useSettings()
  const fullScreenHandle = useFullScreenHandle()

  const memoizedActionFns = useRef({})
  const action = (type: string, ...params: Array<string>) => {
    const fnKey = `${type}(${params.join(",")})`
    if (memoizedActionFns.current[fnKey])
      return memoizedActionFns.current[fnKey]

    const fn = (...args: any) =>
      params.length > 0
        ? dispatch(
          ({
            type,
            ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
          }: any)
        ) : dispatch({type, ...args[0]})
    memoizedActionFns.current[fnKey] = fn
    return fn
  }

  const {currentImageIndex, activeImage} = getActiveImage(state)
  let nextImage
  if (currentImageIndex !== null) {
    nextImage = state.images[currentImageIndex + 1]
  }

  useKey(() => dispatch({type: "CANCEL"}), {
    detectKeys: [27],
  })

  const isAVideoFrame = activeImage && activeImage.frameTime !== undefined
  const innerContainerRef = useRef()
  const hotkeyHandlers = useDispatchHotkeyHandlers({dispatch})

  let impliedVideoRegions = useImpliedVideoRegions(state)

  if (state.readOnly !== readOnly) {
    console.debug(`InvokingActionForReadOnly!!`, state.readOnly, readOnly)
    dispatch({type: "READONLY", val: readOnly})
  }
  // if(state.readOnly)
  // {
  //   console.debug(`MainlayoutRender::tagger!!render`,{readOnly: state.readOnly})
  // }

  const refocusOnMouseEvent = useCallback((e) => {
    if (!innerContainerRef.current) return
    if (innerContainerRef.current.contains(document.activeElement)) return
    if (innerContainerRef.current.contains(e.target)) {
      innerContainerRef.current.focus()
      e.target.focus()
    }
  }, [])
  const canvas = (
    <ImageCanvas
      {...settings}
      state={state}
      showCrosshairs={
        settings.showCrosshairs &&
        !["select", "pan", "zoom"].includes(state.selectedTool)
      }
      key={state.selectedImage}
      showMask={state.showMask}
      fullImageSegmentationMode={state.fullImageSegmentationMode}
      autoSegmentationOptions={state.autoSegmentationOptions}
      showTags={!state.readOnly && state.showTags || false}
      activeImage={activeImage}
      allowedArea={state.allowedArea}
      modifyingAllowedArea={state.selectedTool === "modify-allowed-area"}
      regionClsList={state.regionClsList}
      regionTagList={state.regionTagList}
      regions={
        state.annotationType === "image"
          ? activeImage.regions || []
          : impliedVideoRegions
      }
      realSize={activeImage ? activeImage.realSize : undefined}
      videoPlaying={state.videoPlaying}
      imageSrc={state.annotationType === "image" ? activeImage.src : null}
      videoSrc={state.annotationType === "video" ? state.videoSrc : null}
      pointDistancePrecision={state.pointDistancePrecision}
      createWithPrimary={state.selectedTool.includes("create")}
      dragWithPrimary={state.selectedTool === "pan"}
      zoomWithPrimary={state.selectedTool === "zoom"}
      showPointDistances={state.showPointDistances}
      videoTime={
        state.annotationType === "image"
          ? state.selectedImageFrameTime
          : state.currentVideoTime
      }
      keypointDefinitions={state.keypointDefinitions}
      onMouseMove={action("MOUSE_MOVE")}
      onMouseDown={action("MOUSE_DOWN")}
      onMouseUp={action("MOUSE_UP")}
      onChangeRegion={action("CHANGE_REGION", "region")}
      onBeginRegionEdit={action("OPEN_REGION_EDITOR", "region")}
      onCloseRegionEdit={action("CLOSE_REGION_EDITOR", "region")}
      onDeleteRegion={action("DELETE_REGION", "region")}
      onBeginBoxTransform={action("BEGIN_BOX_TRANSFORM", "box", "directions")}
      onBeginMovePolygonPoint={action(
        "BEGIN_MOVE_POLYGON_POINT",
        "polygon",
        "pointIndex"
      )}
      onBeginMoveKeypoint={action(
        "BEGIN_MOVE_KEYPOINT",
        "region",
        "keypointId"
      )}
      onAddPolygonPoint={action(
        "ADD_POLYGON_POINT",
        "polygon",
        "point",
        "pointIndex"
      )}
      onSelectRegion={action("SELECT_REGION", "region")}
      onBeginMovePoint={action("BEGIN_MOVE_POINT", "point")}
      onImageLoaded={action("IMAGE_LOADED", "image")}
      RegionEditLabel={RegionEditLabel}
      onImageOrVideoLoaded={action("IMAGE_OR_VIDEO_LOADED", "metadata")}
      onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
      onChangeVideoPlaying={action("CHANGE_VIDEO_PLAYING", "isPlaying")}
      onRegionClassAdded={onRegionClassAdded}
    />
  )

  const onClickIconSidebarItem = useEventCallback((item) => {
    dispatch({type: "SELECT_TOOL", selectedTool: item.name})
  })

  const onClickHeaderItem = useEventCallback((item) => {
    if (item.name === "Fullscreen") {
      fullScreenHandle.enter()
    }
    else if (item.name === "Window") {
      fullScreenHandle.exit()
    }
    dispatch({type: "HEADER_BUTTON_CLICKED", buttonName: item.name})
  })

  const debugModeOn = Boolean(window.localStorage.$ANNOTATE_DEBUG_MODE && state)
  const nextImageHasRegions =
    !nextImage || (nextImage.regions && nextImage.regions.length > 0)

  return (
    <FullScreenContainer>
      <FullScreen
        handle={fullScreenHandle}
        onChange={(open) => {
          if (!open) {
            fullScreenHandle.exit()
            action("HEADER_BUTTON_CLICKED", "buttonName")("Window")
          }
        }}
      >
        <HotkeyDiv
          tabIndex={-1}
          divRef={innerContainerRef}
          onMouseDown={refocusOnMouseEvent}
          onMouseOver={refocusOnMouseEvent}
          allowChanges
          handlers={hotkeyHandlers}
          className={classnames(
            classes.container,
            state.fullScreen && "Fullscreen"
          )}
        >
          <Workspace
            rightSidebarOnLeft={rightSidebarOnLeft}
            iconDictionary={iconDictionary}
            hideHeader={hideHeader}
            hideHeaderText={hideHeaderText}
            headerLeftSide={[
              state.annotationType === "video" ? (
                <KeyframeTimeline
                  key={1}
                  currentTime={state.currentVideoTime}
                  duration={state.videoDuration}
                  onChangeCurrentTime={action("CHANGE_VIDEO_TIME", "newTime")}
                  keyframes={state.keyframes}
                />
              ) : activeImage ? (
                <div key={2} className={classes.headerTitle}>{activeImage.name}</div>
              ) : null,
            ].filter(Boolean)}
            headerSubSection={headerSubSection}
            headerAddedItems={<>{headerAddedItems} {buttonsWithDispatch(dispatch)}</>}
            headerItems={[
              !nextImageHasRegions && !(topBarOpts && topBarOpts.hide && topBarOpts.hide.clone) && !readOnly && activeImage.regions && {name: "Clone"},
              !hidePrev && {name: "Prev"},
              !hideNext && {name: "Next"},
              state.annotationType !== "video"
                ? null
                : !state.videoPlaying
                  ? {name: "Play"}
                  : {name: "Pause"},
              //  !(topBarOpts && topBarOpts.hide && topBarOpts.hide.settings) && { name: "Settings" },
              //  !(topBarOpts && topBarOpts.hide && topBarOpts.hide.fullscreen) &&  (state.fullScreen ? { name: "Window" } : { name: "Fullscreen" }),
              !hideSave && !(topBarOpts && topBarOpts.hide && topBarOpts.hide.save) && {name: "Save"},
            ].filter(Boolean)}
            onClickHeaderItem={onClickHeaderItem}
            onClickIconSidebarItem={onClickIconSidebarItem}
            selectedTools={[
              state.selectedTool,
              state.showTags && "show-tags",
              state.showMask && "show-mask",
            ].filter(Boolean)}
            iconSidebarItems={[
              {
                name: "select",
                helperText: "Select" + getHotkeyHelpText("select_tool"),
                alwaysShowing: true,
              },
              {
                name: "pan",
                helperText:
                  "Drag/Pan (right or middle click)" +
                  getHotkeyHelpText("pan_tool"),
                alwaysShowing: true,
              },
              {
                name: "zoom",
                helperText:
                  "Zoom In/Out (scroll)" + getHotkeyHelpText("zoom_tool"),
                alwaysShowing: true,
              },
         //     !state.readOnly && {
         //       name: "show-tags",
         //       helperText: "Show / Hide Tags",
         //       alwaysShowing: true,
         //     },
              {
                name: "create-point",
                helperText: "Add Point" + getHotkeyHelpText("create_point"),
              },
              {
                name: "create-box",
                helperText:
                  "Add Bounding Box" + getHotkeyHelpText("create_bounding_box"),
              },
              {
                name: "create-polygon",
                helperText: "Add Polygon" + getHotkeyHelpText("create_polygon"),
              },
              {
                name: "create-expanding-line",
                helperText: "Add Expanding Line",
              },
              {
                name: "create-keypoints",
                helperText: "Add Keypoints (Pose)",
              },
              state.fullImageSegmentationMode && {
                name: "show-mask",
                alwaysShowing: true,
                helperText: "Show / Hide Mask",
              },
              {
                name: "modify-allowed-area",
                helperText: "Modify Allowed Area",
              },
            ]
              .filter(Boolean)
              .filter(
                (a) => a.alwaysShowing || state.enabledTools.includes(a.name)
              )}
            rightSidebarItems={[
              debugModeOn && (
                <DebugBox key={'bgh'} state={debugModeOn} lastAction={state.lastAction}/> ||
                <React.Fragment key="bjdd"></React.Fragment>
              ),
              ...rightSidebarInjectedSections || [],
              state.taskDescription && !hideRightSidebarSections.tasks && (
                <TaskDescription key={10} description={state.taskDescription}/>
              ),
              state.labelImages && (
                <TagsSidebarBox
                  key={3}
                  currentImage={activeImage}
                  imageClsList={state.imageClsList}
                  imageTagList={state.imageTagList}
                  onChangeImage={action("CHANGE_IMAGE", "delta")}
                  expandedByDefault
                />
              ),

              <RegionSelector
                key={4}
                regions={activeImage ? activeImage.regions : emptyArr}
                state={state}
                onSelectRegion={action("SELECT_REGION", "region")}
                onDeleteRegion={action("DELETE_REGION", "region")}
                onChangeRegion={action("CHANGE_REGION", "region")}
              />,
              state.keyframes && (
                <KeyframesSelector
                  key={5}
                  onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
                  onDeleteKeyframe={action("DELETE_KEYFRAME", "time")}
                  onChangeCurrentTime={action("CHANGE_VIDEO_TIME", "newTime")}
                  currentTime={state.currentVideoTime}
                  duration={state.videoDuration}
                  keyframes={state.keyframes}
                />
              ),
              !hideRightSidebarSections.history && <ChangesInSessionBox
                key={6}
                history={state.history}
                onRestoreHistory={action("RESTORE_HISTORY")}
              />,
              <HistoryBox
                key={7}
                history={activeImage.history}
              />,
              ...rightSidebarInjectedSectionsBottom || []
            ].filter(Boolean)}
          >
            {canvas}
            {underCanvasComponent}
          </Workspace>
          <SettingsDialog
            open={state.settingsOpen}
            onClose={() =>
              dispatch({
                type: "HEADER_BUTTON_CLICKED",
                buttonName: "Settings",
              })
            }
          />
        </HotkeyDiv>
      </FullScreen>
    </FullScreenContainer>
  )
}

export default MainLayout
