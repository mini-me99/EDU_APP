import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TimerIcon from '@mui/icons-material/Timer';
import { format } from 'date-fns';

interface Task {
  id: number;
  title: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studyTime, setStudyTime] = useState(0);

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
      }));
      setTasks(parsedTasks);
    }
    // Load study time from localStorage
    const storedStudyTime = localStorage.getItem('studyTime');
    if (storedStudyTime) {
      setStudyTime(parseInt(storedStudyTime));
    }
  }, []);

  const upcomingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const todayTasks = upcomingTasks.filter(
    (task) => format(task.dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const completionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Edu AI Pro
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Tasks
              </Typography>
              <Typography variant="h4" component="div">
                {todayTasks.length}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(todayTasks.length / (todayTasks.length + 1)) * 100}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Task Completion
              </Typography>
              <Typography variant="h4" component="div">
                {completionRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Study Time Today
              </Typography>
              <Typography variant="h4" component="div">
                {Math.floor(studyTime / 3600)}h {Math.floor((studyTime % 3600) / 60)}m
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(studyTime / 28800) * 100} // 8 hours target
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Upcoming Deadlines
              </Typography>
              <Typography variant="h4" component="div">
                {upcomingTasks.length}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(upcomingTasks.length / (upcomingTasks.length + 1)) * 100}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Tasks
            </Typography>
            <List>
              {todayTasks.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No tasks for today" />
                </ListItem>
              ) : (
                todayTasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <PendingActionsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${format(task.dueDate, 'h:mm a')}`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AccessTimeIcon />}
                  href="/tasks"
                >
                  Add Task
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<TimerIcon />}
                  href="/stopwatch"
                >
                  Start Timer
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CheckCircleIcon />}
                  href="/tasks"
                >
                  View Tasks
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PendingActionsIcon />}
                  href="/calendar"
                >
                  View Calendar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {tasks.slice(0, 5).map((task) => (
                <ListItem key={task.id}>
                  <ListItemIcon>
                    {task.completed ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <PendingActionsIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={`${task.completed ? 'Completed' : 'Created'} on ${format(
                      task.completed ? task.createdAt : task.dueDate,
                      'MMM d, yyyy'
                    )}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 