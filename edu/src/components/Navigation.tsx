import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Edu AI Pro
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: location.pathname === '/' ? 700 : 400,
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/tasks"
            sx={{
              fontWeight: location.pathname === '/tasks' ? 700 : 400,
            }}
          >
            Tasks
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/calendar"
            sx={{
              fontWeight: location.pathname === '/calendar' ? 700 : 400,
            }}
          >
            Calendar
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/stopwatch"
            sx={{
              fontWeight: location.pathname === '/stopwatch' ? 700 : 400,
            }}
          >
            Stopwatch
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 