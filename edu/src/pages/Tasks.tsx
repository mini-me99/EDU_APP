import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Grid, List, ListItem, ListItemText, ListItemIcon, Checkbox, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface Task {
  id: string;
  title: string;
  type: 'video' | 'homework';
  url?: string;
  timeLimit?: number; // in hours
  deadline: Date;
  completed: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed'>>({
    title: '',
    type: 'video',
    url: '',
    timeLimit: 0,
    deadline: new Date(),
  });

  useEffect(() => {
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

  const handleAddTask = () => {
    const taskWithId: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };

    const updatedTasks = [...tasks, taskWithId];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Set alarm for task deadline
    const timeUntilDeadline = new Date(taskWithId.deadline).getTime() - new Date().getTime();
    if (timeUntilDeadline > 0) {
      setTimeout(() => {
        toast.info(`Time to start task: ${taskWithId.title}`, {
          position: 'bottom-right',
          autoClose: 5000,
        });
      }, timeUntilDeadline);
    }

    // Set time limit alarm if specified
    if (taskWithId.timeLimit) {
      setTimeout(() => {
        toast.warning(`Time's up for task: ${taskWithId.title}`, {
          position: 'bottom-right',
          autoClose: 5000,
        });
        if (taskWithId.type === 'video' && taskWithId.url) {
          window.open('about:blank', '_self');
          window.close();
        }
      }, taskWithId.timeLimit * 60 * 60 * 1000);
    }

    setNewTask({
      title: '',
      type: 'video',
      url: '',
      timeLimit: 0,
      deadline: new Date(),
    });
  };

  const handleTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Tasks
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
                  Add New Task
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Task Type</InputLabel>
                    <Select
                      value={newTask.type}
                      label="Task Type"
                      onChange={(e) => setNewTask({ ...newTask, type: e.target.value as 'video' | 'homework' })}
                    >
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="homework">Homework</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="URL (for videos)"
                    value={newTask.url}
                    onChange={(e) => setNewTask({ ...newTask, url: e.target.value })}
                    fullWidth
                  />
                  <DateTimePicker
                    label="Deadline"
                    value={newTask.deadline}
                    onChange={(date) => date && setNewTask({ ...newTask, deadline: date })}
                  />
                  <TextField
                    label="Time Limit (hours)"
                    type="number"
                    value={newTask.timeLimit}
                    onChange={(e) => setNewTask({ ...newTask, timeLimit: Number(e.target.value) })}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTask}
                    disabled={!newTask.title}
                    sx={{ mt: 2 }}
                  >
                    Add Task
                  </Button>
                </Box>
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
                  Your Tasks
                </Typography>
                <List>
                  {tasks.map((task) => (
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
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        {task.type === 'video' ? <VideoLibraryIcon color="primary" /> : <AssignmentIcon color="primary" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <>
                            {task.url && (
                              <Typography component="span" variant="body2" color="primary">
                                <a href={task.url} target="_blank" rel="noopener noreferrer">
                                  Open Link
                                </a>
                              </Typography>
                            )}
                            <Typography component="span" variant="body2" display="block">
                              Deadline: {new Date(task.deadline).toLocaleString()}
                            </Typography>
                            {task.timeLimit && (
                              <Typography component="span" variant="body2">
                                Time Limit: {task.timeLimit} hours
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Checkbox
                        edge="end"
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
      </Grid>
    </Box>
  );
};

export default Tasks; 