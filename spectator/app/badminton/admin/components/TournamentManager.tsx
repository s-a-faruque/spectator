'use client';

import { useEffect, useState } from 'react';
import { localStorageService } from '@/util/localStorageService';
import { v4 as uuidv4 } from 'uuid';

type Tournament = {
  id: string;
  name: string;
};

export default function TournamentManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [newTournamentName, setNewTournamentName] = useState('');
  
  useEffect(() => {
    setTournaments(localStorageService.getAll<Tournament>('tournaments'));
  }, []);

  const handleCreateTournament = () => {
    if (!newTournamentName.trim()) return;
    const newTournament = { id: uuidv4(), name: newTournamentName };
    localStorageService.create<Tournament>('tournaments', newTournament);
    setTournaments(prev => [...prev, newTournament]);
    setNewTournamentName('');
  };
  return (
    <div>

      <div>
        <input
          type="text"
          value={newTournamentName}
          onChange={e => setNewTournamentName(e.target.value)}
          placeholder="Tournament name"
        />
        <button onClick={handleCreateTournament}>Add Tournament</button>
      </div>
      <div>
        <h3>Existing Tournaments</h3>
        <ul>
          {tournaments.map(t => (
            <li key={t.id}>
              {t.name} : <a href={`/badminton/admin/tournament/${t.id}/teams`}>Manage Teams</a> - <a href={`/badminton/admin/tournament/${t.id}/matches`}>Manage Matches</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
