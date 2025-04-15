import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerIcon from '@mui/icons-material/Timer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Stopwatch functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          setTimerMinutes((prev) => prev - 1);
          setTimerSeconds(59);
        } else {
          setTimerSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else if (timerActive && timerMinutes === 0 && timerSeconds === 0) {
      setShowAlert(true);
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimerStart = () => {
    setTimerActive(true);
  };

  const handleTimerPause = () => {
    setTimerActive(false);
  };

  const handleTimerReset = () => {
    setTimerMinutes(25);
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const saveStudyTime = () => {
    const storedTime = localStorage.getItem('studyTime') || '0';
    const totalTime = parseInt(storedTime) + Math.floor(time / 1000);
    localStorage.setItem('studyTime', totalTime.toString());
    setTime(0);
    setIsRunning(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Time Management
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<AccessTimeIcon />} label="Stopwatch" />
          <Tab icon={<TimerIcon />} label="Timer" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="div" sx={{ mb: 4 }}>
              {formatTime(time)}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color={isRunning ? 'secondary' : 'primary'}
                  startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                  onClick={() => setIsRunning(!isRunning)}
                  sx={{ minWidth: 120 }}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<ReplayIcon />}
                  onClick={() => {
                    setTime(0);
                    setIsRunning(false);
                  }}
                  sx={{ minWidth: 120 }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  onClick={saveStudyTime}
                  disabled={time === 0}
                  sx={{ minWidth: 120 }}
                >
                  Save Time
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ textAlign: 'center' }}>
            {showAlert && (
              <Alert
                severity="success"
                onClose={() => setShowAlert(false)}
                sx={{ mb: 2 }}
              >
                Timer completed! Take a short break.
              </Alert>
            )}
            <Typography variant="h2" component="div" sx={{ mb: 4 }}>
              {`${timerMinutes.toString().padStart(2, '0')}:${timerSeconds
                .toString()
                .padStart(2, '0')}`}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Minutes"
                  type="number"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                  disabled={timerActive}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Seconds"
                  type="number"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                  disabled={timerActive}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Button
                  variant="contained"
                  color={timerActive ? 'secondary' : 'primary'}
                  startIcon={timerActive ? <PauseIcon /> : <PlayArrowIcon />}
                  onClick={timerActive ? handleTimerPause : handleTimerStart}
                  sx={{ minWidth: 120 }}
                >
                  {timerActive ? 'Pause' : 'Start'}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<ReplayIcon />}
                  onClick={handleTimerReset}
                  sx={{ minWidth: 120 }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Stopwatch; 