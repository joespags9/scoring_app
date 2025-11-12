import { useState } from "react";
import { Tabs, Tab, Box, AppBar, Toolbar, Typography } from "@mui/material";
import Hockey from "./Hockey";
import Basketball from "./Basketball";

const App: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [hockeyDate, setHockeyDate] = useState<Date | null>(new Date(2023, 10, 9)); // November 9, 2023
  const [basketballDate, setBasketballDate] = useState<Date | null>(new Date(2023, 10, 25)); // November 25, 2023

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#001f3f" }}>
      <AppBar position="static" sx={{ backgroundColor: "#FFD700" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#001f3f" }}>
            Sports Scores
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: "#001f3f",
              },
              '& .Mui-selected': {
                color: "#001f3f",
              },
              '& .MuiTabs-indicator': {
                backgroundColor: "#001f3f",
              }
            }}
          >
            <Tab label="Hockey" />
            <Tab label="Basketball" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {tab === 0 && <Hockey selectedDate={hockeyDate} setSelectedDate={setHockeyDate} />}
      {tab === 1 && <Basketball selectedDate={basketballDate} setSelectedDate={setBasketballDate} />}
    </Box>
  );
};

export default App;

