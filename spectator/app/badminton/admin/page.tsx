'use client';

import { useEffect, useState } from 'react';
import { localStorageService } from '@/lib/localStorageService';

type Tournament = {
  id: string;
  name: string;
  location: string;
};

function getRandomChar() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
}

function getRandomStringWithDivider() {
  const part1 = Array.from({ length: 3 }, getRandomChar).join('');
  const part2 = Array.from({ length: 3 }, getRandomChar).join('');
  return `${part1}-${part2}`;
}

export default function TournamentManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const stored = localStorageService.getAll<Tournament>('tournaments');
    setTournaments(stored);
  }, []);

  const addTournament = () => {
    const newTournament: Tournament = {
      id: getRandomStringWithDivider(),
      name: 'Nova Cup',
      location: 'Halifax'
    };
    localStorageService.create('tournaments', newTournament);
    setTournaments(prev => [...prev, newTournament]);
  };

  const deleteTournament = (id: string) => {
    localStorageService.delete('tournaments', id);
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <h2>Tournaments</h2>
      <button onClick={addTournament}>Add Tournament</button>
      <ul>
        {tournaments.map(t => (
          <li key={t.id}>
            {t.name} - {t.location}
            <button onClick={() => deleteTournament(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
