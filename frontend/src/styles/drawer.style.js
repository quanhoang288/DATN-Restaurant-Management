import { makeStyles } from '@material-ui/core'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#003366',
    color: '#F0F8FF',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: '100vh',
    paddingTop: theme.spacing(3),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 200,
    justifyContent: 'center',
    paddingRight: 0,
    paddingBottom: 0,
    height: '100vh',
    paddingLeft: theme.spacing(4),
  },
  listItem: {
    '&.MuiListItem-root.Mui-selected': {
      background: '#466b917a',
    },
  },
  listItemIcon: {
    '&.MuiListItemIcon-root': {
      color: '#F0F8FF !important',
    },
  },
}))

export { useStyles }

