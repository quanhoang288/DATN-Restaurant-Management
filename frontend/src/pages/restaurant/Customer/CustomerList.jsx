import React, { useEffect, useState } from "react";
import { Typography, Button, TextField } from "@material-ui/core";
import CustomTable from "../../../components/Table/CustomTable";
// import './CustomerList.css'
import Main from "../../../containers/Main/Main";
import { parseSearchParams } from "../../../utils/parseSearchParams";
import { getCustomers } from "../../../apis/customer";

const cols = [
  { id: "id", label: "STT", isSortable: true },
  { id: "full_name", label: "Tên khách hàng", isSortable: true },
  { id: "email", label: "Email", isSortable: true },
  { id: "phone_number", label: "SĐT", isSortable: true },
];

function CustomerList() {
  const [selected, setSelected] = useState(null);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useState({});

  const fetchCurPage = async (page, perPage, searchParams = {}) => {
    const filters = JSON.stringify(parseSearchParams(searchParams));
    const res = (await getCustomers({ page, perPage, filters })).data;
    setCustomerList(res.data);
    setTotalCount(res.total);
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
  ];

  useEffect(() => {
    if (isCreateModalVisible) {
      setSelected(null);
    }
  }, [isCreateModalVisible]);

  return (
    <Main>
      <div>
        <div className='list_container'>
          <div className='list__header'>
            <Typography variant='h5'>Khách hàng</Typography>
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
                label='Mã/Tên khách hàng'
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
              <Button size='small' variant='contained'>
                Xuất file
              </Button>
            </div>
          </div>
          <div className='list__content'>
            <CustomTable
              cols={cols}
              actionButtons={actionButtons}
              rows={customerList}
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

export default CustomerList;
