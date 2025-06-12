'use client';

import styles from '../../../../../scorer/badminton.module.css';
import { useEffect, useState } from 'react';
import Header from '../../../../../ui-components/Header';
import Navigation from '../../../../../ui-components/Navigation'

interface Params {
  id: string;
}

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  groupId?: string;
  round?: string;
  stage: 'group' | 'knockout';
  court?: string;
  dateTime?: string;
  status?: string;
  teamAPlayers?: string[];
  teamBPlayers?: string[];
  numSets?: number; // Number of sets for the match
  winPoints?: number; // Points awarded to the winner
  setScores?: { setNo: number; teamAScore: number; teamBScore: number; winner?: 'A' | 'B' | null }[];
  matchWinner?: 'A' | 'B' | null;
}

interface Team {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  teamId: string;
}

export default function MatchExportPage({ params }: { params: Params }) {
  const { id } = params;
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournamentName, setTournamentName] = useState<string>('');
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    // Load tournament from localStorage
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments = JSON.parse(tournamentsRaw);
        const tournament = tournaments.find((t: any) => t.id === id);
        if (tournament) {
          setMatches(tournament.matches || []);
          setTeams(tournament.teams || []);
          // Flatten all players from all teams
          const allPlayers: Player[] = (tournament.teams || []).flatMap((team: any) =>
            (team.players || []).map((p: any) => ({ ...p, teamId: team.id }))
          );
          setPlayers(allPlayers);
          setTournamentName(tournament.name || 'Tournament');
          setGroups(tournament.groups || []);
        }
      } catch {}
    }
  }, [id]);

  const getGroupName = (groupId: string) => groups.find(g => g.id === groupId)?.name || groupId;
  const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.name || teamId;
  const getPlayerName = (playerId: string) => players.find(p => p.id === playerId)?.name || playerId;

  const navigation = [
    { name: 'Tournament Team', href: `/badminton/admin/tournament/${id}/`, current: false },
    { name: 'Home', href: '/', current: false },
    { name: 'Matches', href: `/badminton/admin/tournament/${id}/matches/`, current: false },
    { name: 'Schedule Export', href: '#', current: true },
    { name: 'Point Tables', href: `/badminton/admin/tournament/${id}/matches/points-table`, current: false }
  ];

  return (
    <div className="min-h-full">
          <Navigation navigation={navigation} />
          <Header title={tournamentName} />
          <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className={styles.matchesList + ' print:bg-white print:text-black print:p-0'}>
                {matches.length === 0 ? (
                  <div className="text-gray-500">No matches found for this tournament.</div>
                ) : (
                  <table className="w-full border border-gray-300 text-xs print:text-xs print:w-full print:border-black">
                    <thead>
                      <tr className="bg-gray-100 print:bg-white">
                        <th className="border px-2 py-1">#</th>
                        <th className="border px-2 py-1">Team A</th>
                        <th className="border px-2 py-1">Team B</th>
                        <th className="border px-2 py-1">Players</th>
                        <th className="border px-2 py-1">Court</th>
                        <th className="border px-2 py-1">Date/Time</th>
                        <th className="border px-2 py-1">Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((m: any, idx: number) => (
                        <tr key={m.id} className="border-b print:border-black">
                          <td className="border px-2 py-1 text-center">{idx + 1}</td>
                          <td className="border px-2 py-1 font-semibold">{getTeamName(m.teamA)}</td>
                          <td className="border px-2 py-1 font-semibold">{getTeamName(m.teamB)}</td>
                          <td className="border px-2 py-1">
                            {Array.isArray(m.teamAPlayers) && Array.isArray(m.teamBPlayers) ? (
                              <span>
                                <span className="font-medium">A:</span> {m.teamAPlayers.map((pid: string) => getPlayerName(pid)).join(', ')}<br />
                                <span className="font-medium">B:</span> {m.teamBPlayers.map((pid: string) => getPlayerName(pid)).join(', ')}
                              </span>
                            ) : '--'}
                          </td>
                          <td className="border px-2 py-1">{m.court || ''}</td>
                          <td className="border px-2 py-1">{m.dateTime ? new Date(m.dateTime).toLocaleString() : ''}</td>
                          <td className="border px-2 py-1">{m.stage}{m.groupId ? ` (${getGroupName(m.groupId)})` : m.round ? ` (${m.round})` : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>
        </div>
  );
}
