'use client';

import { useEffect, useState } from 'react';
import { localStorageService } from '@/util/localStorageService';
import { v4 as uuidv4 } from 'uuid';

type Tournament = {
  id: string;
  name: string;
  location: string;
  teamIds: string[];
};

type Team = {
  id: string;
  name: string;
  tournamentId: string;
};

export default function TournamentTeamManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editTeamName, setEditTeamName] = useState('');

  useEffect(() => {
    setTournaments(localStorageService.getAll<Tournament>('tournaments'));
    setTeams(localStorageService.getAll<Team>('teams'));
  }, []);

  const handleAddTeam = () => {
    if (!selectedTournamentId) return;

    const newTeam: Team = {
      id: uuidv4(),
      name: `Team ${teams.length + 1}`,
      tournamentId: selectedTournamentId
    };

    localStorageService.create<Team>('teams', newTeam);
    setTeams(prev => [...prev, newTeam]);

    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    if (tournament) {
      const updatedTournament: Tournament = {
        ...tournament,
        teamIds: [...(tournament.teamIds || []), newTeam.id]
      };
      localStorageService.update<Tournament>('tournaments', updatedTournament);
      setTournaments(prev =>
        prev.map(t => (t.id === updatedTournament.id ? updatedTournament : t))
      );
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    const updatedTeams = teams.filter(t => t.id !== teamId);
    setTeams(updatedTeams);
    localStorageService.delete('teams', teamId);

    if (selectedTournamentId) {
      const tournament = tournaments.find(t => t.id === selectedTournamentId);
      if (tournament) {
        const updatedTournament: Tournament = {
          ...tournament,
          teamIds: tournament.teamIds.filter(id => id !== teamId)
        };
        localStorageService.update('tournaments', updatedTournament);
        setTournaments(prev =>
          prev.map(t => (t.id === updatedTournament.id ? updatedTournament : t))
        );
      }
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setEditTeamName(team.name);
  };

  const handleSaveTeamName = () => {
    const team = teams.find(t => t.id === editingTeamId);
    if (!team) return;

    const updatedTeam: Team = { ...team, name: editTeamName };
    localStorageService.update('teams', updatedTeam);
    setTeams(prev => prev.map(t => (t.id === updatedTeam.id ? updatedTeam : t)));

    setEditingTeamId(null);
    setEditTeamName('');
  };

  const teamsForSelectedTournament = selectedTournamentId
    ? teams.filter(t => t.tournamentId === selectedTournamentId)
    : [];

  return (
    <div>
      <h2>Select Tournament</h2>
      <select
        onChange={e => setSelectedTournamentId(e.target.value)}
        value={selectedTournamentId || ''}
      >
        <option value="" disabled>
          Select a tournament
        </option>
        {tournaments.map(t => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {selectedTournamentId && (
        <>
          <button onClick={handleAddTeam}>Add Team to Tournament</button>
          <h3>Teams</h3>
          <ul>
            {teamsForSelectedTournament.map(team => (
              <li key={team.id}>
                {editingTeamId === team.id ? (
                  <>
                    <input
                      type="text"
                      value={editTeamName}
                      onChange={e => setEditTeamName(e.target.value)}
                    />
                    <button onClick={handleSaveTeamName}>Save</button>
                    <button onClick={() => setEditingTeamId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {team.name}
                    <button onClick={() => handleEditTeam(team)}>Edit</button>
                    <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
