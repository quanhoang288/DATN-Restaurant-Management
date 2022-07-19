import React, { useState } from 'react'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import KitchenList from './KitchenList'
import TableList from './TableList'
import Main from '../../../containers/Main/Main'
import TabPanel from '../../../components/CustomTabs/TabPanel'
import { Typography } from '@material-ui/core'

function FacilityList(props) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Main>
      <div className='facility__container'>
        <div className='list__header'>
          <Typography variant='h5'>Cơ sở vật chất</Typography>
        </div>
        <CustomTabs labels={['Khu vực chế biến', 'Bàn ăn']} activeTab={activeTab} onChangeActiveTab={(val) => setActiveTab(val)}>
          <TabPanel value={activeTab} index={0}>
            <KitchenList />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <TableList />
          </TabPanel>
        </CustomTabs>
      </div>
    </Main>
  )
}

export default FacilityList

