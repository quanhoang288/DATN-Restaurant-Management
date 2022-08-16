import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import { createMenu, getMenu, updateMenu } from "../../../apis/menu";

import ConfirmDialog from "../../../components/Modal/ConfirmDialog";
import CategoryCreateModal from "./CategoryCreate";
import MenuCategories from "./MenuCategories";
import { ASSET_BASE_URL } from "../../../configs";

// import './MenuCreate.css'

const defaultMenuData = {
  name: "",
  type: "food",
  categories: [],
  is_active: 1,
};

function MenuCreate({ menuId, isModalVisible, handleCloseModal }) {
  const [activeTab, setActiveTab] = useState(0);
  const [menuData, setMenuData] = useState(defaultMenuData);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(-1);
  useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchMenuData = async (menuId) => {
    const res = await getMenu(menuId);
    setMenuData(res.data);
  };

  const handleSelectImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveMenu = useCallback(async () => {
    const uploadData = {
      name: menuData.name,
      is_active: menuData.is_active,
      type: menuData.type,
      categories: JSON.stringify({
        value: menuData.categories.map((category) =>
          category.id
            ? {
                id: category.id,
                name: category.name,
                items: category.items.map((item) => item.id),
              }
            : {
                name: category.name,
                items: category.items.map((item) => item.id),
              }
        ),
      }),
    };
    if (selectedFile) {
      uploadData.image = selectedFile;
    }

    if (menuId) {
      await updateMenu(menuId, uploadData);
    } else {
      await createMenu(uploadData);
    }
    handleCloseModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId, menuData, selectedFile]);

  const handleCreateCategory = useCallback(
    (categoryId, categoryData) => {
      const categories = categoryId
        ? menuData.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  ...categoryData,
                }
              : cat
          )
        : [...menuData.categories, { ...categoryData, items: [] }];
      setMenuData({
        ...menuData,
        categories: categories,
      });
      setCategoryModalVisible(false);
    },
    [menuData]
  );

  const handleDeleteCategory = useCallback(() => {
    setMenuData({
      ...menuData,
      categories: menuData.categories.filter(
        (_, idx) => idx !== selectedCategoryIdx
      ),
    });
    setDeleteDialogVisible(false);
  }, [menuData, selectedCategoryIdx]);

  useEffect(() => {
    if (menuId) {
      fetchMenuData(menuId);
    } else {
      setMenuData(defaultMenuData);
    }
  }, [menuId]);

  useEffect(() => {
    if (!isCategoryModalVisible) {
      setSelectedCategory(null);
    }
  }, [isCategoryModalVisible]);

  useEffect(() => {
    if (menuData.categories.length && selectedCategoryIdx === -1) {
      setSelectedCategoryIdx(0);
    }
  }, [menuData, selectedCategoryIdx]);

  useEffect(() => {
    console.log("menu data", menuData);
  }, [menuData]);

  useEffect(() => {
    if (!isModalVisible) {
      setMenuData(defaultMenuData);
      setSelectedFile(null);
      setActiveTab(0);
    } else {
      setSelectedCategoryIdx(-1);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (!selectedFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <>
      <ConfirmDialog
        isModalVisible={isDeleteDialogVisible}
        title='Xóa hạng mục'
        confirmTitle='Xóa'
        cancelTitle='Hủy bỏ'
        description='Bạn có chắc chắn muốn xóa hạng mục này?'
        handleCancel={() => setDeleteDialogVisible(false)}
        handleConfirm={handleDeleteCategory}
        handleCloseDialog={() => setDeleteDialogVisible(false)}
      />
      <CategoryCreateModal
        categoryId={selectedCategory}
        menuId={menuId}
        isModalVisible={isCategoryModalVisible}
        handleCloseModal={() => {
          setCategoryModalVisible(false);
          setSelectedCategory(null);
        }}
        handleCreateCategory={handleCreateCategory}
        handleShowCategory={(categoryId) => setSelectedCategory(categoryId)}
      />
      <Modal
        isModalVisible={isModalVisible}
        handleClose={handleCloseModal}
        title='Thêm thực đơn'
      >
        <div className='menu__create__container'>
          <CustomTabs
            labels={["Thông tin chung", "Hạng mục"]}
            activeTab={activeTab}
            onChangeActiveTab={(val) => setActiveTab(val)}
          >
            <TabPanel value={activeTab} index={0}>
              <div>
                <TextField
                  label='Tên thực đơn'
                  fullWidth
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22,
                    },
                  }}
                  value={menuData.name}
                  onChange={(e) =>
                    setMenuData({ ...menuData, name: e.target.value })
                  }
                />

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
                    {selectedFile || menuData.image ? (
                      <img
                        src={
                          imagePreview ||
                          `${ASSET_BASE_URL}/images/${menuData.image}`
                        }
                        alt='profile-preview'
                        style={{
                          maxWidth: 150,
                          minHeight: 150,
                          maxHeight: 300,
                        }}
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
                  {selectedFile || menuData.image ? (
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => {
                        if (menuData.image) {
                          setMenuData({ ...menuData, image: null });
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

                <TextField
                  label='Loại thực đơn'
                  select
                  fullWidth
                  margin='normal'
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontSize: 22,
                    },
                  }}
                  value={menuData.type}
                  onChange={(e) =>
                    setMenuData({ ...menuData, type: e.target.value })
                  }
                >
                  <option value='food'>Đồ ăn</option>
                  <option value='beverage'>Đồ uống</option>
                </TextField>
                <FormControl margin='normal'>
                  <FormLabel id='demo-radio-buttons-group-label'>
                    Trạng thái
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby='demo-radio-buttons-group-label'
                    value={menuData.is_active}
                    onChange={(e, value) =>
                      setMenuData({
                        ...menuData,
                        is_active: Number.parseInt(e.target.value),
                      })
                    }
                    name='radio-buttons-group'
                  >
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label='Đang sử dụng'
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label='Ngừng sử dụng'
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <Button
                variant='contained'
                onClick={() => {
                  setCategoryModalVisible(true);
                }}
              >
                Thêm hạng mục
              </Button>
              {menuData.categories.length > 0 && (
                <div>
                  <MenuCategories
                    categories={menuData.categories}
                    selectedCategoryIdx={selectedCategoryIdx}
                    handleSelectCategory={(idx) => setSelectedCategoryIdx(idx)}
                    handleDeleteCategory={(categoryIdx) => {
                      setMenuData({
                        ...menuData,
                        categories: menuData.categories.filter(
                          (cat, idx) => idx !== categoryIdx
                        ),
                      });
                      setSelectedCategoryIdx(-1);
                    }}
                    handleUpdateCategory={(categoryIdx, fields = {}) => {
                      setMenuData({
                        ...menuData,
                        categories: menuData.categories.map((category, idx) =>
                          idx === categoryIdx
                            ? {
                                ...category,
                                ...fields,
                              }
                            : category
                        ),
                      });
                    }}
                  />
                </div>
              )}
            </TabPanel>
          </CustomTabs>
          <div style={{ display: "flex", float: "right", marginTop: 2 }}>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSaveMenu}
            >
              Lưu
            </Button>
            <Button variant='contained' onClick={handleCloseModal}>
              Hủy bỏ
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default MenuCreate;
