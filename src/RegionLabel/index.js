// @flow

import React, {memo} from "react"
import Paper from "@material-ui/core/Paper"
import {makeStyles} from "@material-ui/core/styles"
import styles from "./styles"
import classnames from "classnames"
import type {Region} from "../ImageCanvas/region-tools.js"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import TrashIcon from "@material-ui/icons/Delete"
import CheckIcon from "@material-ui/icons/Check"
import Select from "react-select"
import CreatableSelect from "react-select/creatable"

import {asMutable} from "seamless-immutable"

const useStyles = makeStyles(styles)

type Props = {
  region: Region,
  editing?: boolean,
  allowedClasses?: Array<string>,
  allowedTags?: Array<string>,
  cls?: string,
  tags?: Array<string>,
  onDelete: (Region) => null,
  onChange: (Region) => null,
  onClose: (Region) => null,
  onOpen: (Region) => null,
  onRegionClassAdded: () => {},
}

export const RegionLabel = ({
                              region,
                              editing,
                              allowedClasses,
                              allowedTags,
                              onDelete,
                              onChange,
                              onClose,
                              onOpen,
                              onRegionClassAdded,
                              state
                            }: Props) => {
  const classes = useStyles()
  const ro = state.readOnly;

  return (
    <Paper
      onClick={() => (!editing ? onOpen(region) : null)}
      className={classnames(classes.regionInfo, {
        highlighted: region.highlighted,
      })}
    >
      {(!editing || ro) ? (
        <div>
          {region.cls && (
            <div className="name">
              <div
                className="circle"
                style={{backgroundColor: region.color}}
              />
              {`(${region.id})`} {region.cls}
            </div>
          )}
          {region.tags && (
            <div className="tags">
              {region.tags.map((t) => (
                <div key={t} className="tag">
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{width: 200}}>
          {!ro && <div style={{display: "flex", flexDirection: "row"}}>
            {!ro && <div
              style={{
                display: "flex",
                backgroundColor: region.color || "#888",
                color: "#fff",
                padding: 4,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 4,
                fontWeight: "bold",
                textShadow: "0px 0px 5px rgba(0,0,0,0.4)",
              }}
            >
              {region.type}
            </div>}
            <div style={{flexGrow: 1}}/>
            {!ro && <IconButton
              onClick={() => onDelete(region)}
              tabIndex={-1}
              style={{width: 22, height: 22}}
              size="small"
              variant="outlined"
            >
              <TrashIcon style={{marginTop: -8, width: 16, height: 16}}/>
            </IconButton>}
          </div>}
          {(allowedClasses || []).length > 0 && (
            <div style={{marginTop: 6}}>
              {!ro && <CreatableSelect
                placeholder="Classification"
                onChange={(o, actionMeta) => {
                  if (actionMeta.action == "create-option") {
                    onRegionClassAdded(o.value)
                  }
                  return onChange({
                    ...(region: any),
                    cls: o ? o.value : undefined,
                  })
                }}
                value={
                  region.cls ? {label: region.cls, value: region.cls} : null
                }
                options={asMutable(
                  allowedClasses.map((c) => ({value: c, label: c}))
                )}
                isClearable
              /> || <div>
                {region.cls}
              </div>}
            </div>
          )}
          {(allowedTags || []).length > 0 && (
            <div style={{marginTop: 4}}>
              {!ro && <Select
                onChange={(newTags) =>
                  onChange({
                    ...(region: any),
                    tags: newTags && newTags.map((t) => t.value) || [],
                  })
                }
                placeholder="Tags"
                value={(region.tags || []).map((c) => ({label: c, value: c}))}
                isMulti
                options={asMutable(
                  allowedTags.map((c) => ({value: c, label: c}))
                )}
              /> || (region.tags || []).map(tag => {
                return <div key={tag} style={{padding: 4}}>{tag}</div>
              })}
            </div>
          )}
          {onClose && (
            <div style={{marginTop: 4, display: "flex"}}>
              <div style={{flexGrow: 1}}/>
              <Button
                onClick={() => onClose(region)}
                size="small"
                variant="contained"
                color="primary"
              >
                <CheckIcon/>
              </Button>
            </div>
          )}
        </div>
      )}
    </Paper>
  )
}

export default memo(
  RegionLabel,
  (prevProps, nextProps) =>
    prevProps.editing === nextProps.editing &&
    prevProps.region === nextProps.region
)
