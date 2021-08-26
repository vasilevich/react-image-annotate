// @flow

import React, { useState, memo, useCallback } from "react"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import ExpandIcon from "@material-ui/icons/ExpandMore"
import IconButton from "@material-ui/core/IconButton"
import Collapse from "@material-ui/core/Collapse"
import { grey } from "@material-ui/core/colors"
import classnames from "classnames"
import useEventCallback from "use-event-callback"
import Typography from "@material-ui/core/Typography"
import { useIconDictionary } from "../icon-dictionary.js"
import ResizePanel from "@seveibar/react-resize-panel"

const useStyles = makeStyles({
  container: {
    borderBottom: `2px solid ${grey[400]}`,
    "&:first-child": { borderTop: `1px solid ${grey[400]}` }
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    paddingLeft: 16,
    paddingRight: 12,
    "& .iconContainer": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16
      }
    }
  },
  title: {
    fontSize: 11,
    flexGrow: 1,
    fontWeight: 800,
    paddingLeft: 8,
    "& span": {
      fontSize: 11
    }
  },
  expandButton: {
    padding: 0,
    width: 30,
    height: 30,
    "& .icon": {
      width: 20,
      height: 20,
      transition: "500ms transform",
      "&.expanded": {
        transform: "rotate(180deg)"
      }
    }
  },
  expandedContent: {
    "&.noScroll": {
      overflowY: "visible",
      overflow: "visible"
    }
  }
})

const getExpandedFromLocalStorage = title => {
  try {
    return JSON.parse(
      window.localStorage[`__REACT_WORKSPACE_SIDEBAR_EXPANDED_${title}`]
    )
  } catch (e) {
    return false
  }
}
const setExpandedInLocalStorage = (title, expanded) => {
  window.localStorage[
    `__REACT_WORKSPACE_SIDEBAR_EXPANDED_${title}`
  ] = JSON.stringify(expanded)
}

export const SidebarBox = ({
  icon,
  title,
  subTitle,
  children,
  noScroll = false,
  expandedByDefault
}) => {
  const classes = useStyles()
  const content = (
    <div
      className={classnames(classes.expandedContent, noScroll && "noScroll")}
    >
      {children}
    </div>
  )

  const [expanded, changeExpandedState] = useState(
    expandedByDefault === undefined
      ? getExpandedFromLocalStorage(title)
      : expandedByDefault
  )
  const changeExpanded = useCallback(
    expanded => {
      changeExpandedState(expanded)
      setExpandedInLocalStorage(title, expanded)
    },
    [changeExpandedState, title]
  )

  const toggleExpanded = useEventCallback(() => changeExpanded(!expanded))
  const customIconMapping = useIconDictionary()
  const TitleIcon = customIconMapping[title.toLowerCase()]
  return (
    <div className={classes.container}>
      <div className={classes.header} style={{position:'sticky',top:0,zIndex:1}}>
        <div className="iconContainer">
          {icon || <TitleIcon className={classes.titleIcon} />}
        </div>
        <Typography className={classes.title}>
          {title} <span>{subTitle}</span>
        </Typography>
        <IconButton onClick={toggleExpanded} className={classes.expandButton}>
          <ExpandIcon className={classnames("icon", expanded && "expanded")} />
        </IconButton>
      </div>
      {(noScroll || 1) ? (
        expanded ? (
          content
        ) : null
      ) : (
        <Collapse in={expanded}>
          <ResizePanel direction="s" style={{ height: 200 }}>
            <div
              className="panel"
              style={{ display: "block", overflow: "hidden", height: 500 }}
            >
              {content}
            </div>
          </ResizePanel>
        </Collapse>
      )}
    </div>
  )
}

export default memo(
  SidebarBox,
  (prev, next) => prev.title === next.title && prev.children === next.children
)
