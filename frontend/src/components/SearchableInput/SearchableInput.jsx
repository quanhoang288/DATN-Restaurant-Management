import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

function SearchableInput({
  options,
  handleInputChange,
  value,
  handleChange,
  multiple,
}) {
  return (
    <Autocomplete
      className='navbar__searchBar__container'
      id='free-solo-2-demo'
      options={options}
      value={value}
      onInputChange={(e, val) => handleInputChange(val)}
      onChange={(e, val) => handleChange(val)}
      multiple={multiple}
      getOptionLabel={(option) => option.name}
      filterOptions={(options, state) => options}
      renderInput={(params) => <TextField fullWidth {...params} />}
    />
  );
}

SearchableInput.defaultProps = {
  multiple: false,
};

export default SearchableInput;
