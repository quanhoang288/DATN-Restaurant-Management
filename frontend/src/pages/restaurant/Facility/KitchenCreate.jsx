import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import { Button, TextField } from "@material-ui/core";
import { KITCHEN_TYPES } from "../../../constants";
import {
  createKitchen,
  getKitchen,
  updateKitchen,
} from "../../../apis/kitchen";
import { getBranches } from "../../../apis/branch";
// import './KitchenCreate.css'

function KitchenCreate({ kitchenId, isModalVisible, handleCloseModal }) {
  const [kitchenData, setKitchenData] = useState({
    name: "",
    branch_id: null,
    type: KITCHEN_TYPES[0],
  });
  const [branchOptions, setBranchOptions] = useState([]);

  const fetchBranchOptions = async () => {
    const options = (await getBranches()).data;
    setBranchOptions(options);
  };

  const fetchKitchenData = async (kitchenId) => {
    const res = await getKitchen(kitchenId);
    const { name, type } = res.data;
    setKitchenData({
      name,
      type,
    });
  };

  const handleSaveKitchen = useCallback(async () => {
    if (kitchenId) {
      await updateKitchen(kitchenId, kitchenData);
    } else {
      await createKitchen(kitchenData);
    }
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitchenId, kitchenData]);

  useEffect(() => {
    if (kitchenId) {
      fetchKitchenData(kitchenId);
    } else {
      setKitchenData({
        name: "",
        type: KITCHEN_TYPES[0],
      });
    }
    fetchBranchOptions();
  }, [kitchenId]);

  return (
    <Modal
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
      title='Thêm bếp'
    >
      <div>
        <TextField
          label='Tên bếp'
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 18,
            },
          }}
          style={{ marginBottom: "1rem" }}
          value={kitchenData.name}
          onChange={(e) =>
            setKitchenData({ ...kitchenData, name: e.target.value })
          }
        />
        <TextField
          select
          label='Chi nhánh'
          InputLabelProps={{
            style: {
              fontSize: 18,
            },
          }}
          SelectProps={{
            native: true,
          }}
          fullWidth
          value={kitchenData.branch_id}
          onChange={(e) =>
            setKitchenData({
              ...kitchenData,
              branch_id: Number.parseInt(e.target.value),
            })
          }
          style={{ marginBottom: "1rem" }}
        >
          <option value={""}>Chọn chi nhánh</option>

          {branchOptions.map((branch) => (
            <option value={branch.id}>{branch.name}</option>
          ))}
        </TextField>
        <TextField
          select
          label='Loại bếp'
          InputLabelProps={{
            style: {
              fontSize: 18,
            },
          }}
          SelectProps={{
            native: true,
          }}
          fullWidth
          value={kitchenData.type}
          onChange={(e) =>
            setKitchenData({ ...kitchenData, type: e.target.value })
          }
        >
          {KITCHEN_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === "food" ? "Đồ ăn" : "Đồ uống"}
            </option>
          ))}
        </TextField>
      </div>
      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button variant='contained' color='primary' onClick={handleSaveKitchen}>
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
      </div>
    </Modal>
  );
}

export default KitchenCreate;
