import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';

// Regular imports
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Calendar from './components/Calendar';
import Stopwatch from './components/Stopwatch';
import Navigation from './components/Navigation';

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
