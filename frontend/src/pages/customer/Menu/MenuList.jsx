import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getMenus } from "../../../apis/menu";
import { ASSET_BASE_URL } from "../../../configs";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import noImageAvailable from "../../../assets/no-image-available.jpg";

function Menu(props) {
  const { menu } = props;
  const history = useHistory();
  return (
    <Card>
      <CardActionArea onClick={() => history.push(`/menus/${menu.id}`)}>
        <CardMedia
          component='img'
          alt='Menu thumbnail'
          height='140'
          image={
            menu.image
              ? `${ASSET_BASE_URL}/images/${menu.image}`
              : noImageAvailable
          }
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {menu.name}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {menu.description || ""}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function MenuList(props) {
  const [menuList, setMenuList] = useState([]);

  const fetchMenuList = async () => {
    setMenuList(
      (await getMenus({ filters: JSON.stringify({ is_active: 1 }) })).data
    );
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <CustomerMain>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          rowGap: 20,
          alignItems: "center",
          flex: 1,
          marginLeft: 10,
          padding: "2rem 2rem",
          columnGap: 20,
        }}
      >
        {menuList.map((menu) => (
          <Menu menu={menu} />
        ))}
      </div>
    </CustomerMain>
  );
}

export default MenuList;
