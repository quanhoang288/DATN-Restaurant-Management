import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";

import { createBranch, getBranch, updateBranch } from "../../../apis/branch";
import { provinces } from "../../../constants/provinces";
// import './BranchCreate.css'

const defaultData = {
  name: "",
  city: "",
  address: "",
  is_active: 1,
};

function BranchCreate({ branchId, isModalVisible, handleCloseModal }) {
  const [branchData, setBranchData] = useState(defaultData);

  const fetchBranchData = async (branchId) => {
    if (branchId) {
      const branch = (await getBranch(branchId)).data;
      setBranchData(branch);
    }
  };

  const handleSaveBranch = useCallback(async () => {
    if (branchId) {
      await updateBranch(branchId, branchData);
    } else {
      await createBranch(branchData);
    }
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, branchData]);

  useEffect(() => {
    if (branchId) {
      fetchBranchData(branchId);
    } else {
      setBranchData(defaultData);
    }
  }, [branchId]);

  return (
    <Modal
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
      title='Thêm chi nhánh'
    >
      <div>
        <TextField
          label='Tên chi nhánh'
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 18,
            },
          }}
          value={branchData.name}
          onChange={(e) =>
            setBranchData({ ...branchData, name: e.target.value })
          }
        />
        <TextField
          label='Thành phố'
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 18,
            },
          }}
          SelectProps={{
            native: true,
          }}
          select
          value={branchData.city}
          onChange={(e) =>
            setBranchData({ ...branchData, city: e.target.value })
          }
        >
          {provinces.map((province) => (
            <option value={province}>{province}</option>
          ))}
        </TextField>

        <TextField
          label='Địa chỉ'
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 18,
            },
          }}
          value={branchData.address}
          onChange={(e) =>
            setBranchData({ ...branchData, address: e.target.value })
          }
        />

        <FormControl margin='normal'>
          <FormLabel
            id='demo-radio-buttons-group-label'
            style={{ fontSize: 14 }}
          >
            Trạng thái hoạt động
          </FormLabel>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            name='radio-buttons-group'
            value={branchData.is_active}
            onChange={(e, val) =>
              setBranchData({ ...branchData, is_active: Number.parseInt(val) })
            }
          >
            <FormControlLabel
              value={1}
              control={<Radio />}
              label='Đang hoạt động'
            />
            <FormControlLabel
              value={0}
              control={<Radio />}
              label='Ngừng hoạt động'
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveBranch}
          style={{ marginRight: 5 }}
        >
          Lưu
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
      </div>
    </Modal>
  );
}

export default BranchCreate;
