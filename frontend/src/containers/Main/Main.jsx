import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import Layout from '../Layout/Layout'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { successMessages } from '../../constants/messages'
import AuthHandler from '../AuthHandler/AuthHandler'
import { useStyles } from '../../styles/drawer.style'
import './Main.css'

function Main({ children }) {
  const authState = useSelector((state) => state.auth)
  const [isDrawerOpen, setDrawerOpen] = useState(true)
  const classes = useStyles()

  return (
    <Layout
      className={clsx(classes.content, {
        [classes.contentShift]: isDrawerOpen
      })}
    >
      {/* {authState.error && <Toast variant='error' message={authState.error} />}
      {authState.registerSuccess && <Toast variant='success' message={successMessages.REGISTER_SUCCESSFUL} />} */}
      <AuthHandler />
      <Navbar isDrawerOpen={isDrawerOpen} onOpenDrawer={() => setDrawerOpen(true)} />
      <Sidebar isDrawerOpen={isDrawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
      <div className='main__content'>{children}</div>
    </Layout>
  )
}

export default Main
