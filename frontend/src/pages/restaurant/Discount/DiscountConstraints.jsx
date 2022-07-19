import React, { useEffect, useState } from 'react'
import {
  Button,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import DeleteIcon from '@material-ui/icons/Delete'
import RemoveIcon from '@material-ui/icons/Remove'
import CustomAccordion from '../../../components/CustomAccordion/CustomAccordion'
import { getGoods } from '../../../apis/good'

function DiscountContraints(props) {
  const { constraints, type, method, handleAddConstraintInput, handleChangeConstraintRow, handleDeleteConstraint } = props
  const [goodSearchKeyword, setGoodSearchKeyword] = useState('')
  const [goodOptions, setGoodOptions] = useState([])

  const handleSearchGoodOptions = async (keyword) => {
    const res = await getGoods()
    setGoodOptions(res.data)
  }

  useEffect(() => {
    if (goodSearchKeyword !== '') {
      handleSearchGoodOptions(goodSearchKeyword)
    }
  }, [goodSearchKeyword])

  const renderTableHead = (type, method) => {
    switch (type) {
      case 'invoice':
        return method === 'invoice-discount' ? (
          <>
            <TableCell>Tổng tiền hàng</TableCell>
            <TableCell>Giảm giá</TableCell>
            <TableCell>Hành động</TableCell>
          </>
        ) : (
          <>
            <TableCell>Tổng tiền hàng</TableCell>
            <TableCell>Tặng tổng</TableCell>
            <TableCell colSpan={2}>Hàng/Nhóm hàng</TableCell>
            <TableCell align='center'>Hành động</TableCell>
          </>
        )

      case 'good':
        return method === 'good-discount' ? (
          <>
            <TableCell>Số lượng</TableCell>
            <TableCell>Hàng/Nhóm hàng mua</TableCell>
            <TableCell>Khuyến mãi</TableCell>
            <TableCell>Hành động</TableCell>
          </>
        ) : (
          <>
            <TableCell>Số lượng</TableCell>
            <TableCell>Hàng/Nhóm hàng mua</TableCell>
            <TableCell>Giảm giá</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Hàng/Nhóm hàng được giảm giá</TableCell>
            <TableCell>Hành động</TableCell>
          </>
        )

      default:
        return null
    }
  }

  const renderTableBody = (type, method, rows = []) => {
    switch (type) {
      case 'invoice':
        return method === 'invoice-discount'
          ? rows.map((row, idx) => (
              <TableRow>
                <TableCell>
                  <TextField
                    label='Từ'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type='number'
                    value={row.min_invoice_value}
                    onChange={(e) => handleChangeConstraintRow(idx, 'min_invoice_value', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.discount_amount}
                    onChange={(e) => handleChangeConstraintRow(idx, 'discount_amount', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ToggleButtonGroup
                            size='small'
                            exclusive
                            value={row.discount_unit}
                            onChange={(e, newVal) => handleChangeConstraintRow(idx, 'discount_unit', newVal)}
                            style={{ marginBottom: '1rem' }}
                          >
                            <ToggleButton value='cash'>VND</ToggleButton>
                            <ToggleButton value='percent'>%</ToggleButton>
                          </ToggleButtonGroup>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteConstraint(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          : rows.map((row, idx) => (
              <TableRow>
                <TableCell>
                  <TextField
                    label='Từ'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type='number'
                    value={row.min_invoice_value}
                    onChange={(e) => handleChangeConstraintRow(idx, 'min_invoice_value', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.discount_item_quantity}
                    onChange={(e) => handleChangeConstraintRow(idx, 'discount_item_quantity', e.target.value)}
                    style={{ maxWidth: 80 }}
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  <Autocomplete
                    className='navbar__searchBar__container'
                    id='free-solo-2-demo'
                    options={goodOptions}
                    value={row.discountItems}
                    onInputChange={(e, val) => setGoodSearchKeyword(val)}
                    onChange={(e, selectedGoods) => handleChangeConstraintRow(idx, 'discountItems', selectedGoods)}
                    multiple
                    getOptionLabel={(option) => option.name}
                    filterOptions={(options, state) => options}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </TableCell>
                <TableCell align='center'>
                  <IconButton onClick={() => handleDeleteConstraint(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))

      case 'good':
        return method === 'good-discount' ? (
          <>
            {rows.map((row, idx) => (
              <TableRow>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.order_item_quantity}
                    onChange={(e) => handleChangeConstraintRow(idx, 'order_item_quantity', e.target.value)}
                    style={{ maxWidth: 80, marginRight: 10 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    className='navbar__searchBar__container'
                    id='free-solo-2-demo'
                    options={goodOptions}
                    value={row.orderItems}
                    onInputChange={(e, val) => setGoodSearchKeyword(val)}
                    onChange={(e, selectedGoods) => handleChangeConstraintRow(idx, 'orderItems', selectedGoods)}
                    multiple
                    getOptionLabel={(option) => option.name}
                    filterOptions={(options, state) => options}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    value={row.discount_option}
                    onChange={(e) => handleChangeConstraintRow(idx, 'discount_option', e.target.value)}
                    SelectProps={{ native: true }}
                    style={{ marginRight: 10 }}
                  >
                    <option value='sale_price'>Giá bán</option>
                    <option value='discount'>Giảm giá</option>
                  </TextField>
                  {row.discount_option === 'sale_price' ? (
                    <TextField
                      type='number'
                      value={row.discount_price}
                      onChange={(e) => handleChangeConstraintRow(idx, 'discount_amount', e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  ) : (
                    <TextField
                      type='number'
                      value={row.discount_amount}
                      onChange={(e) => handleChangeConstraintRow(idx, 'discount_amount', e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <ToggleButtonGroup
                              size='small'
                              value={row.discount_unit}
                              onChange={(e, newVal) => handleChangeConstraintRow(idx, 'discount_unit', newVal)}
                              style={{ marginBottom: '1rem' }}
                            >
                              <ToggleButton>VND</ToggleButton>
                              <ToggleButton>%</ToggleButton>
                            </ToggleButtonGroup>
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                </TableCell>

                <TableCell>
                  <IconButton onClick={() => handleDeleteConstraint(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </>
        ) : (
          <>
            {rows.map((row, idx) => (
              <TableRow>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.order_item_quantity}
                    onChange={(e) => handleChangeConstraintRow(idx, 'order_item_quantity', e.target.value)}
                    style={{ maxWidth: 80, marginRight: 10 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    className='navbar__searchBar__container'
                    id='free-solo-2-demo'
                    options={goodOptions}
                    value={row.orderItems}
                    onInputChange={(e, val) => setGoodSearchKeyword(val)}
                    onChange={(e, selectedGoods) => handleChangeConstraintRow(idx, 'orderItems', selectedGoods)}
                    multiple
                    getOptionLabel={(option) => option.name}
                    filterOptions={(options, state) => options}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.discount_amount}
                    onChange={(e) => handleChangeConstraintRow(idx, 'discount_amount', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ToggleButtonGroup
                            size='small'
                            exclusive
                            value={row.discount_unit}
                            onChange={(e, newVal) => handleChangeConstraintRow(idx, 'discount_unit', newVal)}
                            style={{ marginBottom: '1rem' }}
                          >
                            <ToggleButton value='cash'>VND</ToggleButton>
                            <ToggleButton value='percent'>%</ToggleButton>
                          </ToggleButtonGroup>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.discount_item_quantity}
                    onChange={(e) => handleChangeConstraintRow(idx, 'discount_item_quantity', e.target.value)}
                    style={{ maxWidth: 80, marginRight: 10 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    className='navbar__searchBar__container'
                    id='free-solo-2-demo'
                    options={goodOptions}
                    value={row.discountItems}
                    onInputChange={(e, val) => setGoodSearchKeyword(val)}
                    onChange={(e, selectedGoods) => handleChangeConstraintRow(idx, 'discountItems', selectedGoods)}
                    multiple
                    getOptionLabel={(option) => option.name}
                    filterOptions={(options, state) => options}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteConstraint(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </>
        )

      default:
        return
    }
  }

  return (
    <div>
      {constraints.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>{renderTableHead(type, method)}</TableRow>
            </TableHead>
            <TableBody>{renderTableBody(type, method, constraints)}</TableBody>
          </Table>
        </TableContainer>
      )}

      <div>
        <Button variant='contained' onClick={handleAddConstraintInput}>
          Thêm điều kiện
        </Button>
      </div>
    </div>
  )
}

export default DiscountContraints

