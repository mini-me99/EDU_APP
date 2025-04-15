import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Stopwatch from "./components/Stopwatch";
import AIChat from "./components/AIChat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

function App() {
  useEffect(() => {
    // Add Chatbase script to head
    const script = document.createElement('script');
    script.innerHTML = `
      (function(){
        if(!window.chatbase||window.chatbase("getState")!=="initialized"){
          window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};
          window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})
        }
        const onLoad=function(){
          const script=document.createElement("script");
          script.src="https://www.chatbase.co/embed.min.js";
          script.id="N-o0DfBuKb50DkKlFzGLv";
          script.domain="www.chatbase.co";
          document.body.appendChild(script)
        };
        if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}
      })();
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            backgroundColor: theme.palette.background.default,
            minHeight: "100vh"
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/ai-chat" element={<AIChat />} />
          </Routes>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
