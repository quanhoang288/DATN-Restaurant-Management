import React from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

import ChipLabel from "../../../components/ChipLabel/ChipLabel";

function OrderDiscounts(props) {
  const { discounts, handleRemoveDiscount } = props;
  return (
    <div>
      <div className='discount__invoice' style={{ marginBottom: "1rem" }}>
        <Typography style={{ fontWeight: 500 }}>
          Khuyến mãi trên hóa đơn
        </Typography>

        {(discounts || []).filter((discount) => discount.type === "invoice")
          .length > 0 && (
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell>Tên chương trình</TableCell>
                <TableCell>Hình thức khuyến mãi</TableCell>
                <TableCell>Khuyến mãi</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(discounts || [])
                .filter((discount) => discount.type === "invoice")
                .map((discount) => (
                  <TableRow>
                    <TableCell>{discount.name}</TableCell>
                    <TableCell>{discount.method}</TableCell>
                    <TableCell>
                      {discount.method === "invoice-discount" ? (
                        `${discount.constraint.discount_amount}${
                          discount.constraint.discount_unit === "cash"
                            ? ""
                            : "%"
                        }`
                      ) : (
                        <div style={{ display: "flex" }}>
                          {(discount.discountItems || []).map((item) => (
                            <ChipLabel
                              key={item.id}
                              label={item.name}
                              variant='primary'
                            />
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleRemoveDiscount(discount.id)}
                      >
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableContainer>
        )}
      </div>
      <div className='discount__good'>
        <Typography style={{ fontWeight: 500 }}>
          Khuyến mãi trên hàng hóa
        </Typography>
      </div>
    </div>
  );
}

export default OrderDiscounts;
