import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import { Autocomplete } from "@material-ui/lab";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import pick from "../../../utils/pick";
import { createGood, getGood, getGoods, updateGood } from "../../../apis/good";
import CustomAccordion from "../../../components/CustomAccordion/CustomAccordion";
import { createGoodGroup, getGoodGroups } from "../../../apis/good-group";
import { createUnit, getUnits } from "../../../apis/unit";
import { ASSET_BASE_URL } from "../../../configs";
// import './GoodCreate.css'

const goodTypes = [
  {
    name: "Phục vụ ngay",
    value: "ready_served",
  },
  {
    name: "Combo",
    value: "combo",
  },
  {
    name: "Nguyên liệu",
    value: "ingredient",
  },
  {
    name: "Hàng chế biến",
    value: "fresh_served",
  },
];

const defaultGoodData = {
  name: "",
  menuId: null,
  goodGroupId: null,
  salePrice: null,
  deliverySalePrice: null,
  minQuantity: null,
  maxQuantity: null,
  description: "",
  attributes: [],
  basicUnit: null,
  otherUnits: [],
  components: [],
  type: goodTypes[0].value,
  isSoldDirectly: 0,
};

function GoodAttributeCreate(props) {
  const { attribute, handleChange, handleDelete } = props;

  return (
    <div style={{ display: "flex", marginBottom: 10 }}>
      <TextField
        label='Tên thuộc tính'
        InputLabelProps={{
          shrink: true,
          style: {
            fontSize: 20,
          },
        }}
        style={{
          justifyContent: "flex-end",
        }}
        value={attribute.name}
        onChange={(e) => handleChange({ ...attribute, name: e.target.value })}
      />
      <Autocomplete
        className='navbar__searchBar__container'
        freeSolo
        id='free-solo-2-demo'
        multiple
        options={[]}
        // getOptionLabel={(option) => option.userName && option.fullName}
        filterOptions={(options, state) => options}
        onChange={(e, options) => {
          handleChange({ ...attribute, values: options });
        }}
        style={{ flex: 1, marginLeft: 10 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Giá trị'
            fullWidth
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 20,
              },
            }}
          />
        )}
      />
      <IconButton onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

function UnitCreate({ isModalVisible, handleCloseModal }) {
  const [name, setName] = useState("");

  const handleSaveUnit = useCallback(async () => {
    await createUnit({ name });
    handleCloseModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <Modal
      title='Thêm đơn vị'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <TextField
        required
        fullWidth
        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}
        value={name}
        label='Tên đơn vị'
        onChange={(e) => setName(e.target.value)}
      />
      <div style={{ display: "flex", float: "right", marginTop: "2rem" }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveUnit}
          style={{ marginRight: "0.5rem" }}
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

function GoodGroupCreate({ isModalVisible, handleCloseModal }) {
  const [name, setName] = useState("");

  const handleSaveGoodGroup = useCallback(async () => {
    await createGoodGroup({ name });
    handleCloseModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <Modal
      title='Thêm nhóm hàng'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <TextField
        required
        fullWidth
        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div style={{ display: "flex", float: "right", marginTop: "2rem" }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveGoodGroup}
          style={{ marginRight: "0.5rem" }}
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

function GoodComponents({
  components,
  onChangeComponentQuantity,
  onDeleteComponent,
  onChangeComponentUnit,
  unitOptions,
}) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã hàng hóa</TableCell>
            <TableCell>Tên hàng thành phần</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Đơn vị</TableCell>
            {/* <TableCell>Giá bán gốc</TableCell> */}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {components.map((component, idx) => (
            <TableRow key={component.id}>
              <TableCell>{component.id}</TableCell>
              <TableCell>{component.name}</TableCell>
              <TableCell>
                <TextField
                  type='number'
                  InputProps={{ inputProps: { min: 1 } }}
                  value={component.quantity}
                  onChange={(e) =>
                    onChangeComponentQuantity(
                      component.id,
                      Number.parseFloat(e.target.value) || null
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  SelectProps={{ native: true }}
                  style={{ minWidth: 200, marginRight: "1rem" }}
                  select
                  value={component.unit_id}
                  onChange={(e) =>
                    onChangeComponentUnit(
                      component.id,
                      Number.parseInt(e.target.value) || null
                    )
                  }
                >
                  <option value={""}>Chọn đơn vị</option>
                  {unitOptions.map((opt) => (
                    <option value={opt.id}>{opt.name}</option>
                  ))}
                </TextField>
              </TableCell>

              <TableCell>
                <IconButton onClick={() => onDeleteComponent(component.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function GoodStock({ goodId }) {
  return (
    <TableContainer>
      <TableHead>
        <TableRow>
          <TableCell>Tên chi nhánh</TableCell>
          <TableCell>Đơn vị</TableCell>
          <TableCell>Giá nhập/đơn vị</TableCell>
          <TableCell>Tồn kho</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Chi nhánh Hà Nội</TableCell>
          <TableCell>kg</TableCell>
          <TableCell>35000</TableCell>
          <TableCell>4.5</TableCell>
        </TableRow>
      </TableBody>
    </TableContainer>
  );
}

function GoodCreate({ goodId, isModalVisible, handleCloseModal }) {
  const [goodData, setGoodData] = useState(defaultGoodData);
  const [goodOptions, setGoodOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [componentKeyword, setComponentKeyword] = useState("");
  const [isGoodGroupModalVisible, setGoodGroupModalVisible] = useState(false);
  const [isUnitCreateVisible, setUnitCreateVisible] = useState(false);

  const [goodGroupOptions, setGoodGroupOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const fetchGoodData = async (goodId) => {
    const good = (await getGood(goodId)).data;
    setGoodData({
      name: good.name,
      description: good.description,
      minQuantity: good.min_quantity_threshold,
      maxQuantity: good.max_quantity_threshold,
      type: good.type,
      salePrice: good.sale_price,
      deliverySalePrice: good.delivery_sale_price,
      isSoldDirectly: good.is_sold_directly,
      image: good.image,
      basicUnit: (good.units || []).find(
        (unit) => unit.GoodUnit?.multiplier === 1
      ),
      otherUnits:
        (good.units || []).filter((unit) => unit.GoodUnit?.multiplier !== 1) ||
        [],
      components: good.components.map((component) => ({
        ...component,
        quantity: component.GoodComponent?.quantity,
        unit_id: component.GoodComponent?.unit_id,
      })),
    });
  };

  const handleSelectImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods();
    setGoodOptions(
      res.data.map((option) => pick(option, ["id", "name", "import_price"]))
    );
  };

  const handleComponentSearchInputChange = useCallback(
    (e, val, reason) => {
      if (reason === "select-option") {
        const isAlreadySelected =
          goodData.components.findIndex((comp) => comp.id === val.id) !== -1;
        if (!isAlreadySelected) {
          setGoodData({
            ...goodData,
            components: [...goodData.components, { ...val, quantity: 1 }],
          });
        }
        setComponentKeyword("");
      }
    },
    [goodData]
  );

  const handleChangeComponentQuantity = useCallback(
    (componentId, quantity) => {
      setGoodData({
        ...goodData,
        components: goodData.components.map((comp) =>
          comp.id === componentId ? { ...comp, quantity } : comp
        ),
      });
    },
    [goodData]
  );

  const handleChangeComponentUnit = useCallback(
    (componentId, unitId) => {
      setGoodData({
        ...goodData,
        components: goodData.components.map((comp) =>
          comp.id === componentId ? { ...comp, unit_id: unitId } : comp
        ),
      });
    },
    [goodData]
  );

  const handleDeleteComponent = useCallback(
    (componentId) => {
      setGoodData({
        ...goodData,
        components: goodData.components.filter(
          (comp) => comp.id !== componentId
        ),
      });
    },
    [goodData]
  );

  const fetchGroupGoodOptions = async () => {
    const options = (await getGoodGroups()).data;
    setGoodGroupOptions(options);
  };

  const fetchUnitOptions = async () => {
    const options = (await getUnits()).data;
    setUnitOptions(options);
  };

  const handleAddUnit = useCallback(
    (unitId, idx) => {
      const unit = goodData.otherUnits.find((u) => u.id === unitId);
      if (!unit) {
        const newUnits = goodData.otherUnits;
        newUnits[idx] = { ...newUnits[idx], id: unitId };
        setGoodData({ ...goodData, otherUnits: newUnits });
      }
    },
    [goodData]
  );

  const handleRemoveUnit = useCallback(
    (unitId) => {
      setGoodData({
        ...goodData,
        otherUnits: goodData.otherUnits.filter((unit) => unit.id !== unitId),
      });
    },
    [goodData]
  );

  const handleSaveGood = useCallback(async () => {
    const uploadData = {
      name: goodData.name,
      type: goodData.type,
      is_sold_directly: goodData.isSoldDirectly,
      units: JSON.stringify({
        value: goodData.basicUnit
          ? [...goodData.otherUnits, goodData.basicUnit]
          : goodData.otherUnits,
      }),
      components: JSON.stringify({ value: goodData.components }),
    };

    if (goodData.description) {
      uploadData.description = goodData.description;
    }

    if (goodData.salePrice) {
      uploadData.sale_price = goodData.salePrice;
    }

    if (goodData.deliverySalePrice) {
      uploadData.delivery_sale_price = goodData.deliverySalePrice;
    }

    if (goodData.minQuantity) {
      uploadData.min_quantity_threshold = goodData.minQuantity;
    }

    if (goodData.maxQuantity) {
      uploadData.max_quantity_threshold = goodData.maxQuantity;
    }

    if (selectedFile) {
      uploadData.image = selectedFile;
    }

    if (goodId) {
      await updateGood(goodId, uploadData);
    } else {
      await createGood(uploadData);
    }
    handleCloseModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodId, goodData, selectedFile]);

  useEffect(() => {
    if (!selectedFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    handleSearchGoodOptions(componentKeyword);
  }, [componentKeyword]);

  useEffect(() => {
    if (goodId) {
      fetchGoodData(goodId);
    }
    fetchGroupGoodOptions();
    fetchUnitOptions();
  }, [goodId]);

  useEffect(() => {
    if (goodId) {
      fetchGoodData(goodId);
    }
  }, [goodId]);

  useEffect(() => {
    console.log(goodData);
  }, [goodData]);

  return (
    <div className='good__create__container'>
      <GoodGroupCreate
        isModalVisible={isGoodGroupModalVisible}
        handleCloseModal={(success = false) => {
          setGoodGroupModalVisible(false);
          if (success) {
            fetchGroupGoodOptions();
          }
        }}
      />
      <UnitCreate
        isModalVisible={isUnitCreateVisible}
        handleCloseModal={(success = false) => {
          setUnitCreateVisible(false);
          console.log(success);
          if (success) {
            fetchUnitOptions();
          }
        }}
      />
      <Modal
        isModalVisible={isModalVisible}
        handleClose={() => {
          setActiveTab(0);
          setGoodData(defaultGoodData);
          handleCloseModal();
        }}
        title='Thêm hàng hóa'
      >
        <CustomTabs
          labels={
            goodId
              ? ["Thông tin chung", "Thành phần", "Tồn kho"]
              : ["Thông tin chung", "Thành phần"]
          }
          activeTab={activeTab}
          onChangeActiveTab={(val) => setActiveTab(val)}
        >
          <TabPanel value={activeTab} index={0}>
            <div>
              <TextField
                label='Tên hàng hóa'
                fullWidth
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                required
                value={goodData.name}
                onChange={(e) =>
                  setGoodData({ ...goodData, name: e.target.value })
                }
              />

              <TextField
                label='Loại hàng hóa'
                fullWidth
                margin='normal'
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                  },
                }}
                select
                SelectProps={{ native: true }}
                value={goodData.type}
                onChange={(e) =>
                  setGoodData({ ...goodData, type: e.target.value })
                }
              >
                {goodTypes.map((type) => (
                  <option value={type.value}>{type.name}</option>
                ))}
              </TextField>

              <div
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <TextField
                  select
                  margin='normal'
                  label='Nhóm hàng'
                  value={goodData.goodGroupId}
                  onChange={(e) =>
                    setGoodData({
                      ...goodData,
                      goodGroupId: Number.parseInt(e.target.value) || null,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 20,
                    },
                  }}
                  SelectProps={{
                    native: true,
                  }}
                  style={{ minWidth: 200, marginRight: "1rem" }}
                >
                  <option value=''>Chọn nhóm hàng</option>
                  {goodGroupOptions.map((opt) => (
                    <option value={opt.id}>{opt.name}</option>
                  ))}
                </TextField>
                <IconButton
                  onClick={() => setGoodGroupModalVisible(true)}
                  style={{ marginRight: "2rem" }}
                >
                  <AddIcon />
                </IconButton>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={goodData.isSoldDirectly}
                      onChange={(e, checked) =>
                        setGoodData({
                          ...goodData,
                          isSoldDirectly: checked ? 1 : 0,
                        })
                      }
                    />
                  }
                  label='Bán trực tiếp'
                />
              </div>

              <div style={{ display: "flex" }}>
                <TextField
                  label='Giá bán gốc'
                  margin='normal'
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 20,
                    },
                  }}
                  style={{ minWidth: 200, marginRight: "2rem" }}
                  value={goodData.salePrice}
                  onChange={(e) =>
                    setGoodData({
                      ...goodData,
                      salePrice: Number.parseInt(e.target.value) || null,
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>đ</InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label='Giá bán trực tuyến'
                  margin='normal'
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 20,
                    },
                  }}
                  style={{ marginRight: 10 }}
                  value={goodData.deliverySalePrice}
                  onChange={(e) =>
                    setGoodData({
                      ...goodData,
                      deliverySalePrice:
                        Number.parseInt(e.target.value) || null,
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>đ</InputAdornment>
                    ),
                  }}
                />
              </div>

              <TextField
                id='standard-multiline-static'
                variant='outlined'
                fullWidth
                label='Mô tả'
                multiline
                margin='normal'
                rows={3}
                value={goodData.description}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: 20,
                    paddingTop: 10,
                  },
                }}
                onChange={(e) =>
                  setGoodData({ ...goodData, description: e.target.value })
                }
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    border: "1px dashed",
                    minHeight: 200,
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedFile || goodData.image ? (
                    <img
                      src={
                        imagePreview ||
                        `${ASSET_BASE_URL}/images/${goodData.image}`
                      }
                      alt='profile-preview'
                      style={{ maxWidth: 150, minHeight: 150, maxHeight: 300 }}
                    />
                  ) : (
                    <>
                      <IconButton size='medium'>
                        <CameraAltIcon />
                      </IconButton>
                      <Typography>Tải ảnh lên</Typography>
                    </>
                  )}
                </div>
                {selectedFile || goodData.image ? (
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      if (goodData.image) {
                        setGoodData({ ...goodData, image: null });
                      } else {
                        setSelectedFile(null);
                      }
                    }}
                  >
                    Xóa ảnh
                  </Button>
                ) : (
                  <Button variant='contained' component='label'>
                    <Typography>Chọn ảnh</Typography>
                    <input
                      type='file'
                      name='profile'
                      onChange={handleSelectImage}
                      hidden
                    />
                  </Button>
                )}
              </div>

              <CustomAccordion title='Định mức tồn kho'>
                <div style={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label='Ít nhất'
                    margin='normal'
                    type='number'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 20,
                      },
                    }}
                    value={goodData.minQuantity}
                    onChange={(e) =>
                      setGoodData({
                        ...goodData,
                        minQuantity: Number.parseFloat(e.target.value) || null,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    label='Nhiều nhất'
                    type='number'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 20,
                      },
                    }}
                    value={goodData.maxQuantity}
                    onChange={(e) =>
                      setGoodData({
                        ...goodData,
                        maxQuantity: Number.parseFloat(e.target.value) || null,
                      })
                    }
                  />
                </div>
              </CustomAccordion>

              <CustomAccordion title='Đơn vị tính'>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", marginBottom: 10 }}>
                    <TextField
                      margin='normal'
                      label='Đơn vị cơ bản'
                      style={{ minWidth: 200, marginBottom: "1rem" }}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          fontSize: 18,
                        },
                      }}
                      select
                      SelectProps={{ native: true }}
                      onChange={(e) =>
                        setGoodData({
                          ...goodData,
                          basicUnit: {
                            id: Number.parseInt(e.target.value) || null,
                            multiplier: 1,
                          },
                        })
                      }
                      value={goodData.basicUnit?.id}
                    >
                      <option value=''>Chọn đơn vị</option>
                      {unitOptions.map((opt) => (
                        <option value={opt.id}>{opt.name}</option>
                      ))}
                    </TextField>
                    <IconButton
                      style={{ marginRight: "1rem" }}
                      onClick={() => setUnitCreateVisible(true)}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>

                  <Button
                    variant='contained'
                    onClick={() =>
                      setGoodData({
                        ...goodData,
                        otherUnits: [...goodData.otherUnits, {}],
                      })
                    }
                  >
                    Thêm đơn vị tính
                  </Button>

                  <div style={{ marginTop: 5 }}>
                    <List>
                      {(goodData.otherUnits || []).map((unit, idx) => (
                        <ListItem
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <TextField
                            margin='normal'
                            label='Đơn vị'
                            InputLabelProps={{
                              shrink: true,
                            }}
                            SelectProps={{ native: true }}
                            style={{ minWidth: 200, marginRight: "1rem" }}
                            select
                            value={unit.id || -1}
                            onChange={(e) =>
                              handleAddUnit(
                                Number.parseInt(e.target.value),
                                idx
                              )
                            }
                          >
                            {unitOptions.map((opt) => (
                              <option value={opt.id}>{opt.name}</option>
                            ))}
                          </TextField>

                          <TextField
                            label='Quy đổi với đơn vị cơ bản'
                            type='number'
                            InputLabelProps={{ shrink: true }}
                            style={{ marginRight: "1rem" }}
                            onChange={(e) =>
                              setGoodData({
                                ...goodData,
                                otherUnits: goodData.otherUnits.map((u) =>
                                  u.id === unit.id
                                    ? {
                                        ...u,
                                        multiplier:
                                          Number.parseFloat(e.target.value) ||
                                          null,
                                      }
                                    : u
                                ),
                              })
                            }
                          />
                          <IconButton onClick={() => handleRemoveUnit(unit.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </CustomAccordion>
            </div>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Autocomplete
              className='navbar__searchBar__container'
              id='free-solo-2-demo'
              options={goodOptions}
              inputValue={componentKeyword}
              value={null}
              onInputChange={(e, val) => setComponentKeyword(val)}
              getOptionLabel={(option) => option.name}
              filterOptions={(options, state) => options}
              onChange={handleComponentSearchInputChange}
              renderInput={(params) => (
                <TextField
                  label='Hàng hóa thành phần'
                  {...params}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 20,
                    },
                  }}
                />
              )}
            />
            {goodData.components.length > 0 && (
              <div>
                <GoodComponents
                  components={goodData.components}
                  onChangeComponentQuantity={handleChangeComponentQuantity}
                  onChangeComponentUnit={handleChangeComponentUnit}
                  onDeleteComponent={handleDeleteComponent}
                  unitOptions={unitOptions}
                />
              </div>
            )}
          </TabPanel>
          {goodId && (
            <TabPanel value={activeTab} index={2}>
              <div style={{ flex: 1 }}>
                <GoodStock />
              </div>
            </TabPanel>
          )}
        </CustomTabs>
        <div style={{ display: "flex", float: "right", marginTop: 2 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSaveGood}
            style={{ marginRight: "0.5rem" }}
          >
            Lưu
          </Button>
          <Button variant='contained' onClick={handleCloseModal}>
            Hủy bỏ
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default GoodCreate;
