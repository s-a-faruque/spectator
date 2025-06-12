"use client";

import styles from '../../../../../scorer/badminton.module.css';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Header from '../../../../../ui-components/Header';
import Navigation from '../../../../../ui-components/Navigation'
import { PrinterIcon } from '@heroicons/react/24/outline';

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
  numSets?: number;
  winPoints?: number;
  setScores?: { setNo: number; teamAScore: number; teamBScore: number; winner?: 'A' | 'B' | null }[];
  matchWinner?: 'A' | 'B' | null;
}

interface Team {
  id: string;
  name: string;
}

export default function PointsTablePage({ params }: { params: Params }) {
  const { id } = params;
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [tournamentName, setTournamentName] = useState<string>('');

  useEffect(() => {
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments = JSON.parse(tournamentsRaw);
        const tournament = tournaments.find((t: any) => t.id === id);
        if (tournament) {
          setTournamentName(tournament.name || 'Tournament');
          setMatches(tournament.matches || []);
          setTeams(tournament.teams || []);
          if (tournament.groups && Array.isArray(tournament.groups)) {
            setGroupOptions(tournament.groups.map((g: any) => g.id));
          }
        }
      } catch {}
    }
  }, [id]);

  const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.name || teamId;

  // Compute group-wise leaderboards
  const computeGroupLeaderboards = () => {
    if (!Array.isArray(matches) || !Array.isArray(teams)) return {};
    const groupIds = Array.from(new Set(matches.filter(m => m.stage === 'group' && m.groupId).map(m => m.groupId)));
    const leaderboards: Record<string, any[]> = {};
    groupIds.forEach(groupId => {
      if (!groupId) return;
      const groupMatches = matches.filter(m => m.stage === 'group' && m.groupId === groupId);
      const teamIds = Array.from(new Set(groupMatches.flatMap(m => [m.teamA, m.teamB])));
      const groupTeams = teamIds.map(tid => {
        let played = 0, won = 0, lost = 0, setsWon = 0, setsLost = 0, pointsFor = 0, pointsAgainst = 0, totalPoints = 0;
        groupMatches.forEach(m => {
          let isA = m.teamA === tid, isB = m.teamB === tid;
          if (!isA && !isB) return;
          if (m.status !== 'completed' && typeof m.matchWinner !== 'string') return;
          played++;
          if (Array.isArray(m.setScores)) {
            m.setScores.forEach((set: any) => {
              if (isA) {
                setsWon += set.winner === 'A' ? 1 : 0;
                setsLost += set.winner === 'B' ? 1 : 0;
                pointsFor += set.teamAScore;
                pointsAgainst += set.teamBScore;
              } else if (isB) {
                setsWon += set.winner === 'B' ? 1 : 0;
                setsLost += set.winner === 'A' ? 1 : 0;
                pointsFor += set.teamBScore;
                pointsAgainst += set.teamAScore;
              }
            });
          }
          if ((isA && m.matchWinner === 'A') || (isB && m.matchWinner === 'B')) {
            won++;
            totalPoints += m.winPoints || 2;
          } else if ((isA && m.matchWinner === 'B') || (isB && m.matchWinner === 'A')) {
            lost++;
          }
        });
        return {
          teamId: tid,
          teamName: getTeamName(tid),
          played,
          won,
          lost,
          setsWon,
          setsLost,
          pointsFor,
          pointsAgainst,
          totalPoints,
        };
      });
      groupTeams.sort((a, b) => b.totalPoints - a.totalPoints || b.setsWon - a.setsWon || b.pointsFor - a.pointsFor);
      leaderboards[String(groupId)] = groupTeams;
    });
    return leaderboards;
  };
  const groupLeaderboards = computeGroupLeaderboards();

  const navigation = [
    { name: 'Tournament Teams', href: `/badminton/admin/tournament/${id}/`, current: false },
    { name: 'All Tournaments', href: '/badminton/admin/tournament', current: false },
    { name: 'Matches', href: `/badminton/admin/tournament/${id}/matches`, current: false },
    { name: 'Point Tables', href: `/badminton/admin/tournament/${id}/matches/points-table`, current: true },
    { name: 'Export Schedule', href: `/badminton/admin/tournament/${id}/matches/export`, current: false }
  ];

  return (
    <div className="min-h-full print:block">
      <Navigation navigation={navigation} />
      <Header title={tournamentName} />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {groupLeaderboards && Object.keys(groupLeaderboards).length > 0 ? (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2">Group Leaderboards</h2>
              <div className="w-full flex mb-4 print:hidden gap-2 justify-end">
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
                    onClick={() => {
                      const before = document.title;
                      document.title = `${tournamentName || 'Tournament'} - Points Table`;
                      window.print();
                      setTimeout(() => { document.title = before; }, 1000);
                    }}
                    type="button"
                  >
                    <PrinterIcon aria-hidden="true" className="block size-6" />
                  </button>
                </div>
              {Object.entries(groupLeaderboards).map(([groupId, teams]) => (
                <div key={groupId} className="mb-4">
                  <h3 className="font-semibold mb-1">Group {groupId}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-max border border-gray-300 text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-1 border">Team</th>
                          <th className="px-2 py-1 border">Played</th>
                          <th className="px-2 py-1 border">Won</th>
                          <th className="px-2 py-1 border">Lost</th>
                          <th className="px-2 py-1 border">Sets Won</th>
                          <th className="px-2 py-1 border">Sets Lost</th>
                          <th className="px-2 py-1 border">Points For</th>
                          <th className="px-2 py-1 border">Points Against</th>
                          <th className="px-2 py-1 border">Total Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(teams as any[]).map(team => (
                          <tr key={team.teamId}>
                            <td className="px-2 py-1 border font-semibold">{team.teamName}</td>
                            <td className="px-2 py-1 border text-center">{team.played}</td>
                            <td className="px-2 py-1 border text-center">{team.won}</td>
                            <td className="px-2 py-1 border text-center">{team.lost}</td>
                            <td className="px-2 py-1 border text-center">{team.setsWon}</td>
                            <td className="px-2 py-1 border text-center">{team.setsLost}</td>
                            <td className="px-2 py-1 border text-center">{team.pointsFor}</td>
                            <td className="px-2 py-1 border text-center">{team.pointsAgainst}</td>
                            <td className="px-2 py-1 border text-center font-bold">{team.totalPoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No group matches found for this tournament.</div>
          )}
        </div>
      </main>
    </div>
  );
}
