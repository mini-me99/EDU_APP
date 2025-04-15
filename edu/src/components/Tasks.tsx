import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Grid,
  IconButton,
  Checkbox,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

interface Task {
  id: number;
  title: string;
  dueDate: string; // Store as ISO string
  completed: boolean;
  createdAt: string; // Store as ISO string
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      localStorage.removeItem('tasks');
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() && dueDate) {
      const task: Task = {
        id: Date.now(),
        title: newTask.trim(),
        dueDate: dueDate.toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setDueDate(null);
    }
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const upcomingTasks = tasks.filter((task) => !task.completed);
  const recentTasks = tasks.filter((task) => task.completed);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tasks
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="New Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Due Date"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={handleAddTask}
              disabled={!newTask.trim() || !dueDate}
              fullWidth
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Tasks
            </Typography>
            <List>
              {upcomingTasks.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No upcoming tasks" />
                </ListItem>
              ) : (
                upcomingTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                    />
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Completed Tasks
            </Typography>
            <List>
              {recentTasks.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No completed tasks" />
                </ListItem>
              ) : (
                recentTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                    />
                    <ListItemText
                      primary={task.title}
                      secondary={`Completed: ${format(new Date(task.createdAt), 'MMM d, yyyy')}`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Tasks; 