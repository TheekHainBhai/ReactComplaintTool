import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  useTheme
} from '@mui/material';
import {
  RateReview as ReviewIcon,
  Assignment as ComplaintIcon,
  Report as IncidentIcon,
  VerifiedUser as FSSAIIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ title, description, icon, buttonText, onClick }) => {
  const theme = useTheme();
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
        <Box sx={{ mb: 2 }}>
          {icon}
        </Box>
        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onClick}
          sx={{
            px: 4,
            py: 1,
            borderRadius: '20px'
          }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  const features = [
    {
      title: 'Reviews',
      description: 'View and manage product reviews. Get insights into customer feedback and improve your products.',
      icon: <ReviewIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      buttonText: 'View Reviews',
      onClick: () => navigate('/reviews'),
      requiredRole: null
    },
    {
      title: 'Complaints',
      description: 'Submit and track customer complaints. Ensure quick resolution and customer satisfaction.',
      icon: <ComplaintIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      buttonText: 'File Complaint',
      onClick: () => navigate('/complaints'),
      requiredRole: null
    },
    {
      title: 'FSSAI Registration',
      description: 'Register and verify your FSSAI license. Ensure compliance with food safety regulations.',
      icon: <FSSAIIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      buttonText: 'FSSAI Services',
      onClick: () => navigate('/fssai/verify'),
      requiredRole: null
    },
    {
      title: 'Incident Tracking',
      description: 'Track and manage incidents. Monitor resolution progress and maintain safety standards.',
      icon: <IncidentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      buttonText: 'Track Incidents',
      onClick: () => navigate('/incidents'),
      requiredRole: 'admin'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and insights about your business performance.',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      buttonText: 'View Analytics',
      onClick: () => navigate('/'),
      requiredRole: 'admin'
    },
    {
      title: 'Admin Dashboard',
      description: 'Access administrative controls and manage system-wide settings.',
      icon: <DashboardIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      buttonText: 'Admin Panel',
      onClick: () => navigate('/dashboard'),
      requiredRole: 'admin'
    }
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            mb: 6, 
            textAlign: 'center',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            borderRadius: 4
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to Quality Management Software
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Your comprehensive solution for quality management and compliance
          </Typography>
        </Paper>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features
            .filter(feature => !feature.requiredRole || (user?.isAdmin && feature.requiredRole === 'admin'))
            .map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
