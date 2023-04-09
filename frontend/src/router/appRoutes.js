import routes from '../constants/route'
import GoodList from '../pages/restaurant/Good/GoodList'
import FacilityList from '../pages/restaurant/Facility/FacilityList'
import MenuList from '../pages/restaurant/Menu/MenuList'
import StaffList from '../pages/restaurant/Staff/StaffList'
import CustomerList from '../pages/restaurant/Customer/CustomerList'
import DiscountList from '../pages/restaurant/Discount/DiscountList'
import Dashboard from '../pages/restaurant/Dashboard/Dashboard'
import ReservationList from '../pages/restaurant/Reservation/ReservationList'
import KitchenDisplay from '../pages/restaurant/KDS/KitchenDisplay'
import OrderList from '../pages/restaurant/Order/OrderList'
import Setting from '../pages/restaurant/Setting/Setting'
import Home from '../pages/customer/Home/Home'
import CustomerMenuList from '../pages/customer/Menu/MenuList'
import MenuDetail from '../pages/customer/Menu/MenuDetail'
import Reservation from '../pages/customer/Reservation/Reservation'
import Checkout from '../pages/customer/Payment/Checkout'
import Order from '../pages/customer/Order/Order'
import AdminAuth from '../pages/restaurant/AdminAuth/AdminAuth'
import ReservationDetail from '../pages/customer/Reservation/ReservationDetail'
import BranchList from '../pages/restaurant/Branch/BranchList'
import Inventory from '../pages/restaurant/Inventory/Inventory'
import Profile from '../pages/customer/Profile/Profile'
import OrderSummary from '../pages/customer/Payment/OrderSummary'

const appRoutes = [
  {
    path: routes.DASHBOARD,
    component: Dashboard,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.BRANCH,
    component: BranchList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.FINANCE,
    component: BranchList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.GOODS,
    component: GoodList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.INVENTORY,
    component: Inventory,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.CUSTOMERS,
    component: CustomerList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.STAFF,
    component: StaffList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.FACILITIES,
    component: FacilityList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.MENUS,
    component: MenuList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.SETTINGS,
    component: Setting,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.DISCOUNTS,
    component: DiscountList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.RESERVATIONS,
    component: ReservationList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.KITCHEN_DISPLAY,
    component: KitchenDisplay,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.ORDERS,
    component: OrderList,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.CUSTOMER_HOME,
    component: Home,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.CUSTOMER_MENU_DETAIL,
    component: MenuDetail,
    exact: true,
    isPrivate: false,
  },

  {
    path: routes.CUSTOMER_MENUS,
    component: CustomerMenuList,
    exact: true,
    isPrivate: false,
  },

  {
    path: routes.CUSTOMER_RESERVATION_DETAIL,
    component: ReservationDetail,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.CUSTOMER_RESERVATIONS,
    component: Reservation,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.CHECKOUT,
    component: Checkout,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.CUSTOMER_ORDER,
    component: Order,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.CUSTOMER_ORDER_SUMMARY,
    component: OrderSummary,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.CUSTOMER_PROFILE,
    component: Profile,
    exact: true,
    isPrivate: true,
  },
  {
    path: routes.ADMIN_AUTH,
    component: AdminAuth,
    exact: true,
    isPrivate: false,
  },
]

export default appRoutes

