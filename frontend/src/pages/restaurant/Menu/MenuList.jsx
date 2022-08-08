import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import TableChartIcon from "@material-ui/icons/TableChart";
import GridOnIcon from "@material-ui/icons/GridOn";
import { deleteMenu, getMenus } from "../../../apis/menu";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import CustomTable from "../../../components/Table/CustomTable";
import Main from "../../../containers/Main/Main";
import MenuCreate from "./MenuCreate";

const cols = [
  { id: "id", label: "STT", isSortable: true },
  { id: "name", label: "Tên thực đơn", isSortable: true },
  { id: "type", label: "Loại", isSortable: true },
];

const testMenuList = [
  { id: 1, name: "Menu hải sản", type: "Đồ ăn" },
  { id: 2, name: "Menu các loại thịt", type: "Đồ ăn" },
  { id: 3, name: "Menu đồ ăn vặt", type: "Đồ ăn" },
  { id: 4, name: "Menu đồ ăn chay", type: "Đồ ăn" },
  // { id: 2, name: "Menu các loại thịt", type: "Đồ ăn" },
  { id: 5, name: "Menu đồ uống", type: "Đồ uống" },
];

function Menu(props) {
  const { menu } = props;
  return (
    <Card>
      <CardActionArea>
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
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const fetchMenuList = async () => {
    const res = await getMenus();
    // setMenuList(res.data)
    setMenuList(testMenuList);
  };

  const handleDeleteMenu = async (id) => {
    if (id) {
      await deleteMenu(id);
      setDeleteDialogVisible(false);
    }
  };

  const actionButtons = [
    {
      name: "Chi tiết",
      variant: "contained",
      color: "primary",
      clickHandler: (id) => {
        setSelected(id);
        setCreateModalVisible(true);
      },
    },
    {
      name: "Xoá",
      variant: "contained",
      color: "secondary",
      clickHandler: (id) => {
        setSelected(id);
        setDeleteDialogVisible(true);
      },
    },
  ];

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <Main>
      <div>
        <ConfirmDialog
          isModalVisible={isDeleteDialogVisible}
          title='Xóa thực đơn'
          confirmTitle='Xóa'
          cancelTitle='Hủy bỏ'
          description='Bạn có chắc chắn muốn xóa thực đơn này?'
          handleConfirm={() => handleDeleteMenu(selected)}
          handleCancel={() => setDeleteDialogVisible(false)}
        />
        <MenuCreate
          menuId={selected}
          isModalVisible={isCreateModalVisible}
          handleCloseModal={() => setCreateModalVisible(false)}
        />

        <div className='list__header'>
          <Typography variant='h5'>Thực đơn</Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <TextField
              label='Mã/Tên thực đơn'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 20,
                },
              }}
              variant='standard'
              style={{ marginRight: 20 }}
            />

            <TextField
              label='Loại thực đơn'
              select
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 20,
                },
              }}
              style={{ marginRight: 20 }}
            >
              <option>Tất cả</option>
              <option value='pending'>Chờ xác nhận</option>
              <option value='confirmed'>Đã xác nhận (Chờ nhận bàn)</option>
              <option value='serving'>Đã nhận bàn</option>
            </TextField>
          </div>
          <div>
            <Button
              variant='contained'
              onClick={() => setCreateModalVisible(true)}
              color='primary'
            >
              Thêm mới
            </Button>
          </div>
        </div>

        {viewMode === "table" ? (
          <CustomTable
            cols={cols}
            rows={menuList}
            // paginationEnabled={false}
            actionButtons={actionButtons}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              rowGap: 20,
              alignItems: "center",
              flex: 1,
              paddingTop: "1rem",
              // padding: '2rem 2rem',
              columnGap: 20,
            }}
          >
            {menuList.map((menu) => (
              <Menu menu={menu} />
            ))}
          </div>
        )}
      </div>
    </Main>
  );
}

export default MenuList;
