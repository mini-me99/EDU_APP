import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import { format, isSameDay } from 'date-fns';

interface Task {
  id: number;
  title: string;
  dueDate: string; // Store as ISO string
  completed: boolean;
  createdAt: string; // Store as ISO string
}

interface Event {
  id: number;
  title: string;
  date: string; // Store as ISO string
  description: string;
}

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: selectedDate,
  });

  useEffect(() => {
    try {
      // Load tasks from localStorage
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }

      // Load events from localStorage
      const storedEvents = localStorage.getItem('events');
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      localStorage.removeItem('tasks');
      localStorage.removeItem('events');
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      const event: Event = {
        id: Date.now(),
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: newEvent.date.toISOString(),
      };
      const updatedEvents = [...events, event];
      setEvents(updatedEvents);
      setOpenDialog(false);
      setNewEvent({ title: '', description: '', date: selectedDate });
    }
  };

  const tasksForSelectedDate = tasks.filter((task) =>
    isSameDay(new Date(task.dueDate), selectedDate)
  );

  const eventsForSelectedDate = events.filter((event) =>
    isSameDay(new Date(event.date), selectedDate)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                {format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Event
              </Button>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Tasks
            </Typography>
            <List>
              {tasksForSelectedDate.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No tasks for this date" />
                </ListItem>
              ) : (
                tasksForSelectedDate.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <EventIcon color={task.completed ? 'success' : 'primary'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${format(new Date(task.dueDate), 'h:mm a')}`}
                    />
                  </ListItem>
                ))
              )}
            </List>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Events
            </Typography>
            <List>
              {eventsForSelectedDate.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No events for this date" />
                </ListItem>
              ) : (
                eventsForSelectedDate.map((event) => (
                  <ListItem key={event.id}>
                    <ListItemIcon>
                      <EventIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={event.title}
                      secondary={event.description}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calendar; 