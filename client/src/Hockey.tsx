import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Score {
  _id?: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  startTime?: string; // ISO string from backend
  lastUpdated?: string;
}

interface HockeyProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const Hockey: React.FC<HockeyProps> = ({ selectedDate, setSelectedDate }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchScores = async (date?: string) => {
    try {
      const res = await axios.get<Score[]>("http://localhost:3000/api/hockey", {
        params: date ? { date } : {},
      });
      setScores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Fetch scores for the default date on initial load
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      fetchScores(formattedDate);
    }
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleFilterByDate = () => {
    if (!selectedDate) return;
    // Format date in local timezone, not UTC
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    fetchScores(formattedDate);
    handleCloseModal();
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <Button variant="contained" onClick={handleOpenModal}>
          Select Date
        </Button>
      </div>

      {/* Modal with DatePicker */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Select a Date</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              minDate={new Date(2023, 9, 10)} // October 10, 2023
              maxDate={new Date(2024, 5, 25)} // June 25, 2024
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleFilterByDate}>
            Filter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scores List */}
      {scores.length === 0 && <p style={{ color: 'white', textAlign: 'center' }}>No scores found.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '30px' }}>
        {scores.map((score) => (
          <div key={score._id} style={{
            backgroundColor: '#FFD700',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              marginBottom: '12px',
              fontSize: '16px',
              color: '#001f3f',
              fontWeight: score.awayScore > score.homeScore ? 'bold' : 'normal'
            }}>
              {score.awayTeam}: {score.awayScore}
            </div>
            <div style={{
              marginBottom: '12px',
              fontSize: '16px',
              color: '#001f3f',
              fontWeight: score.homeScore > score.awayScore ? 'bold' : 'normal'
            }}>
              {score.homeTeam}: {score.homeScore}
            </div>
            {score.startTime && (
              <div style={{ fontSize: '12px', color: '#001f3f', opacity: 0.7 }}>
                {new Date(score.startTime).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hockey;
