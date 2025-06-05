'use client';

import { useEffect, useState } from 'react';
import { localStorageService } from '@/util/localStorageService';
import { v4 as uuidv4 } from 'uuid';
import TeamPlayerManager from './TeamPlayerManager';
import Link from 'next/link';

type Tournament = {
  id: string;
  name: string;
};

type Team = {
  id: string;
  name: string;
  tournamentId: string;
};

export default function TournamentTeamManager({ tournamentId: propTournamentId }: { tournamentId?: string }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTournamentName, setNewTournamentName] = useState('');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(propTournamentId ?? null);

  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editedTeamName, setEditedTeamName] = useState('');

  useEffect(() => {
    setTournaments(localStorageService.getAll<Tournament>('tournaments'));
    setTeams(localStorageService.getAll<Team>('teams'));
  }, []);

  // If propTournamentId changes, update selectedTournamentId
  useEffect(() => {
    if (propTournamentId) {
      setSelectedTournamentId(propTournamentId);
    }
  }, [propTournamentId]);

  const handleCreateTournament = () => {
    if (!newTournamentName.trim()) return;
    const newTournament = { id: uuidv4(), name: newTournamentName };
    localStorageService.create<Tournament>('tournaments', newTournament);
    setTournaments(prev => [...prev, newTournament]);
    setNewTournamentName('');
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim() || !selectedTournamentId) return;
    const newTeam: Team = { id: uuidv4(), name: newTeamName, tournamentId: selectedTournamentId };
    localStorageService.create<Team>('teams', newTeam);
    setTeams(prev => [...prev, newTeam]);
    setNewTeamName('');
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setEditedTeamName(team.name);
  };

  const handleSaveEditTeam = () => {
    if (!editingTeamId) return;
    const updatedTeam: Team = { id: editingTeamId, name: editedTeamName, tournamentId: selectedTournamentId! };
    localStorageService.update<Team>('teams', updatedTeam);
    setTeams(prev => prev.map(team => (team.id === editingTeamId ? updatedTeam : team)));
    setEditingTeamId(null);
    setEditedTeamName('');
  };

  const handleDeleteTeam = (id: string) => {
    localStorageService.delete('teams', id);
    setTeams(prev => prev.filter(team => team.id !== id));
  };

  const teamsForSelectedTournament = teams.filter(t => t.tournamentId === selectedTournamentId);

  return (
    <div>
      {!propTournamentId && (
        <div>
          <h3>Select Tournament</h3>
          <select onChange={e => setSelectedTournamentId(e.target.value)} value={selectedTournamentId ?? ''}>
            <option value="" disabled>Select a tournament</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedTournamentId && (
        <div>
          <h3>Teams</h3>
          <Link href={`/badminton/admin/tournament/${selectedTournamentId}/groups`}>Add teams to groups</Link>
          <hr />
          <input
            type="text"
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            placeholder="Team name"
          />
          <button onClick={handleAddTeam}>Add Team</button>

          <ul>
            {teamsForSelectedTournament.map(team => (
              <li key={team.id}>
                {editingTeamId === team.id ? (
                  <>
                    <input
                      type="text"
                      value={editedTeamName}
                      onChange={e => setEditedTeamName(e.target.value)}
                    />
                    <button onClick={handleSaveEditTeam}>Save</button>
                  </>
                ) : (
                  <>
                    {team.name}
                    <button onClick={() => handleEditTeam(team)}>Edit</button>
                    <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
                  </>
                )}

                {/* Render players inside this team */}
                <TeamPlayerManager teamId={team.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
