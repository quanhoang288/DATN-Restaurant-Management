import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getMenuCategory } from "../../../apis/menu";
import Modal from "../../../components/Modal/Modal";
import pick from "../../../utils/pick";

const defaultCategoryData = {
  name: "",
};

function CategoryCreateModal(props) {
  const {
    menuId,
    categoryId,
    isModalVisible,
    handleCloseModal,
    handleCreateCategory,
  } = props;
  const [categoryData, setCategoryData] = useState(defaultCategoryData);

  const fetchCategoryData = async (menuId, categoryId) => {
    const res = await getMenuCategory(menuId, categoryId);
    setCategoryData(pick(res.data, ["name"]));
  };

  useEffect(() => {
    if (menuId && categoryId) {
      fetchCategoryData(menuId, categoryId);
    } else {
      setCategoryData(defaultCategoryData);
    }
  }, [categoryId, menuId]);

  return (
    <Modal
      title={categoryId ? "Sửa hạng mục" : "Thêm hạng mục"}
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <TextField
        label='Tên hạng mục'
        fullWidth
        margin='normal'
        InputLabelProps={{
          shrink: true,
          style: {
            fontSize: 22,
          },
        }}
        value={categoryData.name}
        onChange={(e) =>
          setCategoryData({ ...categoryData, name: e.target.value })
        }
      />

      <div style={{ display: "flex", float: "right", marginTop: 10 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleCreateCategory(categoryId, categoryData)}
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

export default CategoryCreateModal;
