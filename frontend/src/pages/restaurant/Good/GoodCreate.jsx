import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import { Autocomplete } from "@material-ui/lab";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import pick from "../../../utils/pick";
import { createGood, getGood, getGoods, updateGood } from "../../../apis/good";
import CustomAccordion from "../../../components/CustomAccordion/CustomAccordion";
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
  importPrice: null,
  salePrice: null,
  quantity: null,
  minQuantity: null,
  maxQuantity: null,
  description: "",
  attributes: [],
  units: [],
  components: [],
  type: goodTypes[0].value,
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

function GoodUnitCreate(props) {
  const { unit, handleChange, handleDelete } = props;

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
        value={unit.name}
        onChange={(e) => handleChange({ ...unit, name: e.target.value })}
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
          handleChange({ ...unit, values: options });
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

function GoodComponents({
  components,
  onChangeComponentQuantity,
  onDeleteComponent,
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
            <TableCell>Giá bán gốc</TableCell>
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
                    onChangeComponentQuantity(component.id, e.target.value)
                  }
                />
              </TableCell>
              <TableCell>{component.unit || "gram"}</TableCell>
              <TableCell>
                {/* {component.import_price * (component.quantity || 1)} */}
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
          <TableCell>10000</TableCell>
          <TableCell>5</TableCell>
        </TableRow>
      </TableBody>
    </TableContainer>
  );
}

function GoodCreate({ goodId, isModalVisible, handleCloseModal }) {
  const [goodData, setGoodData] = useState(defaultGoodData);
  const [goodOptions, setGoodOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [componentKeyword, setComponentKeyword] = useState("");

  const fetchGoodData = async (goodId) => {
    const good = (await getGood(goodId)).data;
    setGoodData({
      name: good.name,
      description: good.description,
      quantity: good.quantity,
      minQuantity: good.min_quantity_threshold,
      maxQuantity: good.max_quantity_threshold,
      type: good.type,
      importPrice: good.import_price,
      salePrice: good.sale_price,
      attributes: good.attributes || [],
      units: good.units || [],
      components: good.components || [],
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

  useEffect(() => {
    if (!selectedFile) {
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setProfilePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    handleSearchGoodOptions(componentKeyword);
  }, [componentKeyword]);

  useEffect(() => {
    if (goodId) {
      fetchGoodData(goodId);
    }
  }, [goodId]);

  const handleSaveGood = useCallback(async () => {
    const uploadData = {
      name: goodData.name,
      type: goodData.type,
      attributes: goodData.attributes,
      units: goodData.units,
      components: goodData.components,
    };

    if (goodData.description) {
      uploadData.description = goodData.description;
    }

    if (goodData.importPrice) {
      uploadData.import_price = goodData.importPrice;
    }

    if (goodData.salePrice) {
      uploadData.sale_price = goodData.salePrice;
    }
    if (goodData.quantity) {
      uploadData.quantity = goodData.quantity;
    }

    if (goodData.minQuantity) {
      uploadData.min_quantity_threshold = goodData.minQuantity;
    }

    if (goodData.maxQuantity) {
      uploadData.max_quantity_threshold = goodData.maxQuantity;
    }

    if (goodId) {
      await updateGood(goodId, uploadData);
    } else {
      await createGood(uploadData);
    }
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodId, goodData]);

  useEffect(() => {
    if (goodId) {
      fetchGoodData(goodId);
    }
  }, [goodId]);

  return (
    <div className='good__create__container'>
      <Modal
        isModalVisible={isModalVisible}
        handleClose={handleCloseModal}
        title='Thêm hàng hóa'
      >
        <CustomTabs
          labels={["Thông tin chung", "Thành phần", "Tồn kho"]}
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
                ></TextField>
                <FormControlLabel
                  control={<Checkbox />}
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
                    setGoodData({ ...goodData, salePrice: e.target.value })
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
                  value={goodData.salePrice}
                  onChange={(e) =>
                    setGoodData({ ...goodData, salePrice: e.target.value })
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
                  {selectedFile ? (
                    <img
                      src={profilePreview}
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
                {selectedFile ? (
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => setSelectedFile(null)}
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
                      setGoodData({ ...goodData, minQuantity: e.target.value })
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
                      setGoodData({ ...goodData, maxQuantity: e.target.value })
                    }
                  />
                </div>
              </CustomAccordion>
              <CustomAccordion title='Thuộc tính (Màu sắc, kích thước)'>
                <div style={{ flex: 1 }}>
                  <div>
                    <Button
                      variant='contained'
                      onClick={() =>
                        setGoodData({
                          ...goodData,
                          attributes: [
                            {
                              name: "",
                              values: [],
                            },
                            ...goodData.attributes,
                          ],
                        })
                      }
                    >
                      Thêm thuộc tính
                    </Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    {goodData.attributes.map((attribute, index) => (
                      <GoodAttributeCreate
                        attribute={attribute}
                        handleChange={(newAttribute) =>
                          setGoodData({
                            ...goodData,
                            attributes: goodData.attributes.map((attr, idx) =>
                              idx === index ? newAttribute : attr
                            ),
                          })
                        }
                        handleDelete={() =>
                          setGoodData({
                            ...goodData,
                            attributes: goodData.attributes.filter(
                              (attr, idx) => idx !== index
                            ),
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </CustomAccordion>

              <CustomAccordion title='Đơn vị tính'>
                <div style={{ flex: 1 }}>
                  <TextField
                    margin='normal'
                    label='Đơn vị cơ bản'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 20,
                      },
                    }}
                  />
                  <div>
                    <Button variant='contained'>Thêm đơn vị tính</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    {goodData.attributes.map((attribute, index) => (
                      <GoodAttributeCreate
                        attribute={attribute}
                        handleChange={(newAttribute) =>
                          setGoodData({
                            ...goodData,
                            attributes: goodData.attributes.map((attr, idx) =>
                              idx === index ? newAttribute : attr
                            ),
                          })
                        }
                        handleDelete={() =>
                          setGoodData({
                            ...goodData,
                            attributes: goodData.attributes.filter(
                              (attr, idx) => idx !== index
                            ),
                          })
                        }
                      />
                    ))}
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
                  onDeleteComponent={handleDeleteComponent}
                />
              </div>
            )}
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <div>
              <GoodStock />
            </div>
          </TabPanel>
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
