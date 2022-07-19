import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import WebsocketProvider from '../utils/websocket.context'

import appRoutes from './appRoutes'

import PrivateRoute from './PrivateRoute'

function AppRouter() {
  const publicRoutes = appRoutes.filter((route) => !route.isPrivate)
  const privateRoutes = appRoutes.filter((route) => route.isPrivate)
  const authUser = useSelector((state) => state.auth.user)
  return (
    <WebsocketProvider>
      <Router>
        {/* {!authUser && <Redirect to='/admin/auth' />} */}
        <Switch>
          {publicRoutes.map((publicRoute) => (
            <Route exact path={publicRoute.path} component={publicRoute.component} key={publicRoute.path} />
          ))}

          {privateRoutes.map((privateRoute) => (
            <PrivateRoute path={privateRoute.path} component={privateRoute.component} exact key={privateRoute.path} />
          ))}
        </Switch>
      </Router>
    </WebsocketProvider>
  )
}

export default AppRouter

