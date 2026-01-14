import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Search as SearchIcon,
  AccountTree as GraphIcon,
  Workspaces as WorkspaceIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as UploadIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import "./App.css";

// Import components
import Dashboard from "./components/dashboard";
import DocumentUpload from "./pages/documentUpload";
import KnowledgeSearch from "./pages/knowledgeSearch";
import KnowledgeGraph from "./pages/knowledgeGraph";
//import WorkspaceManagement from "./components/WorkspaceManagement";
import AnalyticsDashboard from "./pages/analyticsDashboard";
import Login from "./components/login";
//import UserProfile from "./components/UserProfile";
//import Settings from "./components/Settings";
import PrivateRoute from "./components/privateRoute";
import { AuthProvider } from "./contexts/authContexts";

const drawerWidth = 240;

function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const location = useLocation();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    handleProfileMenuClose();
    showSnackbar("Logged out successfully", "info");
  }, [handleProfileMenuClose, showSnackbar]);

  useEffect(() => {
    // Check for token expiration
    const checkTokenExpiration = () => {
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.exp * 1000 < Date.now()) {
            handleLogout();
            showSnackbar("Session expired. Please login again.", "warning");
          }
        } catch (error) {
          console.error("Error checking token:", error);
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [token, handleLogout, showSnackbar]);

  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      // In a real app, this would be an API call
      const mockNotifications = [
        {
          id: 1,
          title: "Document Approved",
          message: 'Your document "Project Proposal" has been approved',
          read: false,
          time: "2 hours ago",
        },
        {
          id: 2,
          title: "New Comment",
          message: "John commented on your document",
          read: false,
          time: "1 day ago",
        },
        {
          id: 3,
          title: "Workspace Invitation",
          message: 'You have been invited to "AI Research" workspace',
          read: true,
          time: "2 days ago",
        },
      ];
      setNotifications(mockNotifications);
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLoginSuccess = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    showSnackbar("Login successful!", "success");
  };

  const handleNotificationRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <DocumentIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography variant="h6" noWrap>
            DKN
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        <ListItem
          button
          component="a"
          href="/dashboard"
          selected={location.pathname === "/dashboard"}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          button
          component="a"
          href="/upload"
          selected={location.pathname === "/upload"}
        >
          <ListItemIcon>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItem>

        <ListItem
          button
          component="a"
          href="/search"
          selected={location.pathname === "/search"}
        >
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItem>

        <ListItem
          button
          component="a"
          href="/graph"
          selected={location.pathname === "/graph"}
        >
          <ListItemIcon>
            <GraphIcon />
          </ListItemIcon>
          <ListItemText primary="Knowledge Graph" />
        </ListItem>

        <ListItem
          button
          component="a"
          href="/workspaces"
          selected={location.pathname === "/workspaces"}
        >
          <ListItemIcon>
            <WorkspaceIcon />
          </ListItemIcon>
          <ListItemText primary="Workspaces" />
        </ListItem>

        {user?.role === "ADMIN" || user?.role === "KNOWLEDGE_CHAMPION" ? (
          <ListItem
            button
            component="a"
            href="/analytics"
            selected={location.pathname === "/analytics"}
          >
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        ) : null}
      </List>
      <Divider />
      <List>
        <ListItem
          button
          component="a"
          href="/profile"
          selected={location.pathname === "/profile"}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem
          button
          component="a"
          href="/settings"
          selected={location.pathname === "/settings"}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  if (!token) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Digital Knowledge Network
            <Typography variant="caption" sx={{ ml: 2, opacity: 0.8 }}>
              {location.pathname === "/dashboard" && "Dashboard"}
              {location.pathname === "/upload" && "Upload Document"}
              {location.pathname === "/search" && "Knowledge Search"}
              {location.pathname === "/graph" && "Knowledge Graph"}
              {location.pathname === "/workspaces" && "Workspaces"}
              {location.pathname === "/analytics" && "Analytics"}
              {location.pathname === "/profile" && "Profile"}
              {location.pathname === "/settings" && "Settings"}
            </Typography>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                {user?.name?.charAt(0) || "U"}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Typography variant="subtitle2" sx={{ p: 2, fontWeight: "bold" }}>
          Notifications
        </Typography>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="textSecondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationRead(notification.id)}
              sx={{
                backgroundColor: notification.read
                  ? "transparent"
                  : "action.hover",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="body2"
                  fontWeight={notification.read ? "normal" : "bold"}
                >
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {notification.message}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            window.location.href = "/profile";
          }}
        >
          <PersonIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            window.location.href = "/settings";
          }}
        >
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Toolbar /> {/* Spacer for fixed app bar */}
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <DocumentUpload />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <KnowledgeSearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/graph"
              element={
                <PrivateRoute>
                  <KnowledgeGraph />
                </PrivateRoute>
              }
            />
            <Route
              path="/workspaces"
              element={
                <PrivateRoute>{/* <WorkspaceManagement /> */}</PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute allowedRoles={["ADMIN", "KNOWLEDGE_CHAMPION"]}>
                  <AnalyticsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={<PrivateRoute>{/* <UserProfile /> */}</PrivateRoute>}
            />
            <Route
              path="/settings"
              element={<PrivateRoute>{/* <Settings /> */}</PrivateRoute>}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
