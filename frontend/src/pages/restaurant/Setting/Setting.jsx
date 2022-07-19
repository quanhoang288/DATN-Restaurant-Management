import React, { useState } from 'react'
import { List, MenuItem, ListItemText, Box, TextField, Button } from '@material-ui/core'
import './Setting.css'
import Main from '../../../containers/Main/Main'
import CustomTabs from '../../../components/CustomTabs/CustomTabs'
import TabPanel from '../../../components/CustomTabs/TabPanel'

function Setting() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Main>
      <div className='edit__background'>
        <div className='edit__profile__container'>
          <div className='edit__options__container'>
            <List>
              {['Thông tin chung', 'Phân quyền'].map((text, index) => (
                <MenuItem button key={text} className='sidebar__item' selected={selectedIndex === index}>
                  <ListItemText primary={text} onClick={() => setSelectedIndex(index)} />
                </MenuItem>
              ))}
            </List>
          </div>
          <div className='main__content'>
            {selectedIndex === 0 ? (
              <>
                <div className='edit__info__form'>
                  <Box component='form' noValidate>
                    <TextField margin='normal' fullWidth id='name' label='Name' name='name' />
                    <TextField margin='normal' fullWidth id='username' label='Username' name='username' />
                    <TextField margin='normal' fullWidth id='bio' label='Bio' name='bio' />
                    <div className='submit__btn__container'>
                      <Button variant='contained' color='primary'>
                        Submit
                      </Button>
                    </div>
                  </Box>
                </div>
              </>
            ) : (
              <div className='edit__password__form'>
                <CustomTabs labels={['Quyền truy cập', 'Chức danh']} activeTab={activeTab} onChangeActiveTab={(val) => setActiveTab(val)}>
                  <TabPanel value={activeTab} index={0}>
                    <div>Permission</div>
                  </TabPanel>
                  <TabPanel value={activeTab} index={1}>
                    <div>Role</div>
                  </TabPanel>
                </CustomTabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </Main>
  )
}

export default Setting

