import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  createInventory,
  getInventory,
  updateInventory,
} from "../../../apis/inventory";
import { getBranches } from "../../../apis/branch";
import pick from "../../../utils/pick";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";

const defaultData = {
  name: "",
  branch_id: null,
};

function InventoryCreate({ inventoryId, isModalVisible, handleCloseModal }) {
  const [inventoryData, setInventoryData] = useState(defaultData);
  const [branchOptions, setBranchOptions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const fetchInventoryData = async (inventoryId) => {
    const inventory = (await getInventory(inventoryId)).data;
    setInventoryData(inventory);
  };

  const fetchBranchOptions = async () => {
    const branches = (await getBranches()).data;
    setBranchOptions(branches.map((branch) => pick(branch, ["id", "name"])));
  };

  const handleSaveInventory = useCallback(async () => {
    if (inventoryId) {
      await updateInventory(inventoryId, inventoryData);
    } else {
      await createInventory(inventoryData);
    }
    setInventoryData(defaultData);
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryId, inventoryData]);

  useEffect(() => {
    if (inventoryId) {
      fetchInventoryData(inventoryId);
    } else {
      setInventoryData(defaultData);
    }
    fetchBranchOptions();
  }, [inventoryId]);

  useEffect(() => {
    if (!inventoryData.branch_id && branchOptions.length) {
      setInventoryData({ ...inventoryData, branch_id: branchOptions[0].id });
    }
  }, [inventoryData, branchOptions]);

  return (
    <Modal
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
      title='Thêm thông tin kho'
    >
      <CustomTabs
        labels={["Thông tin chung", "Tồn kho"]}
        activeTab={activeTab}
        onChangeActiveTab={(val) => setActiveTab(val)}
      >
        <TabPanel value={activeTab} index={0}>
          <div>
            <TextField
              label='Tên kho'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                },
              }}
              value={inventoryData.name}
              onChange={(e) =>
                setInventoryData({ ...inventoryData, name: e.target.value })
              }
            />

            <TextField
              select
              label='Chi nhánh'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                },
              }}
              SelectProps={{
                native: true,
              }}
              value={inventoryData.branch_id}
              fullWidth
              onChange={(e) =>
                setInventoryData({
                  ...inventoryData,
                  branch_id: Number.parseInt(e.target.value),
                })
              }
            >
              {branchOptions.map((branch) => (
                <option value={branch.id}>{branch.name}</option>
              ))}
            </TextField>
          </div>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <div style={{ flex: 1 }}>
            {(inventoryData.inventoryGoods || []).length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên hàng hóa</TableCell>
                      <TableCell>Số lượng tồn kho</TableCell>
                      <TableCell>Đơn vị</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(inventoryData.inventoryGoods || []).map((item) => (
                      <TableRow>
                        <TableCell>{item.good?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit?.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Không có dữ liệu</Typography>
            )}
          </div>
        </TabPanel>
      </CustomTabs>

      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveInventory}
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

export default InventoryCreate;
