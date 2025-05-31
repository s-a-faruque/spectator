'use client';

import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Player = {
  id: string;
  name: string;
  teamId: string;
};

type Match = {
  id: string;
  tournamentId: string;
  teamAId: string;
  teamBId: string;
  teamAPlayerIds: string[]; // 1 or 2 player IDs
  teamBPlayerIds: string[]; // 1 or 2 player IDs
  court: string;
  schedule: string; // ISO string
};

type Props = {
  tournamentId: string;
};

const MatchManager: React.FC<Props> = ({ tournamentId }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [newMatch, setNewMatch] = useState<Omit<Match, 'id'>>({
    tournamentId,
    teamAId: '',
    teamBId: '',
    teamAPlayerIds: [],
    teamBPlayerIds: [],
    court: '',
    schedule: '',
  });

  // Load teams & players from localStorage
  useEffect(() => {
    const tournamentsRaw = localStorage.getItem('tournaments');
    const playersRaw = localStorage.getItem('players');

    if (tournamentsRaw) {
      const tournaments = JSON.parse(tournamentsRaw);
      if (tournaments) {
        const tournament = tournaments.find((t: any) => t.id === tournamentId);
        if (tournament) {
          setTeamIds(tournament.teamIds || []);
        }
        console.log('tournaments', tournaments);

      }
    }

    if (playersRaw) {
      const allPlayers = JSON.parse(playersRaw);
      setPlayers(allPlayers.players || []);
    }

    const matchRaw = localStorage.getItem(`matches_${tournamentId}`);
    if (matchRaw) {
      setMatches(JSON.parse(matchRaw));
    }
  }, [tournamentId]);

  const saveMatches = (updated: Match[]) => {
    localStorage.setItem(`matches_${tournamentId}`, JSON.stringify(updated));
    setMatches(updated);
  };

  const addMatch = () => {
    const match: Match = { ...newMatch, id: uuidv4() };
    const updated = [...matches, match];
    saveMatches(updated);
    setNewMatch({
      tournamentId,
      teamAId: '',
      teamBId: '',
      teamAPlayerIds: [],
      teamBPlayerIds: [],
      court: '',
      schedule: '',
    });
  };

  const getPlayersForTeam = (teamId: string) => {
    return players.filter((p) => p.teamId === teamId);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Match Manager</h2>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label>Team A:</label>
          <select
            value={newMatch.teamAId}
            onChange={(e) => setNewMatch({ ...newMatch, teamAId: e.target.value, teamAPlayerIds: [] })}
          >
            <option value="">Select Team A</option>
            {teamIds.map((teamId) => (
              <option key={teamId} value={teamId}>
                {teamId}
              </option>
            ))}
          </select>

          {newMatch.teamAId && (
            <div>
              <label>Players (1 or 2):</label>
              <select
                multiple
                value={newMatch.teamAPlayerIds}
                onChange={(e) =>
                  setNewMatch({
                    ...newMatch,
                    teamAPlayerIds: Array.from(e.target.selectedOptions, (opt) => opt.value).slice(0, 2),
                  })
                }
              >
                {getPlayersForTeam(newMatch.teamAId).map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label>Team B:</label>
          <select
            value={newMatch.teamBId}
            onChange={(e) => setNewMatch({ ...newMatch, teamBId: e.target.value, teamBPlayerIds: [] })}
          >
            <option value="">Select Team B</option>
            {teamIds.map((teamId) => (
              <option key={teamId} value={teamId}>
                {teamId}
              </option>
            ))}
          </select>

          {newMatch.teamBId && (
            <div>
              <label>Players (1 or 2):</label>
              <select
                multiple
                value={newMatch.teamBPlayerIds}
                onChange={(e) =>
                  setNewMatch({
                    ...newMatch,
                    teamBPlayerIds: Array.from(e.target.selectedOptions, (opt) => opt.value).slice(0, 2),
                  })
                }
              >
                {getPlayersForTeam(newMatch.teamBId).map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label>Court:</label>
        <input
          type="text"
          value={newMatch.court}
          onChange={(e) => setNewMatch({ ...newMatch, court: e.target.value })}
        />
      </div>

      <div className="mt-2">
        <label>Schedule:</label>
        <input
          type="datetime-local"
          value={newMatch.schedule}
          onChange={(e) => setNewMatch({ ...newMatch, schedule: e.target.value })}
        />
      </div>

      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={addMatch}>
        Add Match
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Scheduled Matches</h3>
        <ul className="list-disc ml-6">
          {matches.map((match) => (
            <li key={match.id}>
              {match.teamAId} vs {match.teamBId} at {match.court} on {new Date(match.schedule).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchManager;
