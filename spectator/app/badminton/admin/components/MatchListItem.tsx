'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/outline'

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

// MatchListItem component for rendering a single match

const MatchListItem: React.FC<{
  m: any;
  editingMatchId: string | null;
  editMatch: any;
  editSetScores: any[];
  teams: Team[];
  players: Player[];
  groupOptions: string[];
  groups: any[];
  getTeamName: (id: string) => string;
  getPlayerName: (id: string) => string;
  getPlayersForTeam: (id: string) => Player[];
  handleEditClick: (m: any) => void;
  handleDeleteMatch: (id: string) => void;
  handleEditChange: (field: string, value: any) => void;
  handleEditPlayerChange: (team: 'A' | 'B', values: string[]) => void;
  handleEditSetScoreChange: (setIdx: number, team: 'A' | 'B', value: number) => void;
  handleEditSave: () => void;
  handleEditCancel: () => void;
  getGroupName: (id: string) => string;
}> = ({
  m, editingMatchId, editMatch, editSetScores, teams, players, groupOptions, groups,
  getTeamName, getPlayerName, getPlayersForTeam, handleEditClick, handleDeleteMatch,
  handleEditChange, handleEditPlayerChange, handleEditSetScoreChange, handleEditSave, handleEditCancel, getGroupName
}) => {
  const [open, setOpen] = useState(false);
  const [setScores, setSetScores] = useState<{ setNo: number; teamAScore: number; teamBScore: number }[]>(
    m.setScores || Array.from({ length: m.numSets || 3 }, (_, i) => ({ setNo: i + 1, teamAScore: 0, teamBScore: 0 }))
  );

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
    const needed = Math.ceil((m.numSets || 3) / 2);
    if (aWins >= needed) return 'A';
    if (bWins >= needed) return 'B';
    return null;
  };

  const handleSetScoreChange = (setIdx: number, team: 'A' | 'B', value: number) => {
    setSetScores(prev =>
      prev.map((s, i) =>
        i === setIdx ? { ...s, ...(team === 'A' ? { teamAScore: value } : { teamBScore: value }) } : s
      )
    );
  };

  const handleSaveScores = () => {
    const setScoresWithWinners = setScores.map(set => ({ ...set, winner: getSetWinner(set) as 'A' | 'B' | null }));
    const matchWinner = getMatchWinner(setScores, m.numSets || 3) as 'A' | 'B' | null;
    // Save to localStorage for the correct match id
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments = JSON.parse(tournamentsRaw);
        // Find the tournament containing this match
        const tIdx = tournaments.findIndex((t: any) => Array.isArray(t.matches) && t.matches.some((match: any) => match.id === m.id));
        if (tIdx !== -1) {
          tournaments[tIdx].matches = tournaments[tIdx].matches.map((match: any) =>
            match.id === m.id ? { ...match, setScores: setScoresWithWinners, matchWinner } : match
          );
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
        }
      } catch {}
    }
    setOpen(false);
    window.location.reload(); // Optionally, trigger a refresh or callback
  };

  return (
    <li key={m.id}>
      {editingMatchId === m.id ? (
        <div className="p-2 border rounded bg-gray-50 mb-2">
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-xs">Team A</label>
              <select className="border rounded px-2 py-1" value={editMatch.teamA || ''} onChange={e => handleEditChange('teamA', e.target.value)} required>
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {editMatch.teamA && (
                <div className="mt-1">
                  <label className="block text-xs">Players (select 2)</label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    multiple
                    value={editMatch.teamAPlayers || []}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value).slice(0, 2);
                      handleEditPlayerChange('A', selected);
                    }}
                    size={2}
                    required
                  >
                    {getPlayersForTeam(editMatch.teamA).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs">Team B</label>
              <select className="border rounded px-2 py-1" value={editMatch.teamB || ''} onChange={e => handleEditChange('teamB', e.target.value)} required>
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {editMatch.teamB && (
                <div className="mt-1">
                  <label className="block text-xs">Players (select 2)</label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    multiple
                    value={editMatch.teamBPlayers || []}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value).slice(0, 2);
                      handleEditPlayerChange('B', selected);
                    }}
                    size={2}
                    required
                  >
                    {getPlayersForTeam(editMatch.teamB).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs">Stage</label>
              <select className="border rounded px-2 py-1" value={editMatch.stage || 'group'} onChange={e => handleEditChange('stage', e.target.value)}>
                <option value="group">Group</option>
                <option value="knockout">Knockout</option>
              </select>
            </div>
            {editMatch.stage === 'group' && groupOptions.length > 0 && (
              <div>
                <label className="block text-xs">Group</label>
                <select className="border rounded px-2 py-1" value={editMatch.groupId || ''} onChange={e => handleEditChange('groupId', e.target.value)} required>
                  <option value="">Select Group</option>
                  {groupOptions.map(gid => (
                    <option key={gid} value={gid}>{gid}</option>
                  ))}
                </select>
              </div>
            )}
            {editMatch.stage === 'knockout' && (
              <div>
                <label className="block text-xs">Round</label>
                <input className="border rounded px-2 py-1" value={editMatch.round || ''} onChange={e => handleEditChange('round', e.target.value)} placeholder="e.g. quarterfinal" required />
              </div>
            )}
            <div>
              <label className="block text-xs">Court</label>
              <input className="border rounded px-2 py-1" value={editMatch.court || ''} onChange={e => handleEditChange('court', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs">Date & Time</label>
              <input className="border rounded px-2 py-1" type="datetime-local" value={editMatch.dateTime || ''} onChange={e => handleEditChange('dateTime', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs">Status</label>
              <select className="border rounded px-2 py-1" value={editMatch.status || 'scheduled'} onChange={e => handleEditChange('status', e.target.value)}>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs">Number of Sets</label>
              <input
                className="border rounded px-2 py-1 w-20"
                type="number"
                min={1}
                max={5}
                value={editMatch.numSets || 3}
                onChange={e => handleEditChange('numSets', Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-xs">Points for Win</label>
              <input
                className="border rounded px-2 py-1 w-20"
                type="number"
                min={1}
                value={editMatch.winPoints || 2}
                onChange={e => handleEditChange('winPoints', Number(e.target.value))}
                required
              />
            </div>
            <div className="mt-2">
              <label className="block text-xs mb-1">Set Scores</label>
              {editSetScores.map((set, idx) => (
                <div key={set.setNo} className="flex items-center gap-2 mb-1">
                  <span className="text-xs">Set {set.setNo}:</span>
                  <input
                    type="number"
                    className="border rounded px-1 py-0.5 w-14"
                    min={0}
                    value={set.teamAScore}
                    onChange={e => handleEditSetScoreChange(idx, 'A', Number(e.target.value))}
                    placeholder="A score"
                  />
                  <span className="text-xs">-</span>
                  <input
                    type="number"
                    className="border rounded px-1 py-0.5 w-14"
                    min={0}
                    value={set.teamBScore}
                    onChange={e => handleEditSetScoreChange(idx, 'B', Number(e.target.value))}
                    placeholder="B score"
                  />
                </div>
              ))}
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded mr-2" onClick={handleEditSave} type="button">Save</button>
            <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={handleEditCancel} type="button">Cancel</button>
          </div>
        </div>
      ) : (
        <div className='flex justify-between gap-x-6 py-5'>
          <div className="flex min-w-0 gap-x-4">
            {/* <img className="size-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" /> */}
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">{getTeamName(m.teamA)} vs {getTeamName(m.teamB)}</p>
              <p className="mt-1 text-xs/5 text-gray-500">
                {Array.isArray(m.teamAPlayers) && (
                  <p>
                    <span className="text-xs text-gray-700">
                      [{m.teamAPlayers.map((pid: string) => getPlayerName(pid)).join(', ')}]
                      {' '}<strong>vs</strong>{' '}
                      [{m.teamBPlayers.map((pid: string) => getPlayerName(pid)).join(', ')}]
                    </span>
                  </p>
                )}
              </p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">{m.dateTime && (<time dateTime={m.dateTime}>{new Date(m.dateTime).toLocaleString()}</time>)}</p>
              <p className="mt-1 text-xs/5 text-gray-500">
                {typeof m.numSets === 'number' && (
                  <span className="text-xs">[{m.numSets} sets]</span>
                )}
                {typeof m.winPoints === 'number' && (
                  <span className="ml-2 text-xs">[Win: {m.winPoints} pts]</span>
                )}
              </p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {m.status && (
                    <span className="text-xs text-pink-700">[{m.status}]</span>
                  )}
                  {m.groupId && (
                    <span className="ml-2 text-sm/6 text-gray-900">[{getGroupName(m.groupId)}]</span>
                  )}
                  {m.round && (
                    <span className="ml-2 text-xs text-sm/6 text-gray-900">[{m.round}]</span>
                  )}
                  <span className="ml-2 text-xs text-sm/6 text-gray-900">[{m.stage} Stage]</span>
              </p>
              <p className="mt-1 text-xs/5 text-gray-500">
                {Array.isArray(m.setScores) && m.setScores.length > 0 && (
                  <span className="text-xs text-gray-700">
                    Score: 
                    {m.setScores.map((set: any) => (
                      <span key={set.setNo} className={set.winner ? (set.winner === 'A' ? 'text-green-700' : 'text-blue-700') : ''}>
                        [{set.teamAScore}:{set.teamBScore}]
                      </span>
                    ))}
                  </span>
                )}
              </p>
              
              <p className="mt-1 text-xs/5 text-gray-500">
                {m.matchWinner && (
                  <span className={m.matchWinner === 'A' ? 'text-green-800 font-semibold' : 'text-blue-800 font-semibold'}>
                    Match Winner: {m.matchWinner === 'A' ? getTeamName(m.teamA) : getTeamName(m.teamB)}
                  </span>
                )}
              </p>
              <p className="text-sm/6 text-gray-900">{m.court && (<>Court: {m.court}</>)}</p>
              <p className="text-sm/6 text-gray-900">        
                <button className="text-xs text-blue-600 underline" onClick={() => handleEditClick(m)} type="button">Edit</button>
                <button className="ml-2 text-xs text-red-600 underline" onClick={() => handleDeleteMatch(m.id)} type="button">Delete</button>
                <button
                  onClick={() => setOpen(true)}
                  className="ml-2 text-xs rounded-md bg-gray-950/5 px-1.5 py-1.5 text-sm text-gray-900 hover:bg-gray-950/10"
                >
                  Set Score
                </button>
              </p>
            </div>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
              />
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                    <DialogPanel
                      transition
                      className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                    >
                      <TransitionChild>
                        <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative rounded-md text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                          </button>
                        </div>
                      </TransitionChild>
                      <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <DialogTitle className="text-base font-semibold text-gray-900">Set Score</DialogTitle>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <form onSubmit={e => { e.preventDefault(); handleSaveScores(); }}>
                            <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white">
                              <table className="w-full text-left table-auto min-w-max">
                                <thead>
                                  <tr>
                                    <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'><p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Set</p></th>
                                    <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'><p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">{getTeamName(m.teamA)} </p></th>
                                    <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'><p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">{getTeamName(m.teamB)} </p></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {setScores.map((set, idx) => (
                                    <tr key={set.setNo} className="">
                                      <td className='p-4 border-b border-gray-200/60'>
                                        <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                          Set {set.setNo}:
                                        </p>
                                      </td>
                                      <td className="p-4 border-b border-gray-200/60">
                                        <input
                                          type="number"
                                          className="border border-gray-300/60 rounded px-1 py-0.5 w-14"
                                          min={0}
                                          value={set.teamAScore}
                                          onChange={e => handleSetScoreChange(idx, 'A', Number(e.target.value))}
                                          placeholder="A score"
                                        />
                                      </td>
                                      <td className='p-4 border-b border-gray-200/60'>
                                        <input
                                          type="number"
                                          className="border border-gray-300/60 rounded px-1 py-0.5 w-14"
                                          min={0}
                                          value={set.teamBScore}
                                          onChange={e => handleSetScoreChange(idx, 'B', Number(e.target.value))}
                                          placeholder="B score"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td colSpan={3} className="p-4 text-right">
                                      <button type="submit" className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition">Save Scores</button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </form>
                        </div>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      )}
    </li>
  );
};

export default MatchListItem;