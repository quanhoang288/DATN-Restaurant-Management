import { Tab, Tabs } from '@material-ui/core'
import React, { useState } from 'react'
import TabPanel from './TabPanel'

function CustomTabs(props) {
  const { labels, activeTab, onChangeActiveTab, children } = props
  return (
    <>
      <Tabs value={activeTab} indicatorColor='primary' textColor='primary' onChange={(e, val) => onChangeActiveTab(val)} aria-label='disabled tabs example'>
        {labels.map((label) => (
          <Tab label={label} />
        ))}
      </Tabs>
      {/* {tabs.map(({ PanelComponent, componentProps }, index) => (
        <TabPanel value={activeTab} index={index}>
          <PanelComponent {...componentProps} />
        </TabPanel>
      ))} */}
      {children}
    </>
  )
}

export default CustomTabs
