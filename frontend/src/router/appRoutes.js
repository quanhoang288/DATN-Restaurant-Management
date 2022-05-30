import routes from '../constants/route'
import GoodList from '../pages/restaurant/Good/GoodList'
import FacilityList from '../pages/restaurant/Facility/FacilityList'
import MenuList from '../pages/restaurant/Menu/MenuList'
import StaffList from '../pages/restaurant/Staff/StaffList'
import CustomerList from '../pages/restaurant/Customer/CustomerList'
import DiscountList from '../pages/restaurant/Discount/DiscountList'
import Dashboard from '../pages/restaurant/Dashboard/Dashboard'

const appRoutes = [
  {
    path: routes.DASHBOARD,
    component: Dashboard,
    exact: true,
    isPrivate: false
  },
  {
    path: routes.GOODS,
    component: GoodList,
    exact: true,
    isPrivate: false
  },
  {
    path: routes.CUSTOMERS,
    component: CustomerList,
    exact: true,
    isPrivate: false
  },
  {
    path: routes.STAFF,
    component: StaffList,
    exact: true,
    isPrivate: false
  },
  {
    path: routes.FACILITIES,
    component: FacilityList,
    exact: true,
    isPrivate: false
  },
  {
    path: routes.MENUS,
    component: MenuList,
    exact: true,
    isPrivate: false
  },
  {
    path: routes.SETTINGS,
    component: MenuList,
    exact: true,
    isPrivate: false
  },
  {
    path: routes.DISCOUNTS,
    component: DiscountList,
    exact: true,
    isPrivate: false
  }
]

export default appRoutes
