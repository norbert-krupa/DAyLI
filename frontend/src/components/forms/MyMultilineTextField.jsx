import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MyMultilineTextField({label, name, value, onChange}) {
    return (
        <TextField
            className={"myForm"}
            id="outlined-multiline-static"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            multiline
            rows={4}
        />
    )
}