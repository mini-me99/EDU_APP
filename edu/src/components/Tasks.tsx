import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format, isToday, isAfter, startOfDay, parseISO, isValid } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });

  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: new Date(),
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  });

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      dueDate: format(newTask.dueDate, 'yyyy-MM-dd'),
      startTime: format(newTask.startTime, 'HH:mm'),
      endTime: format(newTask.endTime, 'HH:mm'),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      dueDate: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    });
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const isTaskDueToday = (task: Task) => {
    try {
      const taskDate = parseISO(task.dueDate);
      return isToday(taskDate);
    } catch (error) {
      console.error('Error checking if task is due today:', error);
      return false;
    }
  };

  const isTaskUpcoming = (task: Task) => {
    try {
      const taskDate = parseISO(task.dueDate);
      const today = startOfDay(new Date());
      return isAfter(taskDate, today) && !isToday(taskDate);
    } catch (error) {
      console.error('Error checking if task is upcoming:', error);
      return false;
    }
  };

  const todayTasks = tasks.filter(task => !task.completed && isTaskDueToday(task));
  const upcomingTasks = tasks.filter(task => !task.completed && isTaskUpcoming(task));
  const completedTasks = tasks
    .filter(task => task.completed)
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt) : new Date(a.createdAt);
      const dateB = b.completedAt ? new Date(b.completedAt) : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

  const renderTaskList = (taskList: Task[], emptyMessage: string) => (
    <List>
      <AnimatePresence>
        {taskList.length > 0 ? (
          taskList.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ListItem>
                <ListItemText
                  primary={task.title}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        size="small"
                        label={`${task.startTime} - ${task.endTime}`}
                        icon={<AccessTimeIcon />}
                      />
                      <Chip
                        size="small"
                        label={formatDate(task.dueDate)}
                        color="primary"
                      />
                      {task.completedAt && (
                        <Chip
                          size="small"
                          label={`Completed: ${formatDate(task.completedAt)}`}
                          color="success"
                        />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleToggleTask(task.id)}
                    color={task.completed ? 'success' : 'default'}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </motion.div>
          ))
        ) : (
          <ListItem>
            <ListItemText primary={emptyMessage} />
          </ListItem>
        )}
      </AnimatePresence>
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={newTask.dueDate}
                onChange={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Start Time"
                value={newTask.startTime}
                onChange={(time) => time && setNewTask({ ...newTask, startTime: time })}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="End Time"
                value={newTask.endTime}
                onChange={(time) => time && setNewTask({ ...newTask, endTime: time })}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Tasks
            </Typography>
            {renderTaskList(todayTasks, "No tasks for today")}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Tasks
            </Typography>
            {renderTaskList(upcomingTasks, "No upcoming tasks")}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Completed Tasks
            </Typography>
            {renderTaskList(completedTasks, "No completed tasks")}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Tasks; 