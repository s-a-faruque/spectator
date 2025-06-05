'use client';

import { useEffect, useState } from 'react';

type Team = { id: string; name: string };
type Group = { id: string; name: string; teamIds: string[] };

const sampleTeams: Team[] = [
  
];

const sampleGroups: Group[] = [
  { id: 'g1', name: 'Group A', teamIds: [] },
  { id: 'g2', name: 'Group B', teamIds: [] }
];

const STORAGE_KEY = 'dropdown_groups';

function getSampleTeams(): Team[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('teams');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback to sampleTeams if parsing fails
      }
    }
  }
  return sampleTeams;
}

export default function GroupAssignmentDropdown() {
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [groups, setGroups] = useState<Group[]>(sampleGroups);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setTeams(getSampleTeams());
    if (saved) setGroups(JSON.parse(saved));
  }, []);

  const assignTeamToGroup = (teamId: string, groupId: string) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId && !group.teamIds.includes(teamId)) {
        return { ...group, teamIds: [...group.teamIds, teamId] };
      }
      return group;
    });

    setGroups(updatedGroups);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGroups));
  };

  const unassignedTeams = teams.filter(
    t => !groups.some(g => g.teamIds.includes(t.id))
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assign Teams to Groups</h2>

      <div className="grid grid-cols-2 gap-6">
        {groups.map(group => (
          <div key={group.id} className="border p-4 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">{group.name}</h3>
            <ul className="mb-4">
              {group.teamIds.map(tid => {
                const team = teams.find(t => t.id === tid);
                return <li key={tid}>{team?.name}</li>;
              })}
            </ul>
            {unassignedTeams.length > 0 ? (
              <select
                className="border px-2 py-1"
                onChange={e => assignTeamToGroup(e.target.value, group.id)}
                defaultValue=""
              >
                <option value="" disabled>Select a team</option>
                {unassignedTeams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">No teams left</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
