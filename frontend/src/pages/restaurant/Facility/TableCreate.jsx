import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import { Button, TextField } from "@material-ui/core";
import { getTable, createTable, updateTable } from "../../../apis/table";
import { getBranches } from "../../../apis/branch";
// import './TableCreate.css'

function TableCreate({ tableId, isModalVisible, handleCloseModal }) {
  const [tableData, setTableData] = useState({
    name: "",
    floor_num: 1,
    branch_id: null,
    order: null,
  });
  const [branchOptions, setBranchOptions] = useState([]);

  const fetchTableData = async (tableId) => {
    const res = await getTable(tableId);
    const { name, floor_num, order } = res.data;
    setTableData({
      name,
      floor_num,
      order,
    });
  };

  const fetchBranchOptions = async () => {
    const options = (await getBranches()).data;
    setBranchOptions(options);
  };

  const handleSaveTable = useCallback(async () => {
    if (tableId) {
      await updateTable(tableId, tableData);
    } else {
      // console.log('data: ', tableData)
      await createTable(tableData);
    }
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId, tableData]);

  useEffect(() => {
    console.log("table id:", tableId);
    if (tableId) {
      fetchTableData(tableId);
    } else {
      setTableData({
        name: "",
        floor_num: 1,
        order: null,
      });
    }
    fetchBranchOptions();
  }, [tableId]);

  return (
    <Modal
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
      title='Thêm bàn'
    >
      <div>
        <TextField
          label='Tên bàn'
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 22,
            },
          }}
          style={{ marginBottom: "1rem" }}
          value={tableData.name}
          onChange={(e) => setTableData({ ...tableData, name: e.target.value })}
        />
        <TextField
          select
          label='Chi nhánh'
          InputLabelProps={{
            style: {
              fontSize: 20,
            },
          }}
          SelectProps={{
            native: true,
          }}
          style={{ marginBottom: "1rem" }}
          fullWidth
          value={tableData.branch_id}
          onChange={(e) =>
            setTableData({
              ...tableData,
              branch_id: Number.parseInt(e.target.value) || null,
            })
          }
        >
          <option value={""}>Chọn chi nhánh</option>

          {branchOptions.map((branch) => (
            <option value={branch.id}>{branch.name}</option>
          ))}
        </TextField>
        <TextField
          select
          label='Tầng'
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 22,
            },
          }}
          SelectProps={{
            native: true,
          }}
          fullWidth
          value={tableData.floor_num}
          onChange={(e) =>
            setTableData({ ...tableData, floor_num: e.target.value })
          }
        >
          {[1, 2, 3].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </TextField>
        <TextField
          label='Thứ tự'
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 22,
            },
          }}
          value={tableData.order}
          onChange={(e) =>
            setTableData({
              ...tableData,
              order: Number.parseInt(e.target.value),
            })
          }
        />
      </div>
      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button variant='contained' color='primary' onClick={handleSaveTable}>
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
      </div>
    </Modal>
  );
}

export default TableCreate;
