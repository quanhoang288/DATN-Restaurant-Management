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
import { parseSearchParams } from "../../../utils/parseSearchParams";

const cols = [
  { id: "id", label: "STT", isSortable: true },
  { id: "image", label: "", type: "image", isSortable: false },
  { id: "name", label: "Tên thực đơn", isSortable: true },
  { id: "type", label: "Loại", isSortable: true },
  {
    id: "status",
    label: "Trạng thái",
    isSortable: true,
    type: "chip",
    variantMapping: [
      {
        value: "active",
        variant: "success",
      },
      {
        value: "inactive",
        variant: "info",
      },
    ],
  },
];

function MenuList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useState({});

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = parseSearchParams(searchParams);
    const res = (
      await getMenus({ page, perPage, filters: JSON.stringify(filters) })
    ).data;
    setMenuList(
      res.data.map((menu) => ({
        ...menu,
        type: menu.type === "food" ? "Đồ ăn" : "Đồ uống",
        status: menu.is_active
          ? { name: "Đang sử dụng", value: "active" }
          : { name: "Không sử dụng", value: "inactive" },
      }))
    );
    setTotalCount(res.total);
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
    console.log(searchParams);
  }, [searchParams]);

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
          handleCloseModal={() => {
            setCreateModalVisible(false);
            setSelected(null);
            fetchCurPage(1, 5);
          }}
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
              value={searchParams.id}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  id: e.target.value ? Number.parseInt(e.target.value) : "",
                })
              }
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
              style={{ marginRight: 20, minWidth: 150 }}
              value={searchParams.type}
              onChange={(e) =>
                setSearchParams({ ...searchParams, type: e.target.value })
              }
            >
              <option value=''>Tất cả</option>
              <option value='food'>Đồ ăn</option>
              <option value='beverage'>Đồ uống</option>
            </TextField>

            <TextField
              label='Trạng thái'
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
              value={searchParams.is_active}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  is_active:
                    e.target.value !== ""
                      ? Number.parseInt(e.target.value)
                      : null,
                })
              }
            >
              <option value=''>Tất cả</option>
              <option value='1'>Đang sử dụng</option>
              <option value='0'>Ngừng sử dụng</option>
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

        <CustomTable
          cols={cols}
          rows={menuList}
          // paginationEnabled={false}
          actionButtons={actionButtons}
          handleFetchRows={fetchCurPage}
          totalCount={totalCount}
          searchParams={searchParams}
        />
      </div>
    </Main>
  );
}

export default MenuList;
