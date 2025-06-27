'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { generateGroupStageMatches } from '../../../utils/matchGeneration';
import Navigation from '@/app/badminton/ui-components/Navigation';
import MatchListItem from '@/app/badminton/admin/components/MatchListItem';
import Header from '@/app/badminton/ui-components/Header';
import Footer from '@/app/badminton/ui-components/Footer';
import React from 'react';

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
  tournamentId: string;
}

interface Player {
  id: string;
  name: string;
  teamId: string;
}

export default function MatchPage({ params }: { params: Params }) {
  const { id } = params;
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>([]);
  const [stage, setStage] = useState<'group' | 'knockout'>('group');
  const [groupId, setGroupId] = useState('');
  const [round, setRound] = useState('');
  const [court, setCourt] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editMatch, setEditMatch] = useState<Partial<Match> & { teamAPlayers?: string[]; teamBPlayers?: string[] }>({});
  const [numSets, setNumSets] = useState(1); // Default number of sets
  const [winPoints, setWinPoints] = useState(2); // Default points for winning
  const [setScores, setSetScores] = useState<{ setNo: number; teamAScore: number; teamBScore: number }[]>([ { setNo: 1, teamAScore: 0, teamBScore: 0 }, { setNo: 2, teamAScore: 0, teamBScore: 0 }, { setNo: 3, teamAScore: 0, teamBScore: 0 } ]);
  const [editSetScores, setEditSetScores] = useState<{ setNo: number; teamAScore: number; teamBScore: number }[]>([]);
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

          setTeams((tournament.teams || []).map((team: any) => ({
            ...team,
            tournamentId: tournament.id
          })));
          // setTeams(tournament.teams || []);
          // Flatten all players from all teams
          const allPlayers: Player[] = (tournament.teams || []).flatMap((team: any) =>
            (team.players || []).map((p: any) => ({ ...p, teamId: team.id }))
          );
          setPlayers(allPlayers);
          if (tournament.groups && Array.isArray(tournament.groups)) {
            setGroupOptions(tournament.groups.map((g: any) => g.id));
            setGroups(tournament.groups);
          }
        }
      } catch {}
    }
  }, [id]);

  // Update setScores when numSets changes
  useEffect(() => {
    setSetScores(Array.from({ length: numSets }, (_, i) => setScores[i] || { setNo: i + 1, teamAScore: 0, teamBScore: 0 }));
  }, [numSets]);

  const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.name || teamId;
  const getPlayerName = (playerId: string) => players.find(p => p.id === playerId)?.name || playerId;
  const getPlayersForTeam = (teamId: string) => players.filter((p: Player) => p.teamId === teamId);
  const getSetWinner = (set: { teamAScore: number; teamBScore: number }): 'A' | 'B' | null => {
    if (set.teamAScore > set.teamBScore) return 'A';
    if (set.teamBScore > set.teamAScore) return 'B';
    return null;
  };
  const getMatchWinner = (setScores: { teamAScore: number; teamBScore: number }[], numSets: number): 'A' | 'B' | null => {
    let aWins = 0, bWins = 0;
    setScores.forEach(set => {
      const winner = getSetWinner(set);
      if (winner === 'A') aWins++;
      if (winner === 'B') bWins++;
    });
    const needed = Math.ceil(numSets / 2);
    if (aWins >= needed) return 'A';
    if (bWins >= needed) return 'B';
    return null;
  };

  const handleSetScoreChange = (setIdx: number, team: 'A' | 'B', value: number) => {
    setSetScores(prev => prev.map((s, i) => i === setIdx ? { ...s, ...(team === 'A' ? { teamAScore: value } : { teamBScore: value }) } : s));
  };
  const handleEditSetScoreChange = (setIdx: number, team: 'A' | 'B', value: number) => {
    setEditSetScores(prev => prev.map((s, i) => i === setIdx ? { ...s, ...(team === 'A' ? { teamAScore: value } : { teamBScore: value }) } : s));
  };

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || teamA === teamB) {
      alert('Please select two different teams.');
      return;
    }
    if (teamAPlayers.length === 0 || teamBPlayers.length === 0) {
      alert('Please select players for both teams.');
      return;
    }
    // Add set winner for each set
    const setScoresWithWinners = setScores.map(set => ({ ...set, winner: getSetWinner(set) as 'A' | 'B' | null }));
    const matchWinner = getMatchWinner(setScores, numSets) as 'A' | 'B' | null;
    const newMatch: Match & { teamAPlayers: string[]; teamBPlayers: string[] } = {
      id: `match_${Date.now()}`,
      teamA,
      teamB,
      teamAPlayers,
      teamBPlayers,
      stage,
      court: court || undefined,
      dateTime: dateTime || undefined,
      status: status || undefined,
      numSets,
      winPoints,
      setScores: setScoresWithWinners,
      matchWinner,
      ...(stage === 'group' && groupId ? { groupId } : {}),
      ...(stage === 'knockout' && round ? { round } : {}),
    };
    // Save to localStorage
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex((t: any) => t.id === id);
        if (tIdx !== -1) {
          tournaments[tIdx].matches = [...(tournaments[tIdx].matches || []), newMatch];
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
        }
      } catch {}
    }
    setMatches(prev => [...prev, newMatch]);
    setTeamA('');
    setTeamB('');
    setTeamAPlayers([]);
    setTeamBPlayers([]);
    setGroupId('');
    setRound('');
    setCourt('');
    setDateTime('');
    setStatus('scheduled');
    setNumSets(3);
    setWinPoints(2);
    setSetScores(Array.from({ length: 3 }, (_, i) => ({ setNo: i + 1, teamAScore: 0, teamBScore: 0 })));
  };

  const handleEditClick = (match: any) => {
    setEditingMatchId(match.id);
    setEditMatch({ ...match });
    setEditSetScores(
      Array.from({ length: match.numSets || 3 }, (_, i) =>
        (match.setScores && match.setScores[i]) || { setNo: i + 1, teamAScore: 0, teamBScore: 0 }
      )
    );
  };
  const handleEditChange = (field: string, value: any) => {
    setEditMatch(prev => ({ ...prev, [field]: value }));
    if (field === 'teamA') setEditMatch(prev => ({ ...prev, teamAPlayers: [] }));
    if (field === 'teamB') setEditMatch(prev => ({ ...prev, teamBPlayers: [] }));
  };
  const handleEditPlayerChange = (team: 'A' | 'B', values: string[]) => {
    setEditMatch(prev => ({ ...prev, [team === 'A' ? 'teamAPlayers' : 'teamBPlayers']: values }));
  };
  const handleEditSave = () => {
    if (!editMatch.teamA || !editMatch.teamB || editMatch.teamA === editMatch.teamB) {
      alert('Please select two different teams.');
      return;
    }
    if (!editMatch.teamAPlayers?.length || !editMatch.teamBPlayers?.length) {
      alert('Please select players for both teams.');
      return;
    }
    const setScoresWithWinners = editSetScores.map(set => ({ ...set, winner: getSetWinner(set) as 'A' | 'B' | null }));
    const matchWinner = getMatchWinner(editSetScores, editMatch.numSets || 3) as 'A' | 'B' | null;
    setMatches(prev => prev.map(m => m.id === editingMatchId ? { ...m, ...editMatch, setScores: setScoresWithWinners, matchWinner } : m));
    // Update localStorage
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex((t: any) => t.id === id);
        if (tIdx !== -1) {
          tournaments[tIdx].matches = tournaments[tIdx].matches.map((m: any) => m.id === editingMatchId ? { ...m, ...editMatch, setScores: setScoresWithWinners, matchWinner } : m);
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
        }
      } catch {}
    }
    setEditingMatchId(null);
    setEditMatch({});
    setEditSetScores([]);
  };
  const handleEditCancel = () => {
    setEditingMatchId(null);
    setEditMatch({});
  };
  const handleDeleteMatch = (matchId: string) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;
    setMatches(prev => prev.filter(m => m.id !== matchId));
    // Update localStorage
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex((t: any) => t.id === id);
        if (tIdx !== -1) {
          tournaments[tIdx].matches = tournaments[tIdx].matches.filter((m: any) => m.id !== matchId);
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
        }
      } catch {}
    }
    if (editingMatchId === matchId) {
      setEditingMatchId(null);
      setEditMatch({});
    }
  };

  const handleGenerateGroupMatches = () => {
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (!tournamentsRaw) return;
    try {
      const tournaments = JSON.parse(tournamentsRaw);
      const tournament = tournaments.find((t: any) => t.id === id);
      if (!tournament || !tournament.groups || !Array.isArray(tournament.groups)) return;
      
      let newMatches: any[] = [];
      tournament.groups.forEach((group: any) => {
        console.log(`Generating group Team IDs ${group.id} with teams:`, group.teamIds);
        const groupTeams = (group.teamIds || []).map((tid: string) => tournament.teams.find((t: any) => t.id === tid)).filter(Boolean);
        console.log(`Generating matches for group ${group.id} with teams:`, groupTeams);
        if (groupTeams.length > 1) {
          const matches = generateGroupStageMatches(groupTeams, group.id);
          newMatches = newMatches.concat(matches);
        }
      });
      // Avoid duplicate matches (by teamA, teamB, groupId)
      const existing = new Set((tournament.matches || []).map((m: any) => `${m.teamA}|${m.teamB}|${m.groupId}`));
      const filtered = newMatches.filter(m => !existing.has(`${m.teamA}|${m.teamB}|${m.groupId}`));
      tournament.matches = [...(tournament.matches || []), ...filtered];
      // Save
      const tIdx = tournaments.findIndex((t: any) => t.id === id);
      tournaments[tIdx] = tournament;
      localStorage.setItem('tournaments', JSON.stringify(tournaments));
      setMatches(tournament.matches);
    } catch {}
  };

  const getGroupName = (groupId: string) => groups.find(g => g.id === groupId)?.name || groupId;

  const navigation = [
    { name: 'Tournament Teams', href: `/badminton/admin/tournament/${id}/`, current: false },
    { name: 'All Tournaments', href: '/badminton/admin/tournament', current: false },
    { name: 'Matches', href: `/badminton/admin/tournament/${id}/matches`, current: true },
    { name: 'Point Tables', href: `/badminton/admin/tournament/${id}/matches/points-table`, current: false },
    { name: 'Export Schedule', href: `/badminton/admin/tournament/${id}/matches/export`, current: false }
  ];

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-full flex flex-col">
      <Navigation navigation={navigation} />
      <Header title="Tournament Matches" />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex w-full gap-2 mb-4">
            <button
              className="flex-1 bg-purple-600 text-white px-3 py-1 text-sm rounded"
              onClick={handleGenerateGroupMatches}
              type="button"
            >
              Generate Matches
            </button>
            
            <Link
              href={`/badminton/admin/tournament/${id}/matches/export`}
              className="flex-1 bg-gray-100 text-white px-3 py-1 rounded text-center text-sm"
            >
              Export Schedule
            </Link>
          </div>
          {/* Toggle Add Match Form */}
          <div className="mb-4">
            <button
              className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition"
              type="button"
              onClick={() => setShowAddForm((prev: boolean) => !prev)}
            >
              {showAddForm ? 'Hide Add Match Form' : '+ Add Match'}
            </button>
          </div>
          {showAddForm && (
          <form className="mb-6 p-4 border rounded bg-white" onSubmit={handleAddMatch}>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium">Team A</label>
                <select className="border rounded px-2 py-1" value={teamA} onChange={e => { setTeamA(e.target.value); setTeamAPlayers([]); }} required>
                  <option value="">Select Team</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {teamA && (
                  <div className="mt-1">
                    <label className="block text-xs">Players (select 2)</label>
                    <select
                      className="border rounded px-2 py-1 w-full"
                      multiple
                      value={teamAPlayers}
                      onChange={e => {
                        const selected = Array.from(e.target.selectedOptions, opt => opt.value).slice(0, 2);
                        setTeamAPlayers(selected);
                      }}
                      size={2}
                      required
                    >
                      {getPlayersForTeam(teamA).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Team B</label>
                <select className="border rounded px-2 py-1" value={teamB} onChange={e => { setTeamB(e.target.value); setTeamBPlayers([]); }} required>
                  <option value="">Select Team</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {teamB && (
                  <div className="mt-1">
                    <label className="block text-xs">Players (select 2)</label>
                    <select
                      className="border rounded px-2 py-1 w-full"
                      multiple
                      value={teamBPlayers}
                      onChange={e => {
                        const selected = Array.from(e.target.selectedOptions, opt => opt.value).slice(0, 2);
                        setTeamBPlayers(selected);
                      }}
                      size={2}
                      required
                    >
                      {getPlayersForTeam(teamB).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Stage</label>
                <select className="border rounded px-2 py-1" value={stage} onChange={e => setStage(e.target.value as 'group' | 'knockout')}>
                  <option value="group">Group</option>
                  <option value="knockout">Knockout</option>
                </select>
              </div>
              {stage === 'group' && groupOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium">Group</label>
                  <select className="border rounded px-2 py-1" value={groupId} onChange={e => setGroupId(e.target.value)} required>
                    <option value="">Select Group</option>
                    {groupOptions.map(gid => (
                      <option key={gid} value={gid}>{getGroupName(gid)}</option>
                    ))}
                  </select>
                </div>
              )}
              {stage === 'knockout' && (
                <div>
                  <label className="block text-sm font-medium">Round</label>
                  <input className="border rounded px-2 py-1" value={round} onChange={e => setRound(e.target.value)} placeholder="e.g. quarterfinal" required />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium">Court</label>
                <input
                  className="border rounded px-2 py-1"
                  type="text"
                  value={court}
                  onChange={e => setCourt(e.target.value)}
                  placeholder="Court name/number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date & Time</label>
                <input
                  className="border rounded px-2 py-1"
                  type="datetime-local"
                  value={dateTime}
                  onChange={e => setDateTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  className="border rounded px-2 py-1"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Number of Sets</label>
                <input
                  className="border rounded px-2 py-1 w-20"
                  type="number"
                  min={1}
                  max={5}
                  value={numSets}
                  onChange={e => setNumSets(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Points for Win</label>
                <input
                  className="border rounded px-2 py-1 w-20"
                  type="number"
                  min={1}
                  value={winPoints}
                  onChange={e => setWinPoints(Number(e.target.value))}
                  required
                />
              </div>
              <button type="submit" className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition">Add Match</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <div>
                <label className="block"><hr /></label>
                <label className="block text-sm font-medium mb-1">Set Scores</label>
                {setScores.map((set, idx) => (
                  <div key={set.setNo} className="flex items-center gap-2 mb-1">
                    <span className="text-xs">Set {set.setNo}:</span>
                    <input
                      type="number"
                      className="border rounded px-1 py-0.5 w-14"
                      min={0}
                      value={set.teamAScore}
                      onChange={e => handleSetScoreChange(idx, 'A', Number(e.target.value))}
                      placeholder="A score"
                    />
                    <span className="text-xs">-</span>
                    <input
                      type="number"
                      className="border rounded px-1 py-0.5 w-14"
                      min={0}
                      value={set.teamBScore}
                      onChange={e => handleSetScoreChange(idx, 'B', Number(e.target.value))}
                      placeholder="B score"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
          )}
          {matches.length === 0 ? (
            <div className="text-gray-500">No matches found for this tournament.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {matches.map((m: any) => (
                <MatchListItem
                  key={m.id}
                  m={m}
                  editingMatchId={editingMatchId}
                  editMatch={editMatch}
                  editSetScores={editSetScores}
                  teams={teams}
                  players={players}
                  groupOptions={groupOptions}
                  groups={groups}
                  getTeamName={getTeamName}
                  getPlayerName={getPlayerName}
                  getPlayersForTeam={getPlayersForTeam}
                  handleEditClick={handleEditClick}
                  handleDeleteMatch={handleDeleteMatch}
                  handleEditChange={handleEditChange}
                  handleEditPlayerChange={handleEditPlayerChange}
                  handleEditSetScoreChange={handleEditSetScoreChange}
                  handleEditSave={handleEditSave}
                  handleEditCancel={handleEditCancel}
                  getGroupName={getGroupName}
                />
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}