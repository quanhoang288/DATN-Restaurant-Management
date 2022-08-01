import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { Redirect } from 'react-router-dom'

import Layout from '../Layout/Layout'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { successMessages } from '../../constants/messages'
import AuthHandler from '../AuthHandler/AuthHandler'
import { useStyles } from '../../styles/drawer.style'
import './Main.css'
import routes from '../../constants/route'

function Main({ children }) {
  const authState = useSelector((state) => state.auth)
  const [isDrawerOpen, setDrawerOpen] = useState(true)
  const classes = useStyles()

  return (
    <Layout
      className={clsx(classes.content, {
        [classes.contentShift]: isDrawerOpen,
      })}
    >
      {!authState.user && <Redirect to={routes.ADMIN_AUTH} />}
      {/* {authState.error && <Toast variant='error' message={authState.error} />}
      {authState.registerSuccess && <Toast variant='success' message={successMessages.REGISTER_SUCCESSFUL} />} */}
      <AuthHandler isAdminAuthentication={true} />
      <Navbar isDrawerOpen={isDrawerOpen} onOpenDrawer={() => setDrawerOpen(true)} />
      <Sidebar isDrawerOpen={isDrawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
      <div className='main__container'>
        <div className='main__content'>{children}</div>
      </div>
    </Layout>
  )
}

export default Main

