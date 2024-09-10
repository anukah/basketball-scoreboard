"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useScore } from '../context/StoreContext';
import { Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

const teamData = [
  { name: "EST", logo: "/images/team-logos/est.png" },
  { name: "JAF", logo: "/images/team-logos/jaf.png" },
  { name: "KEL", logo: "/images/team-logos/kel.png" },
  { name: "RAJ", logo: "/images/team-logos/raj.png" },
  { name: "RUH", logo: "/images/team-logos/ruh.png" },
  { name: "SAB", logo: "/images/team-logos/sab.png" },
  { name: "SEU", logo: "/images/team-logos/seu.png" },
  { name: "SJP", logo: "/images/team-logos/sjp.png" },
  { name: "UOC", logo: "/images/team-logos/uoc.png" },
  { name: "UOM", logo: "/images/team-logos/uom.png" },
  { name: "UOP", logo: "/images/team-logos/uop.png" },
  { name: "UVA", logo: "/images/team-logos/uva.png" },
  { name: "WAY", logo: "/images/team-logos/way.png" },
  { name: "VAV", logo: "/images/team-logos/vav.png" }
];

const Home = () => {
  const { 
    teamAScore, updateTeamAScore, teamBScore, updateTeamBScore,
    teamAName, updateTeamAName, teamBName, updateTeamBName,
    teamALogo, updateTeamALogo, teamBLogo, updateTeamBLogo,
    teamAFouls, updateTeamAFouls, teamBFouls, updateTeamBFouls,
    updateCurrentQuarter, updateCurrentTime, currentRound, updateCurrentRound,
    endMatch, resetMatch
  } = useScore();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    updateCurrentTime(formatTime(timer));
  }, [timer, updateCurrentTime]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  const handleStartStop = () => setIsTimerRunning(prev => !prev);
  const handleReset = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  const handleTeamSelect = useCallback((teamIndex, isTeamA) => {
    const team = teamData[teamIndex];
    if (isTeamA) {
      updateTeamAName(team.name);
      updateTeamALogo(team.logo);
    } else {
      updateTeamBName(team.name);
      updateTeamBLogo(team.logo);
    }
  }, [updateTeamAName, updateTeamALogo, updateTeamBName, updateTeamBLogo]);

  const handleRoundChange = (e) => updateCurrentRound(e.target.value);

  const handleQuarterChange = (event, newQuarter) => {
    if (newQuarter !== null) {
      setSelectedQuarter(newQuarter);
      updateCurrentQuarter(newQuarter);
    }
  };

  const handleScoreChange = useCallback((team, change) => {
    const updateScore = team === 'A' ? updateTeamAScore : updateTeamBScore;
    const currentScore = team === 'A' ? teamAScore : teamBScore;
    updateScore(Math.max(0, currentScore + change));
  }, [updateTeamAScore, updateTeamBScore, teamAScore, teamBScore]);

  const handleFoulChange = useCallback((team, change) => {
    const updateFouls = team === 'A' ? updateTeamAFouls : updateTeamBFouls;
    const currentFouls = team === 'A' ? teamAFouls : teamBFouls;
    updateFouls(Math.max(0, currentFouls + change));
  }, [updateTeamAFouls, updateTeamBFouls, teamAFouls, teamBFouls]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#d9d4d8] p-2">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Scoreboard Controls</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <TextField
            fullWidth
            label="Round"
            value={currentRound}
            onChange={handleRoundChange}
            variant="outlined"
            size="small"
            className="bg-white"
          />
          
          <div className="flex items-center justify-center">
            <ToggleButtonGroup
              value={selectedQuarter}
              exclusive
              onChange={handleQuarterChange}
              size="small"
            >
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                <ToggleButton
                  key={quarter}
                  value={quarter}
                  className={`px-2 py-1 text-xs ${selectedQuarter === quarter ? 'bg-yellow-400 text-white' : 'bg-gray-200'}`}
                >
                  {quarter}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl font-bold">{formatTime(timer)}</span>
            <Button
              variant="contained"
              onClick={handleStartStop}
              size="small"
              className={`py-1 px-2 ${isTimerRunning ? 'bg-[#541212]' : 'bg-[#b24230]'}`}
            >
              {isTimerRunning ? 'Stop' : 'Start'}
            </Button>
            <Button
              variant="contained"
              onClick={handleReset}
              size="small"
              className="py-1 px-2 bg-[#541212]"
            >
              Reset
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['A', 'B'].map((teamLetter) => (
            <div key={`team-${teamLetter}`} className="bg-white border border-gray-300 rounded-lg p-3">
              <h2 className="text-lg font-semibold text-center mb-2">
                Team {teamLetter}: {teamLetter === 'A' ? teamAName : teamBName}
              </h2>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {teamData.map((team, index) => (
                  <ToggleButton
                    key={index}
                    value={team.name}
                    selected={teamLetter === 'A' ? teamAName === team.name : teamBName === team.name}
                    onChange={() => handleTeamSelect(index, teamLetter === 'A')}
                    className={`py-1 text-xs ${teamLetter === 'A' && teamAName === team.name || teamLetter === 'B' && teamBName === team.name ? 'bg-[#b24230] text-white' : 'bg-white text-gray-800 hover:bg-[#b24230] hover:text-white'}`}
                  >
                    {team.name}
                  </ToggleButton>
                ))}
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Score: {teamLetter === 'A' ? teamAScore : teamBScore}</span>
                <div>
                  <Button
                    variant="contained"
                    onClick={() => handleScoreChange(teamLetter, 1)}
                    size="small"
                    className="mr-1 bg-[#b24230]"
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleScoreChange(teamLetter, -1)}
                    size="small"
                    className="bg-[#b24230]"
                  >
                    -
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Fouls: {teamLetter === 'A' ? teamAFouls : teamBFouls}</span>
                <div>
                  <Button
                    variant="contained"
                    onClick={() => handleFoulChange(teamLetter, 1)}
                    size="small"
                    className="mr-1 bg-[#541212]"
                  >
                    Foul
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleFoulChange(teamLetter, -1)}
                    size="small"
                    className="bg-[#541212]"
                  >
                    Undo
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="contained"
            onClick={() => {
              updateTeamAScore(0);
              updateTeamBScore(0);
              updateTeamAFouls(0);
              updateTeamBFouls(0);
            }}
            size="small"
            className="bg-[#541212]"
          >
            Reset Scores/Fouls
          </Button>
          <Button
            variant="contained"
            onClick={endMatch}
            size="small"
            className="bg-[#e39937]"
          >
            End Match
          </Button>
          <Button
            variant="contained"
            onClick={resetMatch}
            size="small"
            className="bg-[#b24230]"
          >
            Reset Match
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;