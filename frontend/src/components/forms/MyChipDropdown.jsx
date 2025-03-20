import React from "react";
import { Box, MenuItem, FormControl, InputLabel, Select, Chip, OutlinedInput, ListItemIcon, Typography } from "@mui/material";
import tinycolor from "tinycolor2";

export default function MyChipDropdown({ label, name, value, onChange, options }) {
    const modifiedOptions = [
        { label: "No Group", value: null, color: "#999999" },
        ...options
    ];

    const getTextColor = (bgColor) => {
            return tinycolor(bgColor).isLight() ? "#000000" : "#FFFFFF";
        };

    return (
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
                labelId={`${name}-label`}
                id={name}
                multiple
                value={value}
                onChange={(event) => {
                    const selectedValues = event.target.value;
                    onChange(name, selectedValues);
                }}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((selectedValue) => {
                            const selectedOption = modifiedOptions.find(opt => opt.value === selectedValue);
                            return selectedOption ? (
                                <Chip
                                    key={selectedValue}
                                    label={selectedOption.label}
                                    sx={{ backgroundColor: selectedOption.color, color: getTextColor(selectedOption.color) }}
                                />
                            ) : null;
                        })}
                    </Box>
                )}
            >
                {modifiedOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <ListItemIcon>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: option.color,
                                    display: "inline-block",
                                }}
                            />
                        </ListItemIcon>
                        <Typography>{option.label}</Typography>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
