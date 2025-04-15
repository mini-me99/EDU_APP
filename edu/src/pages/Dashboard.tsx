import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemIcon, Checkbox, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  type: 'video' | 'homework';
  deadline: Date;
  completed: boolean;
  url?: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [stopwatch, setStopwatch] = useState({
    isRunning: false,
    time: 0,
    laps: [] as number[],
  });

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Check for tasks that need alarms
    const checkAlarms = () => {
      tasks.forEach(task => {
        const timeUntilTask = new Date(task.deadline).getTime() - new Date().getTime();
        if (timeUntilTask > 0 && timeUntilTask <= 60000) { // 1 minute before
          toast.info(`Task starting soon: ${task.title}`, {
            position: 'bottom-right',
            autoClose: 5000,
          });
        }
      });
    };

    const interval = setInterval(checkAlarms, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatch.isRunning) {
      interval = setInterval(() => {
        setStopwatch(prev => ({
          ...prev,
          time: prev.time + 10,
        }));
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatch.isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    setStopwatch(prev => ({
      ...prev,
      laps: [...prev.laps, prev.time],
    }));
  };

  const handleReset = () => {
    setStopwatch({
      isRunning: false,
      time: 0,
      laps: [],
    });
  };

  const handleTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Upcoming Tasks
                </Typography>
                <List>
                  {tasks
                    .filter(task => !task.completed)
                    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
                    .slice(0, 5)
                    .map(task => (
                      <ListItem 
                        key={task.id}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          background: 'rgba(0,0,0,0.02)',
                          '&:hover': {
                            background: 'rgba(0,0,0,0.05)',
                          },
                        }}
                      >
                        <ListItemIcon>
                          {task.type === 'video' ? <VideoLibraryIcon color="primary" /> : <AssignmentIcon color="primary" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={task.title}
                          secondary={`Due: ${new Date(task.deadline).toLocaleString()}`}
                        />
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task.id)}
                          color="primary"
                        />
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Stopwatch
                </Typography>
                <Box sx={{ 
                  textAlign: 'center',
                  mb: 3,
                }}>
                  <Typography variant="h3" sx={{ 
                    fontFamily: 'monospace',
                    color: 'primary.main',
                    fontWeight: 'bold',
                  }}>
                    {formatTime(stopwatch.time)}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 3,
                }}>
                  <IconButton
                    onClick={() => setStopwatch(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                    sx={{
                      background: 'primary.main',
                      color: 'white',
                      '&:hover': { background: 'primary.dark' },
                    }}
                  >
                    {stopwatch.isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton
                    onClick={handleLap}
                    disabled={!stopwatch.isRunning}
                    sx={{
                      background: 'secondary.main',
                      color: 'white',
                      '&:hover': { background: 'secondary.dark' },
                    }}
                  >
                    <RestartAltIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleReset}
                    sx={{
                      background: 'error.main',
                      color: 'white',
                      '&:hover': { background: 'error.dark' },
                    }}
                  >
                    <RestartAltIcon />
                  </IconButton>
                </Box>
                {stopwatch.laps.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Laps:
                    </Typography>
                    {stopwatch.laps.map((lap, index) => (
                      <Typography key={index} variant="body2">
                        Lap {index + 1}: {formatTime(lap)}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 