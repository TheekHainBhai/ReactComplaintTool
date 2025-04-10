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
  Container
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
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SimpleReviewForm from './SimpleReviewForm';
import logo from '../assets/WhatsApp Image 2025-04-10 at 12.53.22_8af46ac0.jpg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [servicesAnchorEl, setServicesAnchorEl] = useState(null);
  const [fssaiAnchorEl, setFssaiAnchorEl] = useState(null);

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

  const handleServicesMenuOpen = (event) => {
    setServicesAnchorEl(event.currentTarget);
  };

  const handleServicesMenuClose = () => {
    setServicesAnchorEl(null);
  };

  const handleFssaiMenuOpen = (event) => {
    setFssaiAnchorEl(event.currentTarget);
  };

  const handleFssaiMenuClose = () => {
    setFssaiAnchorEl(null);
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
    { label: 'Home', icon: <HomeIcon />, action: () => navigate('/') },
    { label: 'Services', icon: <ListIcon />, action: () => navigate('/services') },
    ...(user?.isAdmin ? [
      { label: 'Admin Dashboard', icon: <DashboardIcon />, action: () => navigate('/dashboard') }
    ] : [])
  ];

  const servicesMenuItems = [
    { label: 'Complaints', icon: <RateReviewIcon />, action: () => navigate('/complaints') },
    { label: 'Reviews', icon: <RateReviewIcon />, action: () => navigate('/reviews') },
    ...(user?.isAdmin ? [
      { label: 'Incidents', icon: <ReportIcon />, action: () => navigate('/incidents') }
    ] : [])
  ];

  const fssaiMenuItems = [
    { label: 'FSSAI Verify', icon: <VerifiedUserIcon />, action: () => navigate('/fssai/verify') },
    { label: 'FSSAI Register', icon: <AppRegistrationIcon />, action: () => navigate('/fssai/register') },
  ];

  const profileMenuItems = [
    { label: 'Profile', icon: <PersonIcon />, action: handleProfile },
    { label: 'Settings', icon: <SettingsIcon />, action: () => navigate('/settings') },
    { label: 'Logout', icon: <LogoutIcon />, action: handleLogout }
  ];

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={logo} alt="QMS Logo" style={{ height: '40px', marginRight: '10px' }} />
        <Toolbar disableGutters sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={handleServicesMenuOpen}
              startIcon={<ListIcon />}
            >
              Services
            </Button>
            <Menu
              anchorEl={servicesAnchorEl}
              open={Boolean(servicesAnchorEl)}
              onClose={handleServicesMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {servicesMenuItems.map((item) => (
                <MenuItem key={item.label} onClick={() => { item.action(); handleServicesMenuClose(); }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
            <Button
              color="inherit"
              onClick={handleFssaiMenuOpen}
              startIcon={<VerifiedUserIcon />}
            >
              FSSAI Services
            </Button>
            <Menu
              anchorEl={fssaiAnchorEl}
              open={Boolean(fssaiAnchorEl)}
              onClose={handleFssaiMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {fssaiMenuItems.map((item) => (
                <MenuItem key={item.label} onClick={() => { item.action(); handleFssaiMenuClose(); }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
            {user?.isAdmin && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/dashboard')}
                  startIcon={<DashboardIcon />}
                >
                  Admin Dashboard
                </Button>
              </>
            )}
            <SimpleReviewForm />
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
            {profileMenuItems.map((item) => (
              <MenuItem key={item.label} onClick={item.action}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
