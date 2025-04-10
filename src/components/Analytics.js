import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
  Collapse,
  Tooltip as MaterialTooltip,
  ExpandMore,
  ExpandLess,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  ResponsiveContainer,
  PieChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Event as EventIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  Alarm as AlarmIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
  StarBorder as StarBorderIcon,
  WarningAmber,
  CheckCircle as CheckCircleIcon2,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  LocalShipping,
  Inventory,
  Assessment,
  Speed,
  NotificationsActive,
  PriorityHigh,
  CalendarToday,
  TrendingDown,
  Person,
  Assignment,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({
    recentIncidents: false,
    categoryPerformance: false,
    topPerformers: false,
    trends: false,
    reportedProducts: false,
    activeUsers: false,
    complaintCategories: false,
  });

  const fetchAnalytics = async () => {
    try {
      // Set the base URL for the API
      axios.defaults.baseURL = 'http://localhost:5002/api';
      
      // Add token to headers
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      // Fetch both endpoints in parallel
      const [dashboardRes, trendsRes, productsRes, usersRes, categoriesRes] = await Promise.all([
        axios.get('/analytics/dashboard'),
        axios.get('/analytics/trends'),
        axios.get('/analytics/most-reported-products'),
        axios.get('/analytics/most-active-users'),
        axios.get('/analytics/complaint-categories')
      ]);

      console.log('Dashboard data:', dashboardRes.data);
      console.log('Trends data:', trendsRes.data);

      setAnalytics({
        ...dashboardRes.data,
        trends: trendsRes.data,
        reportedProducts: productsRes.data,
        activeUsers: usersRes.data,
        complaintCategories: categoriesRes.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const handleExpandClick = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (authLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Typography variant="h5" gutterBottom>
            Please login to view analytics
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/login"
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchAnalytics();
            }}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const stats = [
    {
      title: 'Active Complaints',
      value: analytics.stats?.activeComplaints || '0',
      change: '+12%',
      trend: 'up',
      icon: <WarningAmber fontSize="large" />,
      color: '#ff9800',
      bgColor: '#fff3e0',
      details: [
        { 
          label: 'This Week', 
          value: 'N/A',
          icon: <CalendarToday fontSize="small" color="primary" /> 
        },
        { 
          label: 'Response Rate', 
          value: 'N/A',
          icon: <Speed fontSize="small" color="success" /> 
        },
      ],
    },
    {
      title: 'Resolved Issues',
      value: analytics.stats?.resolvedIssues || '0',
      change: '+8%',
      trend: 'up',
      icon: <CheckCircleIcon fontSize="large" />,
      color: '#4caf50',
      bgColor: '#e8f5e9',
      details: [
        { 
          label: 'Avg Time', 
          value: formatTime(analytics.stats?.avgResolutionTime || 0),
          icon: <TimelineIcon fontSize="small" color="primary" /> 
        },
        { 
          label: 'Satisfaction', 
          value: 'N/A',
          icon: <TrendingIcon fontSize="small" color="success" /> 
        },
        { 
          label: 'Reopened', 
          value: 'N/A',
          icon: <TrendingDown fontSize="small" color="error" /> 
        },
      ],
    },
    {
      title: 'Quality Score',
      value: analytics.reviews?.avgQualityScore ? `${analytics.reviews.avgQualityScore.toFixed(1)}/5` : 'N/A',
      change: '',
      trend: '',
      icon: <StarIcon fontSize="large" />,
      color: '#ffd700',
      bgColor: '#fff9c4',
      details: [
        { 
          label: 'Total Reviews', 
          value: analytics.reviews?.totalReviews || '0',
          icon: <Person fontSize="small" color="primary" /> 
        },
        { 
          label: 'Hygiene Score', 
          value: analytics.reviews?.avgHygieneScore ? `${analytics.reviews.avgHygieneScore.toFixed(1)}/5` : 'N/A',
          icon: <Assessment fontSize="small" color="success" /> 
        },
      ],
    },
    {
      title: 'Pending Complaints',
      value: analytics.pendingComplaints || '0',
      change: '',
      trend: '',
      icon: <Assignment fontSize="large" />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
      details: [],
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <DashboardIcon sx={{ mr: 1 }} />
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 40, height: 40 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 2, fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                {stat.change && (
                  <Chip
                    label={stat.change}
                    color={stat.trend === 'up' ? 'success' : 'error'}
                    size="small"
                    sx={{
                      mb: 2,
                      bgcolor: stat.trend === 'up' ? 'success.light' : 'error.light',
                      '& .MuiChip-label': {
                        fontWeight: 600,
                      },
                    }}
                  />
                )}
                <Divider sx={{ mb: 2 }} />
                {stat.details.map((detail, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MaterialTooltip title={detail.label}>
                      <span>
                        {detail.icon}
                      </span>
                    </MaterialTooltip>
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 1,
                        fontWeight: 500,
                        color: 'text.secondary',
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 1,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Incidents Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Recent Incidents"
              action={
                <IconButton
                  onClick={() => handleExpandClick('recentIncidents')}
                  size="small"
                >
                  {expanded.recentIncidents ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Collapse in={expanded.recentIncidents} timeout="auto" unmountOnExit>
              <CardContent>
                {analytics.recentIncidents && analytics.recentIncidents.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Reporter</TableCell>
                        <TableCell>Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.recentIncidents.map((incident, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{incident.product}</TableCell>
                          <TableCell>{incident.company}</TableCell>
                          <TableCell>
                            <Chip
                              label={incident.status}
                              color={
                                incident.status === 'Resolved' ? 'success' :
                                incident.status === 'Under Investigation' ? 'warning' :
                                'error'
                              }
                              size="small"
                              sx={{
                                '& .MuiChip-label': {
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={incident.priority}
                              color={
                                incident.priority === 'High' ? 'error' :
                                incident.priority === 'Medium' ? 'warning' :
                                'success'
                              }
                              size="small"
                              sx={{
                                '& .MuiChip-label': {
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>{incident.reportedBy?.username}</TableCell>
                          <TableCell>
                            {new Date(incident.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="h6">
                      No recent incidents
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Category Performance Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Category Performance"
              action={
                <IconButton
                  onClick={() => handleExpandClick('categoryPerformance')}
                  size="small"
                >
                  {expanded.categoryPerformance ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Collapse in={expanded.categoryPerformance} timeout="auto" unmountOnExit>
              <CardContent>
                {analytics.categoryPerformance && analytics.categoryPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categoryPerformance}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="performance"
                      >
                        {analytics.categoryPerformance.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid #ccc' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {payload[0].payload.category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Performance: {payload[0].value.toFixed(1)}%
                                </Typography>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="h6">
                      No category data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Top Performers List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Top Performers"
              action={
                <IconButton
                  onClick={() => handleExpandClick('topPerformers')}
                  size="small"
                >
                  {expanded.topPerformers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Collapse in={expanded.topPerformers} timeout="auto" unmountOnExit>
              <CardContent>
                {analytics.topPerformers && analytics.topPerformers.length > 0 ? (
                  <List>
                    {analytics.topPerformers.map((performer, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <PriorityHigh color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={performer.company}
                          secondary={`Resolution Rate: ${performer.resolutionRate.toFixed(1)}%`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: 'primary.main',
                          }}
                          secondaryTypographyProps={{
                            color: 'text.secondary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="h6">
                      No top performers data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* 30-Day Trends Chart */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="30-Day Trends"
              action={
                <IconButton
                  onClick={() => handleExpandClick('trends')}
                  size="small"
                >
                  {expanded.trends ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Collapse in={expanded.trends} timeout="auto" unmountOnExit>
              <CardContent>
                {analytics.trends && analytics.trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={analytics.trends}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid #ccc' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {payload[0].payload.date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Incidents: {payload[0].payload.count}
                                </Typography>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="h6">
                      No trend data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Most Reported Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Most Reported Products"
              action={
                <IconButton
                  onClick={() => handleExpandClick('reportedProducts')}
                  size="small"
                >
                  {expanded.reportedProducts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Collapse in={expanded.reportedProducts} timeout="auto" unmountOnExit>
              <CardContent>
                {analytics?.reportedProducts?.length > 0 ? (
                  <List>
                    {analytics.reportedProducts.map((product, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Inventory color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={product.name}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {product.category}
                              </Typography>
                              {` • ${product.complaintCount} complaints`}
                            </>
                          }
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: 'error.main',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="h6">
                      No product data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Most Active Users */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Most Active Users"
              action={
                <IconButton
                  onClick={() => handleExpandClick('activeUsers')}
                  size="small"
                >
                  {expanded.activeUsers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Collapse in={expanded.activeUsers} timeout="auto" unmountOnExit>
              <CardContent>
                {analytics?.activeUsers?.length > 0 ? (
                  <List>
                    {analytics.activeUsers.map((user, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Person color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={user.name}
                          secondary={`Submitted: ${user.complaintCount} complaints`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: 'primary.main',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="h6">
                      No user activity data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Top Complaint Categories */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Top Complaint Categories"
              action={
                <IconButton
                  onClick={() => handleExpandClick('complaintCategories')}
                  size="small"
                >
                  {expanded.complaintCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Collapse in={expanded.complaintCategories} timeout="auto" unmountOnExit>
              <CardContent>
                {analytics?.complaintCategories?.length > 0 ? (
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid #ccc' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {payload[0].name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Count: {payload[0].value}
                                  </Typography>
                                </Box>
                              );
                            }
                            return null;
                          }}
                        />
                        <Pie
                          data={analytics.complaintCategories}
                          dataKey="count"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.complaintCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="h6">
                      No category data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default Analytics;
