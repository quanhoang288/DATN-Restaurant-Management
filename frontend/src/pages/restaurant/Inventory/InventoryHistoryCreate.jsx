import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import Modal from "../../../components/Modal/Modal";
import { Autocomplete } from "@material-ui/lab";
import { getInventories } from "../../../apis/inventory";
import { getGoods } from "../../../apis/good";
import { formatDate } from "../../../utils/date";
import { getUnits } from "../../../apis/unit";
import pick from "../../../utils/pick";
import {
  createInventoryHistory,
  updateInventoryHistory,
} from "../../../apis/inventory-history";

const defaultData = {
  import_time: formatDate(new Date(), "YYYY-MM-DDThh:mm"),
  provider: null,
  status: "temp",
  source_inventory_id: null,
  target_inventory_id: null,
  type: "provider",
  items: [],
  note: "",
  discount: 0,
};

function InventoryHistoryCreate({
  inventoryHistoryId,
  isModalVisible,
  handleCloseModal,
}) {
  const [inventoryHistoryData, setInventoryHistoryData] = useState(defaultData);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [goodOptions, setGoodOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const fetchInventoryHistoryData = async (inventoryHistoryId) => {};

  const fetchInventoryOptions = async () => {
    const inventories = (await getInventories()).data;
    setInventoryOptions(inventories);
  };

  const fetchGoodOptions = async (keyword) => {
    const goods = keyword
      ? (
          await getGoods({
            filters: JSON.stringify({
              name: {
                like: keyword,
              },
            }),
          })
        ).data
      : (await getGoods()).data;
    setGoodOptions(goods.map((good) => ({ id: good.id, name: good.name })));
  };

  const fetchUnitOptions = async () => {
    const units = (await getUnits()).data;
    setUnitOptions(units);
  };

  const handleAddItem = useCallback(() => {
    setInventoryHistoryData({
      ...inventoryHistoryData,
      items: [...inventoryHistoryData.items, { id: null }],
    });
  }, [inventoryHistoryData]);

  const handleUpdateItemRow = useCallback(
    (idx, field, val) => {
      const row = inventoryHistoryData.items[idx];
      row[field] = val;
      setInventoryHistoryData({
        ...inventoryHistoryData,
        items: inventoryHistoryData.items.map((item, index) =>
          index === idx ? row : item
        ),
      });
    },
    [inventoryHistoryData]
  );

  const handleDeleteItemRow = useCallback(
    (deleteIdx) => {
      setInventoryHistoryData({
        ...inventoryHistoryData,
        items: inventoryHistoryData.items.filter(
          (item, idx) => idx !== deleteIdx
        ),
      });
    },
    [inventoryHistoryData]
  );

  const handleSaveInventoryHistory = useCallback(async () => {
    const postData = {
      ...inventoryHistoryData,
      items: inventoryHistoryData.items.map((item) =>
        pick(item, ["id", "unit_id", "unit_price", "quantity"])
      ),
    };
    console.log(postData);
    // if (inventoryHistoryId) {
    //   await updateInventoryHistory(inventoryHistoryId, postData);
    // } else {
    //   await createInventoryHistory(postData);
    // }
    // setInventoryHistoryData(defaultData);
    // handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryHistoryId, inventoryHistoryData]);

  useEffect(() => {
    if (inventoryHistoryId) {
      fetchInventoryHistoryData(inventoryHistoryId);
    }
    fetchGoodOptions();
    fetchInventoryOptions();
    fetchUnitOptions();
  }, [inventoryHistoryId]);

  useEffect(() => {
    if (inventoryOptions.length) {
      setInventoryHistoryData({
        ...inventoryHistoryData,
        source_inventory_id:
          inventoryHistoryData.type === "transfer"
            ? inventoryOptions[0].id
            : null,
        target_inventory_id: inventoryOptions[0].id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryOptions]);

  useEffect(() => {
    console.log(inventoryHistoryData);
  }, [inventoryHistoryData]);

  return (
    <Modal
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
      title='Thêm thông tin nhập kho'
    >
      <div style={{ padding: "0 1rem" }}>
        <Grid container style={{ alignItem: "center" }}>
          <Grid item xs={5}>
            <TextField
              label='Thời gian nhập'
              fullWidth
              type='datetime-local'
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                },
              }}
              value={inventoryHistoryData.import_time}
              onChange={(e) =>
                setInventoryHistoryData({
                  ...inventoryHistoryData,
                  import_time: e.target.value,
                })
              }
            />

            {/* <TextField
              label='Người tạo'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                },
              }}
            /> */}

            <TextField
              label='Loại nhập'
              fullWidth
              margin='normal'
              select
              SelectProps={{ native: true }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                },
              }}
              value={inventoryHistoryData.type}
              onChange={(e) =>
                setInventoryHistoryData({
                  ...inventoryHistoryData,
                  type: e.target.value,
                })
              }
            >
              <option value='provider'>Nhập từ NCC</option>
              <option value='transfer'>Chuyển từ kho khác</option>
            </TextField>

            <TextField
              label='Trạng thái'
              select
              fullWidth
              margin='normal'
              SelectProps={{ native: true }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                },
              }}
              value={inventoryHistoryData.status}
              onChange={(e) =>
                setInventoryHistoryData({
                  ...inventoryHistoryData,
                  status: e.target.value,
                })
              }
            >
              <option value='temp'>Phiếu tạm</option>
              <option value='imported'>Đã nhập hàng</option>
              <option value='canceled'>Đã hủy</option>
            </TextField>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={6}>
            {inventoryHistoryData.type === "provider" ? (
              <TextField
                label='Nhà cung cấp'
                fullWidth
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 18,
                  },
                }}
                value={inventoryHistoryData.provider}
                onChange={(e) =>
                  setInventoryHistoryData({
                    ...inventoryHistoryData,
                    provider: e.target.value,
                  })
                }
              />
            ) : (
              <TextField
                label='Kho nguồn'
                fullWidth
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 18,
                  },
                }}
                select
                SelectProps={{ native: true }}
                value={inventoryHistoryData.source_inventory_id}
                onChange={(e) =>
                  setInventoryHistoryData({
                    ...inventoryHistoryData,
                    source_inventory_id: Number.parseInt(e.target.value),
                  })
                }
              >
                {inventoryOptions.map((inventory) => (
                  <option
                    value={inventory.id}
                  >{`${inventory.name} - ${inventory.branch.name}`}</option>
                ))}
              </TextField>
            )}

            <TextField
              label='Kho nhập'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                },
              }}
              select
              SelectProps={{ native: true }}
              value={inventoryHistoryData.target_inventory_id}
              onChange={(e) =>
                setInventoryHistoryData({
                  ...inventoryHistoryData,
                  target_inventory_id: Number.parseInt(e.target.value),
                })
              }
            >
              {inventoryOptions.map((inventory) => (
                <option
                  value={inventory.id}
                >{`${inventory.name} - ${inventory.branch.name}`}</option>
              ))}
            </TextField>

            <TextField
              label='Ghi chú'
              fullWidth
              variant='outlined'
              margin='normal'
              multiline
              rows={3}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 18,
                  paddingTop: 5,
                },
              }}
              value={inventoryHistoryData.note}
              onChange={(e) =>
                setInventoryHistoryData({
                  ...inventoryHistoryData,
                  note: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>

        <Button variant='contained' onClick={handleAddItem}>
          Thêm hàng nhập
        </Button>
        {inventoryHistoryData.items.length > 0 && (
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell colSpan={2}>Tên hàng</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Thành tiền</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryHistoryData.items.map((item, idx) => (
                <TableRow>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell colSpan={2}>
                    <Autocomplete
                      className='navbar__searchBar__container'
                      id='free-solo-2-demo'
                      options={goodOptions}
                      value={
                        goodOptions.find((opt) => opt.id === item.id) || null
                      }
                      // inputValue={goodKeyword}
                      // onInputChange={(e, val) => fetchGoodOptions(val)}
                      onChange={(e, val) =>
                        handleUpdateItemRow(idx, "id", val.id)
                      }
                      getOptionLabel={(option) => option.name}
                      filterOptions={(options, state) => options}
                      renderInput={(params) => (
                        <TextField style={{ minWidth: 200 }} {...params} />
                      )}
                      // getOptionSelected={(opt, val) => opt.id === val.id}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      onChange={(e) =>
                        handleUpdateItemRow(
                          idx,
                          "quantity",
                          Number.parseFloat(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      onChange={(e) =>
                        handleUpdateItemRow(
                          idx,
                          "unit_id",
                          Number.parseInt(e.target.value)
                        )
                      }
                    >
                      {unitOptions.map((opt) => (
                        <option value={opt.id}>{opt.name}</option>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      onChange={(e) =>
                        handleUpdateItemRow(
                          idx,
                          "unit_price",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {item.unit_price && item.quantity
                      ? item.unit_price * item.quantity
                      : null}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteItemRow(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
        )}
      </div>

      <Grid
        container
        style={{ marginTop: 20, marginBottom: 20, justifyContent: "flex-end" }}
      >
        <Grid item>
          <Typography style={{ fontWeight: "bold" }}>Tổng tiền hàng</Typography>
          <Typography style={{ fontWeight: "bold" }}>Giảm giá</Typography>

          <Typography style={{ fontWeight: "bold" }}>Cần trả NCC</Typography>
        </Grid>
        <Grid item xs={1} />
        <Grid item>
          <Typography>
            {inventoryHistoryData.items.reduce((total, item) => {
              if (item.unit_price && item.quantity) {
                return total + item.unit_price * item.quantity;
              }
              return total;
            }, 0)}
          </Typography>
          <TextField
            type='number'
            value={inventoryHistoryData.discount}
            onChange={(e) =>
              setInventoryHistoryData({
                ...inventoryHistoryData,
                discount: Number.parseInt(e.target.value),
              })
            }
          />

          <Typography>
            {inventoryHistoryData.items.reduce((total, item) => {
              if (item.unit_price && item.quantity) {
                return total + item.unit_price * item.quantity;
              }
              return total;
            }, 0) - (inventoryHistoryData.discount || 0)}
          </Typography>
        </Grid>
      </Grid>
      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveInventoryHistory}
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

export default InventoryHistoryCreate;
