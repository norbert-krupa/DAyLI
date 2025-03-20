import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircleIcon from '@mui/icons-material/Circle';

export default function MyDropdown({ label, options, value, onChange, name }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          className={"myForm"}
          label={label}
          value={value}
          onChange={onChange}
          name={name}
        >
          <MenuItem value="">
            <CircleIcon sx={{ color: "#999999", fontSize: 14, mr: 1 }} />
            <em>None</em>
          </MenuItem>

          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <CircleIcon sx={{ color: option.group_color || "#000", fontSize: 14, mr: 1 }} />
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
