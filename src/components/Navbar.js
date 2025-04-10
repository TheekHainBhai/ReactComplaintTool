import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Report as ReportIcon,
  RateReview as RateReviewIcon,
  VerifiedUser as VerifiedUserIcon,
  AppRegistration as AppRegistrationIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SimpleReviewForm from './SimpleReviewForm';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, action: () => navigate('/dashboard') },
    { label: 'Reviews', icon: <RateReviewIcon />, action: () => navigate('/reviews') },
    { label: 'FSSAI Verify', icon: <VerifiedUserIcon />, action: () => navigate('/fssai/verify') },
    { label: 'FSSAI Register', icon: <AppRegistrationIcon />, action: () => navigate('/fssai/register') },
    { label: 'FSSAI List', icon: <ListIcon />, action: () => navigate('/fssai/list') },
    { label: 'Profile', icon: <PersonIcon />, action: handleProfile },
    { label: 'Settings', icon: <SettingsIcon />, action: () => navigate('/settings') },
    { label: 'Logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMobileMenuOpen}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          onClick={() => navigate('/')}
        >
          Quality Dashboard
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/dashboard')}
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/incidents')}
            startIcon={<ReportIcon />}
          >
            Incidents
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/reviews')}
            startIcon={<RateReviewIcon />}
          >
            Reviews
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/complaints')}
            sx={{ 
              background: theme.palette.secondary.main, 
              color: 'white',
              '&:hover': {
                background: theme.palette.secondary.dark,
              }
            }}
          >
            File Complaint
          </Button>
          <SimpleReviewForm />
          <Button color="inherit" onClick={() => navigate('/analytics')}>
            Analytics
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/fssai/verify')}
            startIcon={<VerifiedUserIcon />}
          >
            FSSAI Verify
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/fssai/register')}
            startIcon={<AppRegistrationIcon />}
          >
            FSSAI Register
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/fssai/list')}
            startIcon={<ListIcon />}
          >
            FSSAI List
          </Button>

          {user ? (
            <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 2 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 35,
                  height: 35,
                }}
                src={user.avatar}
              >
                {user.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.label} onClick={item.action}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {item.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ py: 1, px: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.company || 'Company'}
            </Typography>
          </Box>
          <Divider />
          {menuItems.map((item) => (
            <MenuItem key={item.label} onClick={item.action}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
