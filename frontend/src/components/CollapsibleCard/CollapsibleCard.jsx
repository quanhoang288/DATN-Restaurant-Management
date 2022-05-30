import { ButtonGroup, Card, CardContent, CardHeader, Collapse, IconButton } from '@material-ui/core'
import React, { useState } from 'react'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import './CollapsibleCard.css'

function CollapsibleCard(props) {
  const { title, isCollapsible, children, additionalActions } = props
  const [isCollapse, setCollapse] = useState(false)
  return (
    <Card>
      <CardHeader
        action={
          isCollapsible && (
            <ButtonGroup variant='outlined'>
              {(additionalActions || []).map(({ clickHandler, Icon }) => (
                <IconButton onClick={clickHandler}>
                  <Icon />
                </IconButton>
              ))}
              <IconButton aria-label='settings' onClick={() => setCollapse(!isCollapse)}>
                {isCollapse ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
              </IconButton>
            </ButtonGroup>
          )
        }
        title={title ?? null}
        titleTypographyProps={{
          variant: 'h6'
        }}
      />
      {isCollapsible ? (
        <Collapse in={!isCollapse}>
          <CardContent>{children}</CardContent>
        </Collapse>
      ) : (
        <CardContent>
          <CardContent>{children}</CardContent>
        </CardContent>
      )}
    </Card>
  )
}

export default CollapsibleCard
