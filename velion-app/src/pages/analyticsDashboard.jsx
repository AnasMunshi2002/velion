import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Description as DocumentIcon,
  Workspaces as WorkspaceIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { analyticsAPI } from '../services/api';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('30days');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [skillGapData, setSkillGapData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchDashboardData();
    fetchSkillGapAnalysis();
  }, [fetchDashboardData, timeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getDashboardData({ timeframe });
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillGapAnalysis = async () => {
    try {
      const response = await analyticsAPI.getSkillGapAnalysis();
      if (response.data.success) {
        setSkillGapData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching skill gap analysis:', error);
    }
  };

  const timeframes = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {value}
            </Typography>
            {change && (
              <Typography
                variant="body2"
                sx={{
                  color: change >= 0 ? 'success.main' : 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  mt: 0.5
                }}
              >
                <TrendingUpIcon sx={{
                  fontSize: 16,
                  mr: 0.5,
                  transform: change >= 0 ? 'none' : 'rotate(180deg)'
                }} />
                {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
              </Typography>
            )}
          </Box>
          <Icon sx={{ fontSize: 40, color }} />
        </Box>
      </CardContent>
    </Card>
  );

  const renderChart = (chartData, type = 'line') => {
    if (!chartData || chartData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="textSecondary">No data available</Typography>
        </Box>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="documents" stroke="#8884d8" name="Documents" />
            <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Active Users" />
            <Line type="monotone" dataKey="quality" stroke="#ffc658" name="Avg Quality" />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Count" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && !dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              label="Timeframe"
            >
              {timeframes.map((tf) => (
                <MenuItem key={tf.value} value={tf.value}>
                  {tf.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={fetchDashboardData}>
            <RefreshIcon />
          </IconButton>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Documents"
            value={dashboardData?.totalDocuments || 0}
            change={dashboardData?.documentGrowth || 0}
            icon={DocumentIcon}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={dashboardData?.activeUsers || 0}
            change={dashboardData?.userGrowth || 0}
            icon={PeopleIcon}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Quality Score"
            value={dashboardData?.avgQualityScore?.toFixed(1) || '0.0'}
            change={dashboardData?.qualityImprovement || 0}
            icon={TrendingUpIcon}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Workspaces"
            value={dashboardData?.activeWorkspaces || 0}
            change={dashboardData?.workspaceGrowth || 0}
            icon={WorkspaceIcon}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activity Trends
                <IconButton size="small" sx={{ ml: 1 }}>
                  <TimelineIcon />
                </IconButton>
              </Typography>
              {renderChart(dashboardData?.activityTrend, 'line')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Types
                <IconButton size="small" sx={{ ml: 1 }}>
                  <PieChartIcon />
                </IconButton>
              </Typography>
              {renderChart(dashboardData?.documentTypes, 'pie')}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Skill Gap Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Skill Gap Analysis
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Identified skill shortages and recommended actions
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Skill</TableCell>
                  <TableCell align="right">Required</TableCell>
                  <TableCell align="right">Available</TableCell>
                  <TableCell align="right">Gap</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Recommended Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skillGapData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.skill}
                      </TableCell>
                      <TableCell align="right">{row.required}</TableCell>
                      <TableCell align="right">{row.available}</TableCell>
                      <TableCell align="right">
                        <Box sx={{
                          color: row.gap > 5 ? 'error.main' :
                            row.gap > 2 ? 'warning.main' : 'success.main'
                        }}>
                          {row.gap}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            row.priority === 'HIGH' ? 'error.light' :
                              row.priority === 'MEDIUM' ? 'warning.light' : 'success.light',
                          color: 'white'
                        }}>
                          {row.priority}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          {row.action}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={skillGapData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {dashboardData?.recommendations && dashboardData.recommendations.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              AI Recommendations
            </Typography>
            <Grid container spacing={2}>
              {dashboardData.recommendations.map((rec, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {rec.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {rec.description}
                    </Typography>
                    <Button size="small" variant="contained">
                      {rec.action}
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AnalyticsDashboard;