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

export default function TeamList({ tournamentId, onTournamentDeleted }: { tournamentId: string, onTournamentDeleted?: () => void }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournament, setTournament] = useState<Tournament>();
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState<string>("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editedTeamName, setEditedTeamName] = useState<string>("");
  const [addingPlayerTeamId, setAddingPlayerTeamId] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [editingPlayer, setEditingPlayer] = useState<{ teamId: string; playerId: string } | null>(null);
  const [editedPlayerName, setEditedPlayerName] = useState<string>("");
  const [groupInput, setGroupInput] = useState(2);
  const [addingTeam, setAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

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

  const handleTeamNameClick = (teamId: string, currentName: string) => {
    setEditingTeamId(teamId);
    setEditedTeamName(currentName);
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTeamName(e.target.value);
  };

  const handleTeamNameBlur = (teamId: string) => {
    if (!tournament) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex(t => t.id === tournament.id);
        if (tIdx !== -1) {
          const teamIdx = tournaments[tIdx].teams.findIndex(team => team.id === teamId);
          if (teamIdx !== -1) {
            tournaments[tIdx].teams[teamIdx].name = editedTeamName;
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
            // Update local state
            setTeams(prev => prev.map(team => team.id === teamId ? { ...team, name: editedTeamName } : team));
            setTournament({ ...tournament, teams: tournament.teams.map(team => team.id === teamId ? { ...team, name: editedTeamName } : team) });
          }
        }
      } catch {}
    }
    setEditingTeamId(null);
    setEditedTeamName("");
  };

  const handleAddPlayerClick = (teamId: string) => {
    setAddingPlayerTeamId(teamId);
    setNewPlayerName("");
  };

  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(e.target.value);
  };

  const handleAddPlayer = (teamId: string) => {
    if (!tournament || !newPlayerName.trim()) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex(t => t.id === tournament.id);
        if (tIdx !== -1) {
          const teamIdx = tournaments[tIdx].teams.findIndex(team => team.id === teamId);
          if (teamIdx !== -1) {
            const newPlayer = {
              id: `${teamId}_p${tournaments[tIdx].teams[teamIdx].players.length + 1}_${Date.now()}`,
              name: newPlayerName.trim(),
            };
            tournaments[tIdx].teams[teamIdx].players.push(newPlayer);
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
            // Update local state
            setTeams(prev => prev.map(team =>
              team.id === teamId ? { ...team, players: [...team.players, newPlayer] } : team
            ));
            setTournament({
              ...tournament,
              teams: tournament.teams.map(team =>
                team.id === teamId ? { ...team, players: [...team.players, newPlayer] } : team
              ),
            });
          }
        }
      } catch {}
    }
    setAddingPlayerTeamId(null);
    setNewPlayerName("");
  };

  const handleDeletePlayer = (teamId: string, playerId: string) => {
    if (!tournament) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex(t => t.id === tournament.id);
        if (tIdx !== -1) {
          const teamIdx = tournaments[tIdx].teams.findIndex(team => team.id === teamId);
          if (teamIdx !== -1) {
            tournaments[tIdx].teams[teamIdx].players = tournaments[tIdx].teams[teamIdx].players.filter(p => p.id !== playerId);
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
            // Update local state
            setTeams(prev => prev.map(team =>
              team.id === teamId ? { ...team, players: team.players.filter(p => p.id !== playerId) } : team
            ));
            setTournament({
              ...tournament,
              teams: tournament.teams.map(team =>
                team.id === teamId ? { ...team, players: team.players.filter(p => p.id !== playerId) } : team
              ),
            });
          }
        }
      } catch {}
    }
  };

  const handleEditPlayerClick = (teamId: string, playerId: string, currentName: string) => {
    setEditingPlayer({ teamId, playerId });
    setEditedPlayerName(currentName);
  };

  const handleEditPlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPlayerName(e.target.value);
  };

  const handleEditPlayerBlur = (teamId: string, playerId: string) => {
    if (!tournament || !editedPlayerName.trim()) {
      setEditingPlayer(null);
      setEditedPlayerName("");
      return;
    }
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex(t => t.id === tournament.id);
        if (tIdx !== -1) {
          const teamIdx = tournaments[tIdx].teams.findIndex(team => team.id === teamId);
          if (teamIdx !== -1) {
            const playerIdx = tournaments[tIdx].teams[teamIdx].players.findIndex(p => p.id === playerId);
            if (playerIdx !== -1) {
              tournaments[tIdx].teams[teamIdx].players[playerIdx].name = editedPlayerName.trim();
              localStorage.setItem('tournaments', JSON.stringify(tournaments));
              // Update local state
              setTeams(prev => prev.map(team =>
                team.id === teamId ? {
                  ...team,
                  players: team.players.map(p =>
                    p.id === playerId ? { ...p, name: editedPlayerName.trim() } : p
                  )
                } : team
              ));
              setTournament({
                ...tournament,
                teams: tournament.teams.map(team =>
                  team.id === teamId ? {
                    ...team,
                    players: team.players.map(p =>
                      p.id === playerId ? { ...p, name: editedPlayerName.trim() } : p
                    )
                  } : team
                ),
              });
            }
          }
        }
      } catch {}
    }
    setEditingPlayer(null);
    setEditedPlayerName("");
  };

  // Assign teams to groups evenly
  const assignTeamsToGroups = (numGroups: number) => {
    if (!tournament || numGroups < 1 || teams.length === 0) return;
    // Create group objects
    const groups = Array.from({ length: numGroups }, (_, i) => ({
      id: `group_${i + 1}`,
      name: `Group ${String.fromCharCode(65 + i)}`,
      teamIds: [] as string[],
    }));
    // Distribute teams round-robin
    teams.forEach((team, idx) => {
      groups[idx % numGroups].teamIds.push(team.id);
    });
    // Save to localStorage
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex(t => t.id === tournament.id);
        if (tIdx !== -1) {
          tournaments[tIdx].groups = groups;
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
          setTournament({ ...tournament, groups });
        }
      } catch {}
    }
  };

  // Move team to a different group
  const handleMoveTeam = (teamId: string, newGroupId: string) => {
    if (!tournament || !tournament.groups) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex(t => t.id === tournament.id);
        if (tIdx !== -1) {
          // Remove team from all groups
          tournaments[tIdx].groups = tournaments[tIdx].groups.map((g: any) => ({
            ...g,
            teamIds: g.teamIds.filter((tid: string) => tid !== teamId)
          }));
          // Add team to new group
          const gIdx = tournaments[tIdx].groups.findIndex((g: any) => g.id === newGroupId);
          if (gIdx !== -1) {
            tournaments[tIdx].groups[gIdx].teamIds.push(teamId);
          }
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
          setTournament({ ...tournament, groups: tournaments[tIdx].groups });
        }
      } catch {}
    }
  };

  // UI for assigning teams to groups
  const handleAssignGroups = () => {
    let n = Math.max(2, Math.floor(groupInput));
    if (n % 2 !== 0) n += 1; // Ensure even
    assignTeamsToGroups(n);
  };

  // Delete tournament
  const handleDeleteTournament = () => {
    if (!tournament) return;
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const updated = tournaments.filter(t => t.id !== tournament.id);
        localStorage.setItem('tournaments', JSON.stringify(updated));
        setTournament(undefined);
        setTeams([]);
        if (onTournamentDeleted) onTournamentDeleted();
      } catch {}
    }
  };

  // New state for adding a team
  // (removed duplicate declaration of addingTeam and newTeamName)

  // Handler to add a new team
  const handleAddTeam = () => {
    if (!tournament || !newTeamName.trim()) return;
    const tournamentsRaw = localStorage.getItem('tournaments');
    if (tournamentsRaw) {
      try {
        const tournaments: Tournament[] = JSON.parse(tournamentsRaw);
        const tIdx = tournaments.findIndex(t => t.id === tournament.id);
        if (tIdx !== -1) {
          const newTeam = {
            id: `team_${Date.now()}`,
            name: newTeamName.trim(),
            players: [],
          };
          tournaments[tIdx].teams.push(newTeam);
          localStorage.setItem('tournaments', JSON.stringify(tournaments));
          setTeams(prev => [...prev, newTeam]);
          setTournament({
            ...tournament,
            teams: [...tournament.teams, newTeam],
          });
        }
      } catch {}
    }
    setAddingTeam(false);
    setNewTeamName('');
  };

  return (
    <div className="w-full">
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
                {editingTeamId === team.id ? (
                  <input
                    className="text-sm/6 font-semibold text-gray-900 border rounded px-2 py-1 w-full"
                    value={editedTeamName}
                    onChange={handleTeamNameChange}
                    onBlur={() => handleTeamNameBlur(team.id)}
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleTeamNameClick(team.id, team.name)}
                    title="Click to edit"
                  >
                    {team.name}
                  </p>
                )}
                {/* Add Player UI */}
                {addingPlayerTeamId === team.id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      type="text"
                      value={newPlayerName}
                      onChange={handlePlayerNameChange}
                      placeholder="Player name"
                      autoFocus
                    />
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleAddPlayer(team.id)}
                    >
                      Add
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                      onClick={() => setAddingPlayerTeamId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2"
                    onClick={() => handleAddPlayerClick(team.id)}
                  >
                    + Add Player
                  </button>
                )}
              </div>
              <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                <ul className="mt-1 truncate text-xs/5 text-gray-500">
                    {team.players.map(player => (
                        <li key={player.id} className="flex items-center gap-2">
                          {editingPlayer && editingPlayer.teamId === team.id && editingPlayer.playerId === player.id ? (
                            <input
                              className="border rounded px-1 py-0.5 text-xs"
                              value={editedPlayerName}
                              onChange={handleEditPlayerNameChange}
                              onBlur={() => handleEditPlayerBlur(team.id, player.id)}
                              autoFocus
                            />
                          ) : (
                            <>
                              {player.name}
                              <button
                                className="ml-1 text-blue-500 hover:text-blue-700 text-xs px-1 py-0.5 border border-blue-200 rounded"
                                onClick={() => handleEditPlayerClick(team.id, player.id, player.name)}
                                title="Edit player"
                              >
                                Edit
                              </button>
                            </>
                          )}
                          <button
                            className="ml-1 text-red-500 hover:text-red-700 text-xs px-1 py-0.5 border border-red-200 rounded"
                            onClick={() => handleDeletePlayer(team.id, player.id)}
                            title="Delete player"
                          >
                            Delete
                          </button>
                        </li>
                    ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Group assignment UI */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold">Number of Groups (even):</label>
        <input
          type="number"
          min={2}
          step={2}
          value={groupInput === 0 ? '' : groupInput}
          onChange={e => {
            const val = e.target.value.replace(/^0+/, ''); // Remove leading zeros
            setGroupInput(val === '' ? 0 : Math.max(2, Number(val)));
          }}
          className="border rounded px-2 py-1 w-20"
        />
        <button
          className="bg-purple-600 text-white px-3 py-1 rounded"
          onClick={handleAssignGroups}
        >
          Assign Teams to Groups
        </button>
      </div>
      {tournament?.groups && tournament.groups.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold">Groups</h4>
          <div className="grid grid-cols-2 gap-4">
            {tournament.groups.map(group => (
              <div key={group.id} className="border rounded p-2">
                <div className="font-bold mb-1">{group.name}</div>
                <ul className="text-xs text-gray-700">
                  {group.teamIds.map((tid: string) => {
                    const t = teams.find(tm => tm.id === tid);
                    return t ? (
                      <li key={tid} className="flex items-center gap-2">
                        {t.name}
                        <select
                          className="ml-2 border rounded px-1 py-0.5 text-xs"
                          value={group.id}
                          onChange={e => handleMoveTeam(tid, e.target.value)}
                        >
                          {tournament.groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {tournament && (
        <button
          className="bg-red-600 text-white px-3 py-1 rounded mb-4"
          onClick={handleDeleteTournament}
        >
          Delete Tournament
        </button>
      )}
      {/* Add Team Button and Form */}
      <div className="mb-4">
        {addingTeam ? (
          <div className="flex gap-2 items-center">
            <input
              className="border rounded px-2 py-1 text-sm"
              type="text"
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
              placeholder="Team name"
              autoFocus
            />
            <button
              className="bg-green-600 text-white px-2 py-1 rounded text-sm"
              onClick={handleAddTeam}
            >
              Add
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
              onClick={() => { setAddingTeam(false); setNewTeamName(''); }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => setAddingTeam(true)}
          >
            + Create New Team
          </button>
        )}
      </div>
    </div>
  );
}