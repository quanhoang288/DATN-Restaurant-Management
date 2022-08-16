import { Button, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { deleteDiscount, getDiscounts } from "../../../apis/discount";
import CustomTable from "../../../components/Table/CustomTable";
import DiscountCreate from "./DiscountCreate";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import Main from "../../../containers/Main/Main";
import { parseSearchParams } from "../../../utils/parseSearchParams";

const cols = [
  { id: "id", label: "ID", isSortable: true },
  { id: "image", label: "", type: "image", isSortable: false },
  { id: "name", label: "Tên chương trình", isSortable: true },
  { id: "type", label: "Loại khuyến mãi", isSortable: true },
  { id: "method", label: "Hình thức", isSortable: true },
];

function DiscountList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [discountList, setDiscountList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = parseSearchParams(searchParams);
    const res = (
      await getDiscounts({
        page,
        perPage,
        filters,
      })
    ).data;

    setDiscountList(
      res.data.map((discount) => ({
        ...discount,
        type: discount.type === "invoice" ? "Hóa đơn" : "Hàng hóa",
        method:
          discount.method === "invoice-discount"
            ? "Giảm giá đơn hàng"
            : discount.method === "invoice-giveaway"
            ? "Khuyến mại hàng hóa"
            : discount.method === "good-giveaway"
            ? "Mua hàng khuyến mại hàng"
            : "Giảm giá/Đồng giá theo SL",
      }))
    );
    setTotalCount(res.total);
  };

  const handleDeleteDiscount = async (id) => {
    if (id) {
      await deleteDiscount(id);
      setDeleteDialogVisible(false);
    }
  };

  const actionButtons = [
    {
      name: "Chi tiet",
      variant: "contained",
      color: "primary",
      clickHandler: (id) => {
        setSelected(id);
        setCreateModalVisible(true);
      },
    },
    {
      name: "Xoa",
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
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xoa khuyen mai'
        confirmTitle='Xoa'
        cancelTitle='Huy bo'
        description='Ban co chac chan muon xoa khuyen mai nay?'
        handleConfirm={() => handleDeleteDiscount(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <DiscountCreate
        discountId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null);
          setCreateModalVisible(false);
        }}
      />
      <div className='list__header'>
        <Typography variant='h5'>Khuyến mãi</Typography>
      </div>

      <div
        style={{
          display: "flex",
          marginBottom: "2rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flex: 1, marginRight: "2rem" }}>
          <TextField
            label='Mã/Tên chương trình'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            variant='standard'
            style={{ marginRight: 20 }}
            value={searchParams.id || searchParams.name?.like || null}
            onChange={(e) => {
              if (!isNaN(Number.parseInt(e.target.value))) {
                delete searchParams.name;
                setSearchParams({
                  ...searchParams,
                  id: Number.parseInt(e.target.value),
                });
              } else {
                delete searchParams.id;

                setSearchParams({
                  ...searchParams,
                  name: {
                    like: e.target.value,
                  },
                });
              }
            }}
          />

          <TextField
            label='Áp dụng từ'
            type='date'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            variant='standard'
            style={{ marginRight: 20 }}
            value={searchParams.start_date}
            onChange={(e) =>
              setSearchParams({ ...searchParams, start_date: e.target.value })
            }
          />

          <TextField
            label='Áp dụng đến'
            type='date'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            variant='standard'
            style={{ marginRight: 20 }}
            value={searchParams.end_date}
            onChange={(e) =>
              setSearchParams({ ...searchParams, end_date: e.target.value })
            }
          />

          <TextField
            label='Loại khuyến mãi'
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
            style={{ marginRight: 20, minWidth: 200 }}
            value={searchParams.type || ""}
            onChange={(e) =>
              setSearchParams({ ...searchParams, type: e.target.value })
            }
          >
            <option value=''>Tất cả</option>
            <option value='invoice'>Hóa đơn</option>
            <option value='good'>Hàng hóa</option>
          </TextField>

          <TextField
            label='Hình thức'
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
            value={searchParams.method || ""}
            onChange={(e) =>
              setSearchParams({ ...searchParams, method: e.target.value })
            }
          >
            <option value=''>Tất cả</option>
            <option value='invoice-discount'>Giảm giá đơn hàng</option>
            <option value='invoice-giveaway'>Tặng hàng hóa</option>
            <option value='good-giveaway'>Mua hàng khuyến mại hàng</option>
            <option value='good-discount'>Giảm giá/đồng giá theo SL</option>
          </TextField>
          <TextField
            label='Trạng thái'
            select
            SelectProps={{
              native: true,
              placeholder: "Chọn trạng thái",
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
          >
            <option>Tất cả</option>
            <option value={1}>Đang áp dụng</option>
            <option value={0}>Không áp dụng</option>
          </TextField>
        </div>

        <Button
          variant='contained'
          color='primary'
          onClick={() => setCreateModalVisible(true)}
        >
          Thêm mới
        </Button>
      </div>

      <div>
        <CustomTable
          rows={discountList}
          cols={cols}
          actionButtons={actionButtons}
          handleFetchRows={fetchCurPage}
          totalCount={totalCount}
          searchParams={searchParams}
        />
      </div>
    </Main>
  );
}

export default DiscountList;
