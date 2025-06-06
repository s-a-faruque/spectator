'use client';
import { useEffect, useState } from 'react';

interface Player {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  players: Player[];
}

interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  teams: Team[];
  groups: any[];
  stages: any[];
  matches: any[];
}

export default function TeamList({ tournamentId }: { tournamentId: string }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournament, setTournament] = useState<Tournament>();
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState<string>("");

  useEffect(() => {
    if (!tournamentId) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tournament = tournaments.find((t: Tournament) => t.id === tournamentId);
        setTournament(tournament);
        if (tournament && Array.isArray(tournament.teams)) {
          setTeams(tournament.teams);
        } else {
          setTeams([]);
        }
      } catch {
        setTeams([]);
      }
    } else {
      setTeams([]);
    }
  }, [tournamentId]);

  const handleNameClick = () => {
    if (tournament?.name) {
      setEditedName(tournament.name);
      setEditingName(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameBlur = () => {
    if (!tournament) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const idx = tournaments.findIndex(t => t.id === tournament.id);
        if (idx !== -1) {
          tournaments[idx].name = editedName;
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
          setTournament({ ...tournament, name: editedName });
        }
      } catch {}
    }
    setEditingName(false);
  };

  return (
    <div className="mt-6 p-6 w-full" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {editingName ? (
        <input
          className="text-lg font-bold mb-2 border rounded px-2 py-1 w-full"
          value={editedName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          autoFocus
        />
      ) : (
        <h3 className="text-lg font-bold mb-2 cursor-pointer" onClick={handleNameClick} title="Click to edit">
          {tournament?.name || 'Tournament'}
        </h3>
      )}
      <ul role="list" className="divide-y divide-gray-100 w-full">
        {teams.map(team => (
          <li key={team.id} className="flex justify-between gap-x-6 py-5 w-full">
            <div className="flex min-w-0 gap-x-4 w-full">
              <div className="min-w-0 flex-auto w-full">
                <p className="text-sm/6 font-semibold text-gray-900">{team.name}</p>
              </div>
              <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                <ul className="mt-1 truncate text-xs/5 text-gray-500">
                    {team.players.map(player => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}