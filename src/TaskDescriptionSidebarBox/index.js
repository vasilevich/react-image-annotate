// @flow

import React, { memo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import DescriptionIcon from "@material-ui/icons/Description"
import { styled } from "@material-ui/core/styles"
import Markdown from "react-markdown"

const MarkdownContainer = styled("div")({
  paddingLeft: 16,
  paddingRight: 16,
  fontSize: 12,
  "& h1": { fontSize: 18 },
  "& h2": { fontSize: 14 },
  "& h3": { fontSize: 12 },
  "& h4": { fontSize: 12 },
  "& h5": { fontSize: 12 },
  "& h6": { fontSize: 12 },
  "& p": { fontSize: 12 },
  "& a": {},
  "& img": { width: "100%" },
})

export const TaskDescriptionSidebarBox = ({ description }) => {
  return (
    <SidebarBoxContainer
      title="Task Description"
      icon={<DescriptionIcon/>}
      expandedByDefault={description && description !== "" ? false : true}
    >
      <MarkdownContainer>
        <Markdown source={description} />
      </MarkdownContainer>
    </SidebarBoxContainer>
  )
}

export default memo(TaskDescriptionSidebarBox)
