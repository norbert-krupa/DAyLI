import * as React from 'react';
import dayjs from 'dayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function MyTimePicker({label, value, onChange, name}) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
                className={"myForm"}
                label={label}
                value={value || dayjs()}
                onChange={(newValue) => onChange(name, newValue)}
                renderInput={(params) => <input {...params} fullWidth/>}
            />
        </LocalizationProvider>
    )
    
}