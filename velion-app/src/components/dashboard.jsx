import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CircularProgress,
  CardContent,
  List,
  Button,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Description as DocumentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  Workspaces as WorkspaceIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  NotificationsActive as NotificationIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { documentAPI, analyticsAPI } from '../services/api';
import { useAuth } from '../contexts/authContexts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeUsers: 0,
    knowledgeGrowth: 0,
    workspaces: 0,
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsResponse = await analyticsAPI.getDashboardData({ timeframe: '7days' });
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch recent documents
      const docsResponse = await documentAPI.getRecent(5);
      if (docsResponse.data.success) {
        setRecentDocuments(docsResponse.data.data);
      }

      // Fetch recent activity
      const activityResponse = await analyticsAPI.getUserEngagement({ limit: 10 });
      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, link }) => (
    <Card className="dashboard-card hover-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h3" className="dashboard-stat">
              {value}
            </Typography>
            {change && (
              <Typography
                variant="body2"
                className={`dashboard-trend ${change >= 0 ? 'trend-up' : 'trend-down'}`}
              >
                <TrendingIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'} this week
              </Typography>
            )}
          </Box>
          <Icon sx={{ fontSize: 48, color, opacity: 0.8 }} />
        </Box>
        {link && (
          <Button
            component={Link}
            to={link}
            size="small"
            sx={{ mt: 2 }}
            startIcon={link.includes('upload') ? <UploadIcon /> : <SearchIcon />}
          >
            {link.includes('upload') ? 'Upload New' : 'Explore'}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const QuickAction = ({ title, description, icon: Icon, color, action }) => (
    <Card className="hover-card">
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}.light`,
            color: `${color}.main`
          }}>
            <Icon />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {description}
            </Typography>
            {action}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name || 'User'}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Here's what's happening with your knowledge network today.
            </Typography>
          </Box>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: 'primary.main' }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
        </Box>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Documents"
            value={stats.totalDocuments || 0}
            change={stats.documentGrowth || 0}
            icon={DocumentIcon}
            color="#1976d2"
            link="/search"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers || 0}
            change={stats.userGrowth || 0}
            icon={PeopleIcon}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Knowledge Growth"
            value={`${stats.knowledgeGrowth || 0}%`}
            change={stats.knowledgeTrend || 0}
            icon={TrendingIcon}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Workspaces"
            value={stats.workspaces || 0}
            change={stats.workspaceGrowth || 0}
            icon={WorkspaceIcon}
            color="#9c27b0"
            link="/workspaces"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <QuickAction
            title="Upload Document"
            description="Share your knowledge with the organization"
            icon={UploadIcon}
            color="primary"
            action={
              <Button
                component={Link}
                to="/upload"
                variant="contained"
                size="small"
                startIcon={<UploadIcon />}
              >
                Upload Now
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickAction
            title="Search Knowledge"
            description="Find documents, experts, and insights"
            icon={SearchIcon}
            color="secondary"
            action={
              <Button
                component={Link}
                to="/search"
                variant="contained"
                size="small"
                startIcon={<SearchIcon />}
              >
                Start Searching
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickAction
            title="Explore Graph"
            description="Visualize knowledge relationships"
            icon={WorkspaceIcon}
            color="warning"
            action={
              <Button
                component={Link}
                to="/graph"
                variant="contained"
                size="small"
                startIcon={<ShareIcon />}
              >
                View Graph
              </Button>
            }
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Documents */}
        <Grid item xs={12} lg={6}>
          <Card className="data-table">
            <Box className="data-table-header">
              <Typography className="data-table-title">
                Recent Documents
              </Typography>
              <Button component={Link} to="/search" size="small">
                View All
              </Button>
            </Box>
            <List disablePadding>
              {recentDocuments.map((doc, index) => (
                <ListItem
                  key={doc.id}
                  divider={index < recentDocuments.length - 1}
                  className="hover-card"
                  sx={{
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon>
                    <DocumentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {doc.title}
                        </Typography>
                        {doc.blockchain_tx_id && (
                          <Tooltip title="Blockchain Verified">
                            <VerifiedIcon fontSize="small" color="success" />
                          </Tooltip>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Typography variant="caption" color="textSecondary">
                          By {doc.uploader?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </Typography>
                        {doc.quality_score && (
                          <Chip
                            label={`${doc.quality_score}/100`}
                            size="small"
                            variant="outlined"
                            color={doc.quality_score >= 80 ? 'success' : doc.quality_score >= 60 ? 'warning' : 'error'}
                          />
                        )}
                      </Box>
                    }
                  />
                  <IconButton size="small">
                    <MoreIcon />
                  </IconButton>
                </ListItem>
              ))}
              {recentDocuments.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography color="textSecondary" align="center">
                        No recent documents
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <Card className="data-table">
            <Box className="data-table-header">
              <Typography className="data-table-title">
                Recent Activity
              </Typography>
              <Button size="small">View Log</Button>
            </Box>
            <List disablePadding>
              {recentActivity.map((activity, index) => (
                <ListItem
                  key={index}
                  divider={index < recentActivity.length - 1}
                  sx={{
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon>
                    <NotificationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {new Date(activity.timestamp).toLocaleString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {recentActivity.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography color="textSecondary" align="center">
                        No recent activity
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  API Response Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2">85ms</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Database Health
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={98}
                    color="success"
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2">98%</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Storage Usage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    color="warning"
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2">65%</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;