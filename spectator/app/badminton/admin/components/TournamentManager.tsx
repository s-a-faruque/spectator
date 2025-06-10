'use client';

import { useEffect, useState } from 'react';
import { localStorageService } from '@/util/localStorageService';
import { XCircleIcon } from '@heroicons/react/24/outline'

type Tournament = {
  id: string;
  name: string;
};

export default function TournamentManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  
  useEffect(() => {
    setTournaments(localStorageService.getAll<Tournament>('tournaments'));
  }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) return;
    localStorageService.delete('tournaments', id);
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="w-full">
      <ul role="list" className="divide-y divide-gray-100 w-full">
        {tournaments.map(t => (
          <li key={t.id} className="flex justify-between gap-x-6 py-5 w-full items-center">
            <p className="text-sm/6 font-semibold text-gray-900 cursor-pointer" >
              <a href={`/badminton/admin/tournament/${t.id}`}>{t.name}</a>
            </p>
            <div className="flex gap-4 items-center">
              <a className="text-sm/6 text-gray-500" href={`/badminton/admin/tournament/${t.id}/matches`}>Manage Matches</a>
              <XCircleIcon onClick={() => handleDelete(t.id)} aria-hidden="true" className="size-6 text-red-400 group-data-open:block" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
