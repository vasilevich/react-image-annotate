// @flow

import React, { Fragment, useState, memo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { makeStyles, styled } from "@material-ui/core/styles"
import { grey } from "@material-ui/core/colors"
import RegionIcon from "@material-ui/icons/PictureInPicture"
import Grid from "@material-ui/core/Grid"
import ReorderIcon from "@material-ui/icons/SwapVert"
import PieChartIcon from "@material-ui/icons/PieChart"
import TrashIcon from "@material-ui/icons/Delete"
import LockIcon from "@material-ui/icons/Lock"
import UnlockIcon from "@material-ui/icons/LockOpen"
import VisibleIcon from "@material-ui/icons/Visibility"
import VisibleOffIcon from "@material-ui/icons/VisibilityOff"
import styles from "./styles"
import classnames from "classnames"
import isEqual from "lodash/isEqual"

const useStyles = makeStyles(styles)

const HeaderSep = styled("div")({
  borderTop: `1px solid`,
  marginTop: 2,
  marginBottom: 2,
})

const Chip = ({ color, text }) => {
  const classes = useStyles()
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  )
}

const RowLayout = ({
  region,
  header,
  highlighted,
  order,
  classification,
  area,
  tags,
  trash,
  lock,
  visible,
  onClick,
  state,
}) => {
  const classes = useStyles()
  const [mouseOver, changeMouseOver] = useState(false)
  const ro = state.readOnly
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      className={classnames(classes.row, { header, highlighted })}
      style={ro && { padding:'15pt 5pt 15pt 0pt'} || {}}
    >
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 10 }}>{order}</div>
        </Grid>
        <Grid item xs={5}>
           {classification}
        </Grid>
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 6 }}>{area}</div>
        </Grid>
        <Grid item xs={1}>
          {!ro && trash}
        </Grid>
        <Grid item xs={1}>
          {!ro && lock}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
      </Grid>
    </div>
  )
}

const RowHeader = ({
  regions = emptyArr,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,
  state,
}) => {
  const vis=React.useState(true)
  return (
    <RowLayout
    header
    state={state}
    highlighted={false}
    visible={<VisibleIcon className="icon" onClick={()=>{
      regions.forEach(r=>{
        onChangeRegion({ ...r, visible: !vis[0] })

      })
      vis[1](!vis[0])
    }} />}
    classification={<div style={{ paddingLeft: 10 }}>Class</div>}
  />
    // <RowLayout
    //   header
    //   highlighted={false}
    //   order={<ReorderIcon className="icon" />}
    //   classification={<div style={{ paddingLeft: 10 }}>Class</div>}
    //   area={<PieChartIcon className="icon" />}
    //   trash={<TrashIcon className="icon" />}
    //   lock={<LockIcon className="icon" />}
    //   visible={<VisibleIcon className="icon" />}
    // />
  )
}

const MemoRowHeader = memo(RowHeader)

const Row = ({
  region: r,
  highlighted,
  onSelectRegion,
  onDeleteRegion,
  onChangeRegion,
  visible,
  locked,
  color,
  cls,
  index,
  state,
}) => {
  return (
    <RowLayout
      header={false}
      region={r}
      state={state}
      highlighted={highlighted}
      onClick={(e) => {
        console.debug(`clickedRegionSelector`,r)
        onSelectRegion(r)
      }}
      order={`#${index + 1}`}
      classification={<div style={r && r.group && {paddingLeft:'16pt'} || {}}><Chip  text={cls || ""} color={color || "#ddd"} /></div> }
      area=""
      trash={<TrashIcon onClick={() => onDeleteRegion(r)} className="icon2" />}
      lock={
        r.locked ? (
          <LockIcon
            onClick={() => onChangeRegion({ ...r, locked: false })}
            className="icon2"
          />
        ) : (
          <UnlockIcon
            onClick={() => onChangeRegion({ ...r, locked: true })}
            className="icon2"
          />
        )
      }
      visible={
        r.visible || r.visible === undefined ? (
           <VisibleIcon
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChangeRegion({ ...r, visible: false,highlighted:false })
            }}
            className="icon2"
          />
        ) : (
          <VisibleOffIcon
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChangeRegion({ ...r, visible: true })
            }}
            className="icon2"
          />
        )
      }
    />
  )
}

const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.visible === nextProps.visible &&
    prevProps.locked === nextProps.locked &&
    prevProps.id === nextProps.id &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color
)

const emptyArr = []

export const RegionSelectorSidebarBox = ({
  regions = emptyArr,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,
  state
}) => {
  const classes = useStyles()
  return (
    <SidebarBoxContainer
      title="Regions"
      key={'sidebarregionsbox'}
      subTitle=""
      icon={<RegionIcon/>}
      expandedByDefault
    >
      <div className={classes.container}>
        <MemoRowHeader {...{regions,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,state}}
        />
        <HeaderSep  />
        {regions.map((r, i) => (
          <MemoRow
            key={r.id || i}
            {...r}
            region={r}
            state={state}
            index={i}
            onSelectRegion={onSelectRegion}
            onDeleteRegion={(...args)=>{
              if(window.confirm('DELETE'))
              {
                onDeleteRegion(...args)
              }
            }}
            onChangeRegion={onChangeRegion}
          />
        ))}
      </div>
    </SidebarBoxContainer>
  )
}

const mapUsedRegionProperties = (r) => [
  r.id,
  r.color,
  r.locked,
  r.visible,
  r.highlighted,
]

export default memo(RegionSelectorSidebarBox, (prevProps, nextProps) =>
  isEqual(
    (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
    (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
  )
)
