import { Button, TextField, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../../../components/Table/CustomTable";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import BranchCreate from "./BranchCreate";
import Main from "../../../containers/Main/Main";
import { deleteBranch, getBranches } from "../../../apis/branch";
import { provinces } from "../../../constants/provinces";
import { parseSearchParams } from "../../../utils/parseSearchParams";

const cols = [
  { id: "id", label: "ID", isSortable: true },
  { id: "name", label: "Tên chi nhánh", isSortable: true },
  { id: "city", label: "Thành phố", isSortable: true },
  { id: "address", label: "Địa chỉ", isSortable: true },
  { id: "status", label: "Trạng thái", isSortable: true },
];

function BranchList(props) {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useState({
    id: "",
    // name: { like: "" },
    city: "",
    address: "",
    is_active: "",
  });

  const fetchBranchList = useCallback(async () => {
    const filters = parseSearchParams(searchParams);
    const res = await getBranches({
      filters: JSON.stringify(filters),
    });
    setBranchList(
      res.data.map((branch) => ({
        ...branch,
        status: branch.is_active ? "Đang hoạt động" : "Ngừng hoạt động",
      }))
    );
  }, [searchParams]);

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = parseSearchParams(searchParams);
    const res = (
      await getBranches({
        page,
        perPage,
        filters: JSON.stringify(filters),
      })
    ).data;
    setBranchList(
      res.data.map((branch) => ({
        ...branch,
        status: branch.is_active ? "Đang hoạt động" : "Ngừng hoạt động",
      }))
    );
    setTotalCount(res.total);
  };

  const handleDeleteBranch = async (id) => {
    if (id) {
      await deleteBranch(id);
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
      name: "Xóa",
      variant: "contained",
      color: "secondary",
      clickHandler: (id) => {
        setSelected(id);
        setDeleteDialogVisible(true);
      },
    },
  ];

  // useEffect(() => {
  //   fetchBranchList();
  // }, []);

  return (
    <Main>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa chi nhánh'
        confirmTitle='Xoá'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa chi nhánh này'
        handleConfirm={() => handleDeleteBranch(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <BranchCreate
        branchId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => {
          setSelected(null);
          setCreateModalVisible(false);
        }}
      />
      <div className='list__header'>
        <Typography variant='h5'>Chi nhánh</Typography>
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
            label='Mã/Tên chi nhánh'
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
                id: Number.parseInt(e.target.value) || "",
              })
            }
          />

          <TextField
            label='Thành phố'
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
            value={searchParams.city}
            onChange={(e) =>
              setSearchParams({ ...searchParams, city: e.target.value })
            }
            style={{ marginRight: 20 }}
          >
            <option value=''>Tất cả</option>
            {provinces.map((opt) => (
              <option>{opt}</option>
            ))}
          </TextField>
          <TextField
            label='Địa chỉ'
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
            variant='standard'
            value={searchParams.address}
            onChange={(e) =>
              setSearchParams({ ...searchParams, address: e.target.value })
            }
            style={{ marginRight: 20 }}
          />
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
            value={searchParams.is_active}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                is_active: Number.parseInt(e.target.value) || "",
              })
            }
          >
            <option value=''>Tất cả</option>
            <option value='1'>Đang hoạt động</option>
            <option value='0'>Ngừng hoạt động</option>
          </TextField>
        </div>
        <div>
          <Button
            size='small'
            variant='contained'
            onClick={() => setCreateModalVisible(true)}
            color='primary'
          >
            Thêm mới
          </Button>
          <Button
            size='small'
            variant='contained'
            // onClick={() => setImportModalVisible(true)}
          >
            Import
          </Button>
        </div>
      </div>

      <div>
        <CustomTable
          rows={branchList}
          cols={cols}
          totalCount={totalCount}
          actionButtons={actionButtons}
          handleFetchRows={fetchCurPage}
          searchParams={searchParams}
        />
      </div>
    </Main>
  );
}

export default BranchList;
