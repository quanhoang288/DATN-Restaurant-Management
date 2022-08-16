import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  List,
  Avatar,
  IconButton,
  // Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItem,
  Typography,
  ListItemIcon,
} from "@material-ui/core";
import { InView } from "react-intersection-observer";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import { useHistory } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import MenuPopover from "../../components/MenuPopover/MenuPopover";
import { ASSET_BASE_URL } from "../../configs";

// import { convertToDateDistance } from '../../utils/date'
import { useWebsocket } from "../../utils/websocket.context";
import {
  addNewNotifications,
  readAllNotifications,
} from "../../redux/actions/notificationActions";
import { getNotifications } from "../../apis/notification";

function NotificationItem({ notification, handleClick }) {
  return (
    <ListItem
      className='notification__item'
      button
      // selected={notification.readAt === undefined}
      key={notification.id}
      onClick={handleClick}
    >
      <ListItemText primary={"Test notification"} secondary={"1h"} />
    </ListItem>
  );
}

export default function NotificationsPopover(props) {
  const { color } = props;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [shouldLoadMore, setLoadMore] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [curPage, setCurPage] = useState(1);

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const notificationState = useSelector((state) => state.notification);

  const socket = useWebsocket();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadMore = useCallback(
    async (user, page, perPage = 10) => {
      try {
        const result = await getNotifications(user.id, { page, perPage });
        setNotifications(notifications.concat(result.data));

        setLoadMore(false);
      } catch (error) {
        console.log(error);
      }
    },
    [notifications]
  );

  useEffect(() => {
    if (curPage > 1) {
      setLoadMore(true);
    }
  }, [curPage]);

  useEffect(() => {
    if (open) {
      dispatch(readAllNotifications());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, authUser]);

  useEffect(() => {
    socket?.on("NEW_NOTIFICATION", (newNotification) => {
      // const receiverId = newNotification.to
      //   if (authUser && authUser.id === receiverId) {
      //   }
      dispatch(addNewNotifications());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, authUser]);

  useEffect(() => {
    if (shouldLoadMore) {
      handleLoadMore(authUser, curPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoadMore, authUser, curPage]);

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen}>
        {notificationState.numNewNotifications > 0 ? (
          <Badge
            badgeContent={notificationState.numNewNotifications}
            color='secondary'
          >
            <NotificationsIcon style={{ color }} />
          </Badge>
        ) : (
          <NotificationsIcon style={{ color }} />
        )}
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
      >
        <List
          disablePadding
          subheader={
            <ListSubheader
              disableSticky
              style={{ fontWeight: "bold", fontSize: 16 }}
            >
              Thông báo
            </ListSubheader>
          }
          style={{ maxHeight: "60vh", overflow: "auto" }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0 20px",
              }}
            >
              <Typography variant='body1'>Không có thông báo</Typography>
            </div>
          ) : (
            notifications.map((notification, index) =>
              index === notifications.length - 1 ? (
                <InView
                  key={notification.id}
                  threshold={1}
                  onChange={(inView) => {
                    if (inView) {
                      setCurPage(curPage + 1);
                    }
                  }}
                >
                  <NotificationItem notification={notification} />
                </InView>
              ) : (
                <div key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    handleClick={() =>
                      console.log("notification id: ", notification.id)
                    }
                  />
                </div>
              )
            )
          )}
          <div style={{ textAlign: "center" }}>
            <PulseLoader loading={shouldLoadMore} size={8} />
          </div>
        </List>
      </MenuPopover>
    </>
  );
}

NotificationsPopover.defaultProps = {
  color: "black",
};
