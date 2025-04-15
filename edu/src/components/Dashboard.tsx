import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TimerIcon from '@mui/icons-material/Timer';
import { format, isToday, isAfter, parseISO, isValid } from 'date-fns';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });

  const [studyTime, setStudyTime] = useState<number>(0);

  useEffect(() => {
    const storedStudyTime = localStorage.getItem('studyTime');
    if (storedStudyTime) {
      try {
        setStudyTime(parseInt(storedStudyTime, 10));
      } catch (error) {
        console.error('Error parsing study time:', error);
      }
    }
  }, []);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const todayTasks = tasks.filter(task => {
    try {
      const taskDate = parseISO(task.dueDate);
      return isValid(taskDate) && format(taskDate, 'yyyy-MM-dd') === todayStr && !task.completed;
    } catch (error) {
      console.error('Error checking task date:', error);
      return false;
    }
  });

  const upcomingTasks = tasks.filter(task => {
    try {
      const taskDate = parseISO(task.dueDate);
      return isValid(taskDate) && format(taskDate, 'yyyy-MM-dd') > todayStr && !task.completed;
    } catch (error) {
      console.error('Error checking task date:', error);
      return false;
    }
  });

  const completedTasks = tasks.filter(task => task.completed);
  const taskCompletionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Edu AI Pro
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Tasks
              </Typography>
              <Typography variant="h4">
                {todayTasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Completion
              </Typography>
              <Typography variant="h4">
                {taskCompletionRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={taskCompletionRate} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Study Time
              </Typography>
              <Typography variant="h4">
                {Math.floor(studyTime / 60)}h {studyTime % 60}m
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Deadlines
              </Typography>
              <Typography variant="h4">
                {upcomingTasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {tasks
                .filter(task => task.completed)
                .sort((a, b) => {
                  const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                  const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                  return dateB - dateA;
                })
                .slice(0, 5)
                .map((task) => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`Completed on ${format(new Date(task.completedAt || task.createdAt), 'MMM dd, yyyy')}`}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PendingActionsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Total Tasks"
                  secondary={tasks.length}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Completed Tasks"
                  secondary={completedTasks.length}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimerIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Average Study Time"
                  secondary={`${Math.floor(studyTime / 60)} hours per day`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 