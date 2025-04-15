import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface ScheduledTask {
  id: string;
  title: string;
  date: Date;
  time: Date;
  description: string;
}

const Calendar = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [newTask, setNewTask] = useState<ScheduledTask>({
    id: '',
    title: '',
    date: new Date(),
    time: new Date(),
    description: '',
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduledTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Check for tasks that need alarms
    const checkAlarms = () => {
      tasks.forEach(task => {
        const taskDateTime = new Date(task.date);
        taskDateTime.setHours(task.time.getHours());
        taskDateTime.setMinutes(task.time.getMinutes());
        
        const timeUntilTask = taskDateTime.getTime() - new Date().getTime();
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
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
    };
    const updatedTasks = [...tasks, taskWithId];
    setTasks(updatedTasks);
    localStorage.setItem('scheduledTasks', JSON.stringify(updatedTasks));
    
    // Set alarm
    const taskDateTime = new Date(taskWithId.date);
    taskDateTime.setHours(taskWithId.time.getHours());
    taskDateTime.setMinutes(taskWithId.time.getMinutes());
    
    const timeUntilAlarm = taskDateTime.getTime() - new Date().getTime();
    if (timeUntilAlarm > 0) {
      setTimeout(() => {
        toast.info(`Time for task: ${taskWithId.title}`, {
          position: 'bottom-right',
          autoClose: 5000,
        });
      }, timeUntilAlarm);
    }

    setNewTask({
      id: '',
      title: '',
      date: new Date(),
      time: new Date(),
      description: '',
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Calendar
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Schedule New Task
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    fullWidth
                  />
                  <DatePicker
                    label="Date"
                    value={newTask.date}
                    onChange={(date) => date && setNewTask({ ...newTask, date })}
                    sx={{ width: '100%' }}
                  />
                  <TimePicker
                    label="Time"
                    value={newTask.time}
                    onChange={(time) => time && setNewTask({ ...newTask, time })}
                    sx={{ width: '100%' }}
                  />
                  <TextField
                    label="Description"
                    multiline
                    rows={4}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Scheduled Tasks
                </Typography>
                {tasks.map((task) => (
                  <Card 
                    key={task.id} 
                    sx={{ 
                      mb: 2,
                      borderRadius: 2,
                      background: 'rgba(0,0,0,0.02)',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary">{task.title}</Typography>
                      <Typography color="textSecondary">
                        {new Date(task.date).toLocaleDateString()} at{' '}
                        {new Date(task.time).toLocaleTimeString()}
                      </Typography>
                      <Typography>{task.description}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calendar; 