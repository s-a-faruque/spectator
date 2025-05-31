'use client';

import { useEffect, useState } from 'react';
import { localStorageService } from '@/util/localStorageService';
import { v4 as uuidv4 } from 'uuid';

type Team = {
  id: string;
  name: string;
  tournamentId: string;
};

type Player = {
  id: string;
  name: string;
  teamId: string;
};

export default function PlayerManager({ teamId }: { teamId: string }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    const allPlayers = localStorageService.getAll<Player>('players');
    setPlayers(allPlayers.filter(p => p.teamId === teamId));
  }, [teamId]);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: uuidv4(),
      name: newPlayerName,
      teamId,
    };

    localStorageService.create<Player>('players', newPlayer);
    setPlayers(prev => [...prev, newPlayer]);
    setNewPlayerName('');
  };

  const handleDeletePlayer = (id: string) => {
    localStorageService.delete('players', id);
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ marginLeft: '1rem' }}>
      <h4>Players</h4>
      <input
        type="text"
        value={newPlayerName}
        onChange={e => setNewPlayerName(e.target.value)}
        placeholder="Player name"
      />
      <button onClick={handleAddPlayer}>Add Player</button>

      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.name}
            <button onClick={() => handleDeletePlayer(player.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
