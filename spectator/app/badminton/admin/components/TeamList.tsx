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
  console.log('Tournament ID', tournamentId);

  useEffect(() => {
    if (!tournamentId) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        console.log('Parsed tournaments:', tournaments);
        const tournament = tournaments.find((t: Tournament) => t.id === tournamentId);
        console.log('Found tournament:', tournament);
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

  return (
    <div>
      <h3>Teams</h3>
      <ul role="list" className="divide-y divide-gray-100">
        {teams.map(team => (
          <li key={team.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">{team.name}</p>
                
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