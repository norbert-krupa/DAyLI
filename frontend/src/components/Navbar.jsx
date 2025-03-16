import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import {Link, useLocation} from 'react-router-dom'
import AxiosUserInstance from './AxiosUserInstance';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Navbar(props) {
    const {content} = props
    const location = useLocation()
    const navigate = useNavigate()
    const path = location.pathname

    const logoutUser = () => {
        AxiosUserInstance.post(`logoutall/`, {})
        .then(() => {
            localStorage.removeItem('Token')
            localStorage.removeItem('user_id')
            localStorage.removeItem('username')
            localStorage.removeItem('user_email')
            navigate('/')
        })
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    {localStorage.getItem('username')}
                </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                anchor='left'
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                <List>
                    <ListItem key={1} disablePadding>
                        <ListItemButton component={Link} to="/home" selected={"/home" === path}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={2} disablePadding>
                        <ListItemButton component={Link} to='/assistant' selected={"/assitant" === path}>
                            <ListItemIcon>
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Assitant"} />
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                    <ListItem key={3} disablePadding>
                        <ListItemButton onClick={logoutUser}>
                            <ListItemIcon>
                                <LogoutIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                </List>
                </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                        {content}
                </Box>
        </Box>
    );
}