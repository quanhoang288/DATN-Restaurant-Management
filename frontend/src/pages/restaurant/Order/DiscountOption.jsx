import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Modal from "../../../components/Modal/Modal";

function DiscountOptionModal(props) {
  const {
    isModalVisible,
    discountOptions,
    selectedOptions,
    handleCloseModal,
    handleApplyDiscount,
    handleSelectDiscountOption,
    handleUpdateDiscountItems,
  } = props;

  return (
    <Modal
      title='Khuyến mãi trên hóa đơn'
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'></TableCell>
              <TableCell>Tên chương trình</TableCell>
              <TableCell>Nội dung khuyến mãi</TableCell>
              <TableCell>Áp dụng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discountOptions.map((opt) => (
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={(selectedOptions || []).some(
                      (selected) => selected.id === opt.id
                    )}
                    onChange={(e, checked) =>
                      handleSelectDiscountOption(opt, checked)
                    }
                  />
                </TableCell>
                <TableCell>{opt.name}</TableCell>
                <TableCell>{opt.description || "Description"}</TableCell>
                <TableCell>
                  {opt.method === "invoice-discount" ? (
                    `${opt.constraint.discount_amount}${
                      opt.constraint.discount_unit === "cash" ? "" : "%"
                    }`
                  ) : opt.method === "invoice-giveaway" ? (
                    <Autocomplete
                      className='navbar__searchBar__container'
                      id='free-solo-2-demo'
                      options={opt.constraint.goods || []}
                      value={
                        selectedOptions.find(
                          (selected) => selected.id === opt.id
                        )?.discountItems || []
                      }
                      onChange={(e, val) =>
                        handleUpdateDiscountItems(opt.id, val)
                      }
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      multiple
                      getOptionLabel={(option) => option.name}
                      filterOptions={(options, state) => options}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          label='Món khuyến mãi'
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 20,
                            },
                          }}
                          style={{ minWidth: 250 }}
                          // margin='normal'
                        />
                      )}
                    />
                  ) : opt.method === "good-giveaway" ? (
                    <Autocomplete
                      className='navbar__searchBar__container'
                      freeSolo
                      id='free-solo-2-demo'
                      options={[]}
                      getOptionLabel={(option) => option.name}
                      filterOptions={(options, state) => options}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          label='Món khuyến mãi'
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              fontSize: 20,
                            },
                          }}
                          style={{ minWidth: 250 }}
                          // margin='normal'
                        />
                      )}
                    />
                  ) : (
                    <Typography>30000</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            handleApplyDiscount(selectedOptions);
          }}
        >
          Áp dụng
        </Button>
        <Button variant='contained' onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
      </div>
    </Modal>
  );
}

export default DiscountOptionModal;
