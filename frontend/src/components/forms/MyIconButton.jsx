import React from 'react';
import IconButton from '@mui/material/IconButton';

export default function MyIconButton({ icon, onClick, sx, ariaLabel }) {
  return (
    <IconButton 
      onClick={onClick} 
      sx={{ 
        width: 40, 
        height: 40, 
        minWidth: 40, 
        minHeight: 40, 
        padding: 0, 
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx
      }} 
      aria-label={ariaLabel}
    >
      {icon}
    </IconButton>
  );
}