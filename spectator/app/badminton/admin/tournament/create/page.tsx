'use client'

import { useState } from 'react'
import Header from '../../../ui-components/Header';
import Navigation from '../../../ui-components/Navigation'
import Footer from '../../../ui-components/Footer'
import TeamList from '../../components/TeamList'
import { generateGroupStageMatches } from '../../utils/matchGeneration';

export default function CreateTournamentPage() {
  const [numTeams, setNumTeams] = useState(4);
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [tournamentCreated, setTournamentCreated] = useState(false);

  type Group = { id: string; name: string; teamIds: string[] };
  const handleGenerateGroupMatches = (groups: Group[], teams: any) => {
      let newMatches: any[] = [];
      groups.forEach((group: Group) => {
        console.log(`Generating group Team IDs ${group.id} with teams:`, group.teamIds);
        const groupTeams = (group.teamIds || []).map((tid: string) => teams.find((t: any) => t.id === tid)).filter(Boolean);
        console.log(`Generating matches for group ${group.id} with teams:`, groupTeams);
        if (groupTeams.length > 1) {
          const matches = generateGroupStageMatches(groupTeams, group.id);
          newMatches = newMatches.concat(matches);
        }
      });
      // Avoid duplicate matches (by teamA, teamB, groupId)
      const existing = new Set((teams.matches || []).map((m: any) => `${m.teamA}|${m.teamB}|${m.groupId}`));
      const filtered = newMatches.filter(m => !existing.has(`${m.teamA}|${m.teamB}|${m.groupId}`));
      teams.matches = [...(teams.matches || []), ...filtered];
      return teams.matches;
  };

  const handleCreate = () => {
    // Always generate a new tournamentId on create
    const newTournamentId = `tournament_${Math.random().toString(36).substring(2, 8)}`;
    const teams = Array.from({ length: numTeams }, (_, i) => {
      const teamId = `team_${i + 1}`
      return {
        id: teamId,
        name: `Team ${i + 1}`,
        players: [
          { id: `${teamId}_p1`, name: `Player ${i + 1}-1` },
          { id: `${teamId}_p2`, name: `Player ${i + 1}-2` }
        ]
      }
    })

    const tournament = {
      id: newTournamentId,
      name: `Tournament ${new Date().toISOString().slice(0, 10)}`,
      location: 'Unknown',
      startDate: '',
      endDate: '',
      teams,
      groups: [],
      stages: [],
      matches: []
    }

    const existing = JSON.parse(localStorage.getItem('tournaments') || '[]')
    localStorage.setItem('tournaments', JSON.stringify([...existing, tournament]))
    setTournamentId(newTournamentId)
    setTournamentCreated(true)
  }

  const handleCreateWithRRMatches = () => {
    // Always generate a new tournamentId on create
    const newTournamentId = `tournament_${Math.random().toString(36).substring(2, 8)}`;
    const teams = Array.from({ length: numTeams }, (_, i) => {
      const teamId = `team_${i + 1}`
      return {
        id: teamId,
        name: `Team ${i + 1}`,
        players: [
          { id: `${teamId}_p1`, name: `Player ${i + 1}-1` },
          { id: `${teamId}_p2`, name: `Player ${i + 1}-2` }
        ]
      }
    })

    // Create default groups (2 groups)
    const teamToGroupNumbers: Record<string, number> = {
      "3": 1,
      "4": 1,
      "5": 1,
      "6": 2,
      "7": 2,
      "8": 2,
      "9": 3,
      "10": 2,
      "11": 3,
      "12": 4,
      "13": 4,
      "14": 4,
      "15": 3,
      "16": 4,
      "17": 5,
      "18": 6,
      "19": 5,
      "20": 4,
      "21": 7,
      "22": 6,
      "23": 5,
      "24": 6,
      "25": 5,
      "26": 6,
      "27": 9,
      "28": 7,
      "29": 5,
      "30": 6,
      "32": 8,
      "36": 6,
      "40": 8
    }


    // Determine number of groups based on numTeams using teamToGroupNumbers
    let numGroups = 2; // default
    if (String(numTeams) in teamToGroupNumbers) {
      numGroups = teamToGroupNumbers[String(numTeams)];
    } else if (numTeams > 40) {
      numGroups = Math.ceil(numTeams / 8); // More than 40 teams, create more groups
    }

    
    const groups = Array.from({ length: numGroups }, (_, i) => ({
      id: `group_${i + 1}`,
      name: `Group ${String.fromCharCode(65 + i)}`,
      teamIds: [] as string[],
    }));
    teams.forEach((team, idx) => {
      groups[idx % numGroups].teamIds.push(team.id);
    });    

    const matches = handleGenerateGroupMatches(groups, teams);

    const tournament = {
      id: newTournamentId,
      name: `Tournament ${new Date().toISOString().slice(0, 10)}`,
      location: 'Unknown',
      startDate: '',
      endDate: '',
      teams,
      groups,
      stages: [],
      matches
    }

    const existing = JSON.parse(localStorage.getItem('tournaments') || '[]')
    localStorage.setItem('tournaments', JSON.stringify([...existing, tournament]))
    setTournamentId(newTournamentId)
    setTournamentCreated(true)
  }

  // Handler to re-enable button after deletion
  const handleTournamentDeleted = () => {
    setTournamentId(null)
    setTournamentCreated(false)
  }

  const navigation = [
    { name: 'Create A Tournament', href: '#', current: true },
    { name: 'All Tournaments', href: '/badminton/admin/tournament', current: false },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation navigation={navigation} />
      <Header title="Tournaments" />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto space-y-4 mb-8">
            <label className="block">
                <span className="text-gray-700">Number of Teams:</span>
                <input
                type="number"
                min={1}
                className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400"
                value={numTeams === 0 ? '' : numTeams}
                onChange={e => {
                  const val = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                  setNumTeams(val === '' ? 0 : Math.max(1, Number(val)));
                }}
                disabled={tournamentCreated}
                />
            </label>

            <button
              onClick={handleCreate}
              className={`px-4 py-2 rounded transition duration-200 ${tournamentCreated ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              disabled={tournamentCreated}
              title={tournamentCreated ? 'Tournament already created. Delete to create a new one.' : 'Create'}
            >
              {tournamentCreated ? 'Tournament Created' : 'Create'}
            </button>
            <br />
            <button
              onClick={handleCreateWithRRMatches}
              className={`px-4 py-2 rounded transition duration-200 ${tournamentCreated ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              disabled={tournamentCreated}
              title={tournamentCreated ? 'Tournament already created. Delete to create a new one.' : 'Create Full Bracket'}
            >
              {tournamentCreated ? 'Tournament with Groups and Matches Created' : 'Create Full Bracket'}
            </button>
          </div>
          {tournamentId && (
           <TeamList tournamentId={tournamentId} onTournamentDeleted={handleTournamentDeleted} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
