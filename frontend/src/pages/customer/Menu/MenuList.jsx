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
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";

function Menu(props) {
  const { menu } = props;
  const history = useHistory();
  return (
    <Card>
      <CardActionArea onClick={() => history.push(`/menus/${menu.id}`)}>
        <CardMedia
          component='img'
          alt='Contemplative Reptile'
          height='140'
          image='https://cdn4.vectorstock.com/i/1000x1000/71/83/sign-board-discount-vector-1947183.jpg'
          title='Discount thumbnail'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {menu.name}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {menu.description || "Description"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function MenuList(props) {
  const [menuList, setMenuList] = useState([]);

  const fetchMenuList = async () => {
    setMenuList((await getMenus()).data);
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
