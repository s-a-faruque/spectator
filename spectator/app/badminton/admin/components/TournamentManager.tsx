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

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) return;
    localStorageService.delete('tournaments', id);
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="mt-6 p-6 w-full" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <h3>Existing Tournaments</h3>
      <ul role="list" className="divide-y divide-gray-100 w-full">
        {tournaments.map(t => (
          <li key={t.id} className="flex justify-between gap-x-6 py-5 w-full items-center">
            <p className="text-sm/6 font-semibold text-gray-900 cursor-pointer" >
              <a href={`/badminton/admin/tournament/${t.id}`}>{t.name}</a>
            </p>
            <div className="flex gap-4 items-center">
              <a className="text-sm/6 text-gray-500" href={`/badminton/admin/tournament/${t.id}/matches`}>Manage Matches</a>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                onClick={() => handleDelete(t.id)}
                title="Delete tournament"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
