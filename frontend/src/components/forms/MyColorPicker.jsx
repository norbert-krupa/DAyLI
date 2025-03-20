import React from 'react';
import { Box, TextField } from '@mui/material';

export default function MyColorPicker({ value, onChange }) {
    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: value,
                    border: "1px solid #ccc",
                }}
            />

            <TextField
                type="color"
                value={value}
                onChange={onChange}
                sx={{
                    width: 60,
                    height: 40,
                    padding: 0,
                    minWidth: "auto",
                    "& input": {
                        padding: 0,
                        height: "40px",
                        cursor: "pointer",
                    },
                }}
            />
        </Box>
    );
}
