'use client';

import styles from '../../../../scorer/badminton.module.css';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';

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
}

interface Team {
  id: string;
  name: string;
}

export default function MatchPage({ params }: { params: Params }) {
  const { id } = params;
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [stage, setStage] = useState<'group' | 'knockout'>('group');
  const [groupId, setGroupId] = useState('');
  const [round, setRound] = useState('');
  const [groupOptions, setGroupOptions] = useState<string[]>([]);

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
          // Get group options for group stage
          if (tournament.groups && Array.isArray(tournament.groups)) {
            setGroupOptions(tournament.groups.map((g: any) => g.id));
          }
        }
      } catch {}
    }
  }, [id]);

  const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.name || teamId;

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || teamA === teamB) {
      alert('Please select two different teams.');
      return;
    }
    const newMatch: Match = {
      id: `match_${Date.now()}`,
      teamA,
      teamB,
      stage,
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
    setGroupId('');
    setRound('');
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>
          <Link className={styles.home} href="/badminton/admin/tournament">
              <Image
                src="/homepage.png"
                alt="Home Icon"
                width={16}
                height={16}
              />
          </Link>
          Admin Manage Matches
        </h1>
      </header>
      <div className={styles.primaryContent}>
        <div className={styles.matchesList}>
          <form className="mb-6 p-4 border rounded bg-white" onSubmit={handleAddMatch}>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium">Team A</label>
                <select className="border rounded px-2 py-1" value={teamA} onChange={e => setTeamA(e.target.value)} required>
                  <option value="">Select Team</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Team B</label>
                <select className="border rounded px-2 py-1" value={teamB} onChange={e => setTeamB(e.target.value)} required>
                  <option value="">Select Team</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
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
                      <option key={gid} value={gid}>{gid}</option>
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
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Add Match</button>
            </div>
          </form>
          {matches.length === 0 ? (
            <div className="text-gray-500">No matches found for this tournament.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {matches.map(match => (
                <li key={match.id} className="py-2">
                  <span className="font-semibold">{getTeamName(match.teamA)}</span>
                  <span className="mx-2 text-gray-500">vs</span>
                  <span className="font-semibold">{getTeamName(match.teamB)}</span>
                  {match.groupId && (
                    <span className="ml-2 text-xs text-purple-700">[Group: {match.groupId}]</span>
                  )}
                  {match.round && (
                    <span className="ml-2 text-xs text-orange-700">[{match.round}]</span>
                  )}
                  <span className="ml-2 text-xs text-blue-700">[{match.stage}]</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
