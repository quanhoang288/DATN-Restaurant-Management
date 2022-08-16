import React, { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";

import { ASSET_BASE_URL } from "../../../configs";
import noImageAvailable from "../../../assets/no-image-available.jpg";
import { parseSearchParams } from "../../../utils/parseSearchParams";
import { getGoods } from "../../../apis/good";
import pick from "../../../utils/pick";
import { Autocomplete } from "@material-ui/lab";
import MenuPopover from "../../../components/MenuPopover/MenuPopover";
import ConfirmDialog from "../../../components/Modal/ConfirmDialog";

function CategoryItem(props) {
  const { item, handleDeleteItem } = props;
  return (
    <Card style={{ position: "relative", margin: "1rem 1rem", minWidth: 200 }}>
      <CardHeader
        action={
          <IconButton
            aria-label='settings'
            size='small'
            onClick={() => handleDeleteItem(item.id)}
          >
            <ClearIcon />
          </IconButton>
        }
        style={{ maxHeight: 50 }}
      />
      <CardMedia
        component='img'
        alt='Item thumbnail'
        height={100}
        width={150}
        image={
          item.image
            ? `${ASSET_BASE_URL}/images/${item.image}`
            : noImageAvailable
        }
      />
      <CardContent style={{ textAlign: "center" }}>
        <Typography style={{ fontWeight: 500 }}>{item.name}</Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          {item.sale_price}
        </Typography>
      </CardContent>
    </Card>
  );
}

function MenuCategories(props) {
  const {
    selectedCategoryIdx,
    categories,
    handleDeleteCategory,
    handleUpdateCategory,
    handleSelectCategory,
  } = props;
  const [goodOptions, setGoodOptions] = useState([]);
  const [componentKeyword, setComponentKeyword] = useState("");
  const [isEditingCategory, setEditingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const handleSearchGoodOptions = async (keyword = "") => {
    const filters = JSON.stringify(
      parseSearchParams({ name: { like: keyword }, type: { ne: "ingredient" } })
    );
    const res = await getGoods({
      filters,
    });
    setGoodOptions(
      res.data.map((option) =>
        pick(option, ["id", "name", "sale_price", "image"])
      )
    );
  };

  const handleComponentSearchInputChange = useCallback(
    (e, val, reason) => {
      if (reason === "select-option") {
        handleUpdateCategory(selectedCategoryIdx, {
          items:
            (selectedCategory?.items || []).findIndex(
              (item) => item.id === val.id
            ) !== -1
              ? selectedCategory?.items
              : [...(selectedCategory?.items || []), val],
        });

        setComponentKeyword("");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCategoryIdx, selectedCategory]
  );

  useEffect(() => {
    handleSearchGoodOptions(componentKeyword);
  }, [componentKeyword]);

  useEffect(() => {
    if (!isEditingCategory) {
      const selectedCategory =
        selectedCategoryIdx < categories.length
          ? categories[selectedCategoryIdx]
          : null;
      setSelectedCategory(selectedCategory);
    }
  }, [isEditingCategory, selectedCategoryIdx, categories]);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <ConfirmDialog
        title='Xóa hạng mục'
        handleCloseDialog={() => setDeleteConfirmVisible(false)}
        isModalVisible={isDeleteConfirmVisible}
        confirmTitle='Xóa'
        description='Bạn có chắc chắn muốn xóa hạng mục này?'
        cancelTitle='Hủy'
        handleConfirm={() => handleDeleteCategory(selectedCategoryIdx)}
        handleCancel={() => setDeleteConfirmVisible(false)}
      />
      <div style={{ flex: 1, marginRight: "2rem" }}>
        <Card>
          <CardContent
            style={{
              display: "flex",
              width: "100%",
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <List
              component='nav'
              style={{
                minWidth: 200,
                borderRight: "1px solid",
                textAlign: "center",
              }}
            >
              {categories.map((category, idx) => (
                <ListItem
                  button
                  selected={idx === selectedCategoryIdx}
                  onClick={() => handleSelectCategory(idx)}
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>

            <div
              style={{
                minWidth: 500,
                maxWidth: 800,
                marginLeft: "2.5rem",
                padding: "0 1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {isEditingCategory ? (
                    <>
                      <TextField
                        style={{ minWidth: 200 }}
                        value={selectedCategory?.name}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...(selectedCategory || {}),
                            name: e.target.value,
                          })
                        }
                        error={!selectedCategory?.name}
                        helperText={
                          !selectedCategory?.name
                            ? "Tên hạng mục không được bỏ trống"
                            : null
                        }
                      />
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          style={{ color: "green" }}
                          onClick={() => {
                            handleUpdateCategory(selectedCategoryIdx, {
                              name: selectedCategory?.name,
                            });
                            setEditingCategory(false);
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          style={{ color: "red" }}
                          onClick={() => setEditingCategory(false)}
                        >
                          <ClearIcon />
                        </IconButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <Typography variant='h6'>
                        {selectedCategory?.name}
                      </Typography>
                      <IconButton
                        style={{ marginLeft: "1rem" }}
                        onClick={() => setEditingCategory(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                </div>
                <IconButton
                  style={{ color: "red" }}
                  onClick={() => setDeleteConfirmVisible(true)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
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
                    fullWidth
                    label='Thêm món ăn'
                    {...params}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: 22,
                      },
                    }}
                  />
                )}
                style={{ marginBottom: 10 }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  rowGap: 20,
                  alignItems: "center",
                  flex: 1,
                  // padding: '2rem 2rem',
                  columnGap: 20,
                  maxHeight: 700,
                  overflow: "auto",
                }}
              >
                {(selectedCategory?.items || []).map((item) => (
                  <CategoryItem
                    item={item}
                    handleDeleteItem={(itemId) =>
                      handleUpdateCategory(selectedCategoryIdx, {
                        items: (selectedCategory?.items || []).filter(
                          (item) => item.id !== itemId
                        ),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MenuCategories;
