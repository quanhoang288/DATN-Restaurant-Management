import React, { useEffect, useState } from "react";
import { Typography, Button, TextField } from "@material-ui/core";
import CustomTable from "../../../components/Table/CustomTable";
// import './StaffList.css'
import Main from "../../../containers/Main/Main";
import StaffCreate from "./StaffCreate";
import { staffApi } from "../../../apis";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import { getStaffList } from "../../../apis/staff";
import { parseSearchParams } from "../../../utils/parseSearchParams";

const cols = [
  { id: "id", label: "STT", isSortable: true },
  { id: "full_name", label: "Tên nhân viên", isSortable: true },
  { id: "email", label: "Email", isSortable: true },
  { id: "phone_number", label: "SĐT", isSortable: true },
  { id: "status", label: "Trạng thái", isSortable: true },
];

function StaffList() {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const [staffList, setStaffList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useState({});

  const handleDeleteStaff = async (id) => {
    if (id) {
      await staffApi.deleteStaff(id);
      setDeleteDialogVisible(false);
    }
  };

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = JSON.stringify(parseSearchParams(searchParams));
    const res = (await getStaffList({ page, perPage, filters })).data;
    setStaffList(
      res.data.map((staff) => ({
        ...staff,
        status: staff.is_active ? "Đang làm việc" : "Ngừng làm việc",
      }))
    );
    setTotalCount(res.total);
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
    if (isCreateModalVisible) {
      setSelected(null);
    }
  }, [isCreateModalVisible]);

  return (
    <Main>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xoa nhan vien'
        confirmTitle='Xoa'
        cancelTitle='Huy bo'
        description='Ban co chac chan muon xoa nhan vien nay?'
        handleConfirm={() => handleDeleteStaff(selected)}
        handleCancel={() => setDeleteDialogVisible(false)}
      />
      <StaffCreate
        staffId={selected}
        isModalVisible={isCreateModalVisible}
        handleCloseModal={() => setCreateModalVisible(false)}
      />
      <div>
        <div className='list_container'>
          <div className='list__header'>
            <Typography variant='h5'>Nhân viên</Typography>
          </div>
          <div
            style={{
              display: "flex",
              marginBottom: "2rem",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              <TextField
                label='Mã/Tên nhân viên'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                variant='standard'
                style={{ marginRight: 20 }}
                value={searchParams.id || searchParams.name?.like}
                onChange={(e) =>
                  setSearchParams(
                    !isNaN(
                      Number.parseInt(e.target.value)
                        ? {
                            ...searchParams,
                            id: Number.parseInt(e.target.value),
                          }
                        : { ...searchParams, name: { like: e.target.value } }
                    )
                  )
                }
              />
              <TextField
                label='Email'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                variant='standard'
                style={{ marginRight: 20 }}
                value={searchParams.email?.like}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    email: { like: e.target.value },
                  })
                }
              />

              <TextField
                label='SĐT'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                variant='standard'
                style={{ marginRight: 20 }}
                value={searchParams.phone_number?.like}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    phone_number: { like: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Button
                size='small'
                variant='contained'
                onClick={() => setCreateModalVisible(true)}
              >
                Thêm mới
              </Button>
              <Button size='small' variant='contained'>
                Import
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable
              cols={cols}
              actionButtons={actionButtons}
              rows={staffList}
              handleFetchRows={fetchCurPage}
              totalCount={totalCount}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
    </Main>
  );
}

export default StaffList;
