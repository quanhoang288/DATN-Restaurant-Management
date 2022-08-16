import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ClearIcon from "@material-ui/icons/Clear";
import {
  createDiscount,
  getDiscount,
  updateDiscount,
} from "../../../apis/discount";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

import { getGoods } from "../../../apis/good";
import DiscountContraints from "./DiscountConstraints";
import CustomAccordion from "../../../components/CustomAccordion/CustomAccordion";
import Editor from "../../../components/Editor/Editor";
import { ASSET_BASE_URL } from "../../../configs";
import { formatDate } from "../../../utils/date";
// import './DiscountCreate.css'

const defaultValues = {
  name: "",
  type: "invoice",
  method: "invoice-discount",
  isActive: 1,
  description: "",
  isAppliedDirectly: false,
  customerGroups: [],
  fromDate: null,
  toDate: null,
  timeSlots: [],
  constraints: [],
  image: null,
};

function DiscountCreate({ discountId, isModalVisible, handleCloseModal }) {
  const [discountData, setDiscountData] = useState(defaultValues);
  const [discountMethodOptions, setDiscountMethodOptions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [goodOptions, setGoodOptions] = useState([]);
  const [isSaveDiscountSuccessful, setSaveDiscountSuccessful] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchdiscountData = async (discountId) => {
    const discount = (await getDiscount(discountId)).data;
    console.log("fetching discount data");
    if (discount) {
      console.log(
        "start date: ",
        formatDate(discount.start_date, "MM/DD/YYYY")
      );
      setDiscountData({
        name: discount.name,
        type: discount.type,
        method: discount.method,
        isActive: discount.is_active,
        image: discount.image,
        description: discount.description,
        isAppliedDirectly: discount.is_auto_applied === 1,
        customerGroups: [],
        fromDate: formatDate(discount.start_date, "YYYY-MM-DD"),
        toDate: formatDate(discount.end_date, "YYYY-MM-DD"),
        constraints: (discount.constraints || []).map((constraint) => ({
          ...constraint,
          discountItems: (constraint.goods || []).filter(
            (good) => good.DiscountConstraintGood?.is_discount_item
          ),
          orderItems: (constraint.goods || []).filter(
            (good) => !good.DiscountConstraintGood?.is_discount_item
          ),
        })),
        timeSlots: discount.timeSlots || [],
      });
    }
  };

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods();
    setGoodOptions(res.data);
  };

  const handleAddConstraintInput = useCallback(() => {
    let newConstraint;
    if (discountData.type === "invoice") {
      newConstraint =
        discountData.method === "invoice-discount"
          ? {
              min_invoice_value: null,
              discount_amount: null,
              discount_unit: null,
            }
          : {};
    } else {
      newConstraint =
        discountData.method === "good-discount"
          ? { discount_option: "sale_price" }
          : {};
    }
    setDiscountData({
      ...discountData,
      constraints: [...discountData.constraints, newConstraint],
    });
  }, [discountData]);

  const handleChangeConstraintRow = useCallback(
    (idx, field, newVal) => {
      setDiscountData({
        ...discountData,
        constraints: discountData.constraints.map((constraint, index) =>
          index === idx ? { ...constraint, [field]: newVal } : constraint
        ),
      });
    },
    [discountData]
  );

  const handleDeleteConstraint = useCallback(
    (idx) => {
      setDiscountData({
        ...discountData,
        constraints: discountData.constraints.filter(
          (constraint, index) => index !== idx
        ),
      });
    },
    [discountData]
  );

  const handleSelectImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveDiscount = useCallback(async () => {
    const postData = {
      name: discountData.name,
      description: discountData.description,
      is_active: discountData.isActive,
      type: discountData.type,
      method: discountData.method,
      constraints: JSON.stringify({ value: discountData.constraints }),
      start_date: discountData.fromDate,
      end_date: discountData.toDate,
      is_auto_applied: discountData.isAppliedDirectly,
      timeSlots: JSON.stringify({ value: discountData.timeSlots }),
    };
    if (selectedFile) {
      postData.image = selectedFile;
    }
    console.log("post data: ", postData);
    if (discountId) {
      await updateDiscount(discountId, postData);
    } else {
      await createDiscount(postData);
    }
    handleCloseModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountId, discountData, selectedFile]);

  const handleAddTimeRange = useCallback(() => {
    setDiscountData({
      ...discountData,
      timeSlots: [
        ...discountData.timeSlots,
        { start_time: null, end_time: null },
      ],
    });
  }, [discountData]);

  const handleUpdateTimeRange = useCallback(
    (selectedIndex, key, val) => {
      setDiscountData({
        ...discountData,
        timeSlots: discountData.timeSlots.map((timeRange, index) =>
          index === selectedIndex ? { ...timeRange, [key]: val } : timeRange
        ),
      });
    },
    [discountData]
  );

  const handleRemoveTimeRange = useCallback(
    (idx) => {
      setDiscountData({
        ...discountData,
        timeSlots: discountData.timeSlots.filter((_, index) => index !== idx),
      });
    },
    [discountData]
  );

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
    if (discountId) {
      console.log("discount id: ", discountId);
      fetchdiscountData(discountId);
    } else {
      setDiscountData(defaultValues);
    }
  }, [discountId]);

  useEffect(() => {
    if (discountData.type === "invoice") {
      setDiscountMethodOptions([
        {
          name: "Giảm giá đơn hàng",
          value: "invoice-discount",
        },
        {
          name: "Tặng món/quà",
          value: "invoice-giveaway",
        },
      ]);
    } else {
      setDiscountMethodOptions([
        {
          name: "Mua hàng khuyến mại hàng",
          value: "good-giveaway",
        },
        {
          name: "Giảm giá/ Đồng giá (theo SL mua)",
          value: "good-discount",
        },
      ]);
    }
  }, [discountData.type]);

  useEffect(() => {
    if (discountMethodOptions.length) {
      setDiscountData({
        ...discountData,
        method: discountMethodOptions[0].value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountMethodOptions]);

  useEffect(() => {
    console.log("discount data: ", discountData);
  }, [discountData]);

  return (
    <Modal
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
      title='Thêm chương trình khuyến mãi'
    >
      <CustomTabs
        labels={["Thông tin chung", "Điều kiện áp dụng", "Áp dụng khuyến mại"]}
        activeTab={activeTab}
        onChangeActiveTab={(val) => setActiveTab(val)}
      >
        <TabPanel value={activeTab} index={0}>
          <div>
            <TextField
              label='Tên chương trình'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              required
              value={discountData.name}
              onChange={(e) =>
                setDiscountData({ ...discountData, name: e.target.value })
              }
            />

            <FormControl margin='normal'>
              <FormLabel id='demo-radio-buttons-group-label'>
                Trạng thái
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-radio-buttons-group-label'
                value={discountData.isActive}
                onChange={(e, val) =>
                  setDiscountData({
                    ...discountData,
                    isActive: Number.parseInt(e.target.value),
                  })
                }
                name='radio-buttons-group'
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label='Kích hoạt'
                />
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label='Chưa áp dụng'
                />
              </RadioGroup>
            </FormControl>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  border: "1px dashed",
                  minHeight: 150,
                  marginBottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedFile || discountData.image ? (
                  <img
                    src={
                      imagePreview ||
                      `${ASSET_BASE_URL}/images/${discountData.image}`
                    }
                    alt='profile-preview'
                    style={{ maxWidth: 150, minHeight: 150, maxHeight: 300 }}
                  />
                ) : (
                  <>
                    <IconButton size='medium' onClick={handleSelectImage}>
                      <CameraAltIcon />
                    </IconButton>
                    <Typography>Tải ảnh lên</Typography>
                  </>
                )}
              </div>
              {selectedFile || discountData.image ? (
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    if (discountData.image) {
                      setDiscountData({ ...discountData, image: null });
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

            <CustomAccordion title='Mô tả'>
              <div style={{ flex: 1 }}>
                <Editor
                  placeholder='Viết gì đó...'
                  editorHtml={discountData.description}
                  handleChange={(html) =>
                    setDiscountData({ ...discountData, description: html })
                  }
                />

                {/* <div
                  style={{ border: "1px solid red", maxHeight: 150 }}
                  dangerouslySetInnerHTML={{ __html: discountData.description }}
                ></div> */}
              </div>
            </CustomAccordion>
          </div>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <div>
            <TextField
              label='Khuyến mại theo'
              margin='normal'
              fullWidth
              select
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              value={discountData.type}
              onChange={(e) =>
                setDiscountData({ ...discountData, type: e.target.value })
              }
            >
              <option value='invoice'>Hóa đơn</option>
              <option value='good'>Hàng hóa</option>
            </TextField>
            <TextField
              label='Hình thức'
              margin='normal'
              fullWidth
              select
              SelectProps={{ native: true }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 22,
                },
              }}
              value={discountData.method}
              onChange={(e) =>
                setDiscountData({ ...discountData, method: e.target.value })
              }
            >
              {discountMethodOptions.map((option) => (
                <option value={option.value}>{option.name}</option>
              ))}
            </TextField>
            <FormControlLabel
              control={<Checkbox />}
              label='Tự động áp dụng khuyến mại này khi tạo đơn'
            />
            <DiscountContraints
              constraints={discountData.constraints}
              type={discountData.type}
              method={discountData.method}
              discountId={discountId}
              handleAddConstraintInput={handleAddConstraintInput}
              handleChangeConstraintRow={handleChangeConstraintRow}
              handleDeleteConstraint={handleDeleteConstraint}
            />
          </div>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <div>
            <Card>
              <CardHeader
                title='Thời gian áp dụng'
                titleTypographyProps={{ style: { fontSize: 18 } }}
              />
              <CardContent>
                <div style={{ display: "flex" }}>
                  <TextField
                    label='Hiệu lực từ'
                    margin='normal'
                    type='date'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22,
                      },
                    }}
                    required
                    fullWidth
                    style={{ marginRight: "2rem" }}
                    value={discountData.fromDate}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        fromDate: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label='Hiệu lực đến'
                    margin='normal'
                    type='date'
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22,
                      },
                    }}
                    required
                    fullWidth
                    value={discountData.toDate}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        toDate: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card style={{ marginTop: "2rem" }}>
              <CardHeader
                title='Khung giờ áp dụng khuyến mại'
                titleTypographyProps={{ style: { fontSize: 18 } }}
              />
              <CardContent>
                <Button variant='contained' onClick={handleAddTimeRange}>
                  Thêm khung giờ
                </Button>
                {discountData.timeSlots.length > 0 && (
                  <div>
                    {discountData.timeSlots.map((timeRange, idx) => (
                      <div style={{ display: "flex", marginBottom: 10 }}>
                        <TextField
                          label='Từ giờ'
                          margin='normal'
                          type='time'
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 22,
                            },
                          }}
                          style={{ marginRight: "2rem" }}
                          value={timeRange.start_time}
                          onChange={(e) =>
                            handleUpdateTimeRange(
                              idx,
                              "start_time",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                        <TextField
                          label='Đến giờ'
                          type='time'
                          margin='normal'
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 22,
                            },
                          }}
                          fullWidth
                          value={timeRange.end_time}
                          onChange={(e) =>
                            handleUpdateTimeRange(
                              idx,
                              "end_time",
                              e.target.value
                            )
                          }
                        />
                        <IconButton
                          style={{ marginLeft: "1rem" }}
                          onClick={() => handleRemoveTimeRange(idx)}
                        >
                          <ClearIcon />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabPanel>
      </CustomTabs>
      <div style={{ display: "flex", float: "right", marginTop: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveDiscount}
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

export default DiscountCreate;
