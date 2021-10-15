// @flow

import type {Node} from "react"
import React, {useEffect, useReducer} from "react"
import MainLayout from "../MainLayout"
import type {Action, Image, MainLayoutImageAnnotationState, MainLayoutState,} from "../MainLayout/types"
import type {KeypointsDefinition} from "../ImageCanvas/region-tools"
import SettingsProvider from "../SettingsProvider"

import combineReducers from "./reducers/combine-reducers.js"
import generalReducer from "./reducers/general-reducer.js"
import imageReducer from "./reducers/image-reducer.js"
import videoReducer from "./reducers/video-reducer.js"
import historyHandler from "./reducers/history-handler.js"

import useEventCallback from "use-event-callback"
import makeImmutable, {without} from "seamless-immutable"
import {AnnotatorModule} from './moduleDispatcher'


type Props = {
  taskDescription?: string,
  allowedArea?: { x: number, y: number, w: number, h: number },
  regionTagList?: Array<string>,
  regionClsList?: Array<string> | Array<{ name: string, color: string }>,
  imageTagList?: Array<string>,
  imageClsList?: Array<string>,
  enabledTools?: Array<string>,
  selectedTool?: String,
  showTags?: boolean,
  selectedImage?: string | number,
  images?: Array<Image>,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  RegionEditLabel?: Node,
  onExit: (MainLayoutState) => any,
  videoTime?: number,
  videoSrc?: string,
  keyframes?: Object,
  videoName?: string,
  keypointDefinitions: KeypointsDefinition,
  fullImageSegmentationMode?: boolean,
  autoSegmentationOptions?:
    | {| type: "simple" |}
    | {| type: "autoseg", maxClusters?: number, slicWeightFactor?: number |},
  hideHeader?: boolean,
  hideHeaderText?: boolean,
  hideNext?: boolean,
  hidePrev?: boolean,
  hideSave?: boolean,
  buttonsWithDispatch?: any,
  customReducer?: any,
  underCanvasComponent?: any,
}

export const Annotator = ({
                            images,
                            allowedArea,
                            selectedImage = images && images.length > 0 ? 0 : undefined,
                            showPointDistances,
                            pointDistancePrecision,
                            showTags = true,
                            enabledTools = [
                              "select",
                              "create-point",
                              "create-box",
                              "create-polygon",
                              "create-expanding-line",
                              "show-mask",
                            ],
                            hideRightSidebarSections = {},
                            rightSidebarOnLeft = false,
                            rightSidebarInjectedSections = [],
                            rightSidebarInjectedSectionsBottom = [],
                            controlId = '',
                            selectedTool = "select",
                            regionTagList = [],
                            regionClsList = [],
                            imageTagList = [],
                            imageClsList = [],
                            keyframes = {},
                            taskDescription = "",
                            fullImageSegmentationMode = false,
                            RegionEditLabel,
                            topBarOpts,
                            readOnly,
                            headerAddedItems,
                            headerSubSection,
                            videoSrc,
                            videoTime = 0,
                            videoName,
                            onExit,
                            onNextImage,
                            onPrevImage,
                            keypointDefinitions,
                            autoSegmentationOptions = {type: "autoseg"},
                            hideHeader,
                            hideHeaderText,
                            hideNext,
                            hidePrev,
                            hideSave,
                            buttonsWithDispatch,
                            customReducer,
                            underCanvasComponent,
                          }: Props) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const colors = [];
  for (const clsIndex in regionClsList) {
    const cls = regionClsList[clsIndex];
    if (typeof cls !== 'string') {
      let color = cls.color;
      while (color.startsWith("#")) {
        color = color.slice(1);
      }
      colors.push(`#${color}`);
      regionClsList[clsIndex] = cls.name;
    }
  }

  const annotationType = images ? "image" : "video";

  const _customReducer = (state: MainLayoutImageAnnotationState, action: Action) => {
    if (typeof customReducer === 'function') {
      return customReducer(state, action);
    }
    return state;
  };

  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        annotationType === "image" ? imageReducer : videoReducer,
        generalReducer,
        _customReducer,
      )
    ),
    makeImmutable({
      annotationType,
      showTags,
      allowedArea,
      showPointDistances,
      pointDistancePrecision,
      selectedTool,
      fullImageSegmentationMode: fullImageSegmentationMode,
      autoSegmentationOptions,
      mode: null,
      taskDescription,
      showMask: true,
      labelImages: imageClsList.length > 0 || imageTagList.length > 0,
      regionClsList,
      colors,
      regionTagList,
      imageClsList,
      hideRightSidebarSections,
      topBarOpts,
      readOnly,
      headerSubSection,
      headerAddedItems,
      rightSidebarInjectedSections,
      rightSidebarInjectedSectionsBottom,
      controlId,
      rightSidebarOnLeft,
      imageTagList,
      currentVideoTime: videoTime,
      enabledTools,
      history: [],
      videoName,
      keypointDefinitions,
      ...(annotationType === "image"
        ? {
          selectedImage,
          images,
          selectedImageFrameTime:
            images && images.length > 0 ? images[0].frameTime : undefined,
        }
        : {
          videoSrc,
          keyframes,
        }),
    })
  )

  const dispatch = useEventCallback((action: Action) => {
    if (action.type === "HEADER_BUTTON_CLICKED") {
      if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
        return onExit(without(state, "history"))
      }
      else if (action.buttonName === "Next" && onNextImage) {
        return onNextImage(without(state, "history"))
      }
      else if (action.buttonName === "Prev" && onPrevImage) {
        return onPrevImage(without(state, "history"))
      }
    }
    dispatchToReducer(action)
  })


  AnnotatorModule.dispatch = dispatch;

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  useEffect(() => {
    if (selectedImage === undefined) return
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage],
    })
  }, [selectedImage, state.images])

  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'

  return (
    <SettingsProvider>
      <MainLayout
        RegionEditLabel={RegionEditLabel}
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        rightSidebarOnLeft={rightSidebarOnLeft}
        hideRightSidebarSections={hideRightSidebarSections}
        rightSidebarInjectedSections={rightSidebarInjectedSections}
        rightSidebarInjectedSectionsBottom={rightSidebarInjectedSectionsBottom}
        controlId={controlId}
        headerSubSection={headerSubSection}
        readOnly={readOnly}
        topBarOpts={topBarOpts}
        headerAddedItems={headerAddedItems}
        dispatch={dispatch}
        onRegionClassAdded={onRegionClassAdded}
        hideHeader={hideHeader}
        hideHeaderText={hideHeaderText}
        hideNext={hideNext}
        hidePrev={hidePrev}
        hideSave={hideSave}
        buttonsWithDispatch={buttonsWithDispatch}
        underCanvasComponent={underCanvasComponent}
      />
    </SettingsProvider>
  )
}

export default Annotator
