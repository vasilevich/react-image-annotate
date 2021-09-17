// @flow

import React, {memo} from "react"
import {makeStyles} from "@material-ui/core/styles"
import SidebarBoxContainer from "../SidebarBoxContainer"
import HistoryIcon from "@material-ui/icons/History"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import UndoIcon from "@material-ui/icons/Undo"
import moment from "moment"
import {Link} from "react-router-dom";
import PopupState, {bindHover, bindPopover} from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";

const useStyles = makeStyles({
  emptyText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
})

const listItemTextStyle = {paddingLeft: 16, textTransform: 'capitalize'}
const listItemTextNameStyle = {textDecoration: 'underline', textTransform: 'capitalize'}
const PopoverLine = ({content, children, noPopup}) => {
  const classes = useStyles();
  if (noPopup) {
    return (<div>
      {children}
    </div>)
  }
  return (<PopupState variant="popover">
    {(popupState) => {
      return (
        <div>
          <div className={popupState.isOpen ? 'popOverMouse' : ''} {...bindHover(popupState)}>
            {children}
          </div>
          <HoverPopover
            {...bindPopover(popupState)}
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {content}
          </HoverPopover>
        </div>
      );
    }}
  </PopupState>);
}


const PopOverChangeLine = (obj) => {
  if (obj.changes && obj.changes.length) {
    return obj
      .changes
      .map(change => (<ListItem key={`${obj.id}: ${change}`}>
        <ListItemText
          style={listItemTextStyle}
          primary={`${obj.id}: ${change}`}
        />
      </ListItem>));
  }
  return null;
}

const totalChanges = (objs) => objs.map(({changes}) => changes).filter((changes) => Array.isArray(changes)).flat().length
export const HistoryBox = ({
                             history,
                             onRestoreHistory,
                           }) => {
  const classes = useStyles()
  return Array.isArray(history) && history.length > 0 && (
    <SidebarBoxContainer
      title="History"
      icon={<HistoryIcon/>}
      expandedByDefault
    >
      <List>
        {history.length === 0 && (
          <div className={classes.emptyText}>No History Yet</div>
        )}
        {history
          .map(({to, user, objs, createdAt, selected}, i) => {
            return (<PopoverLine key={to} content={<List>
                {objs
                  .map((obj, index) => <PopOverChangeLine key={obj.id} {...obj}/>)}
              </List>}

                                 noPopup={totalChanges(objs) === 0}
              >
                <Link className={selected ? 'selected' : ''}
                      to={to}>
                  <ListItem button
                            dense
                  >
                    <ListItemText
                      style={listItemTextStyle}
                      primary={<div>
                        <span style={listItemTextNameStyle}>
                        {`${user.prefix.replace(/[^a-zA-Z0-9]/g, '')}. ${user.firstName} ${user.lastName}`}
                          </span>
                        <span>
                        {` changes: ${totalChanges(objs)}`}
                          </span>
                      </div>}
                      secondary={moment(createdAt).format("yyyy-MM-DD hh:mm")}
                    />
                    <ListItemSecondaryAction onClick={() => onRestoreHistory()}>
                      <IconButton>
                        <UndoIcon/>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Link>
              </PopoverLine>
            )
          })}
      </List>
    </SidebarBoxContainer>
  )
}

export default memo(HistoryBox)
