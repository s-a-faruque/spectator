'use client'

import { useState } from 'react'
import Header from '../../../ui-components/Header';
import Navigation from '../../../ui-components/Navigation'
import Footer from '../../../ui-components/Footer'
import TeamList from '../../components/TeamList'

export default function CreateTournamentPage() {
  const [numTeams, setNumTeams] = useState(4);
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [tournamentCreated, setTournamentCreated] = useState(false);

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
    const numGroups = 4;
    const groups = Array.from({ length: numGroups }, (_, i) => ({
      id: `group_${i + 1}`,
      name: `Group ${String.fromCharCode(65 + i)}`,
      teamIds: [] as string[],
    }));
    teams.forEach((team, idx) => {
      groups[idx % numGroups].teamIds.push(team.id);
    });    

    const tournament = {
      id: newTournamentId,
      name: `Tournament ${new Date().toISOString().slice(0, 10)}`,
      location: 'Unknown',
      startDate: '',
      endDate: '',
      teams,
      groups,
      stages: [],
      matches: []
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
              title={tournamentCreated ? 'Tournament already created. Delete to create a new one.' : 'Generate and Save'}
            >
              {tournamentCreated ? 'Tournament Created' : 'Generate and Save'}
            </button>
            <button
              onClick={handleCreateWithRRMatches}
              className={`px-4 py-2 rounded transition duration-200 ${tournamentCreated ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              disabled={tournamentCreated}
              title={tournamentCreated ? 'Tournament already created. Delete to create a new one.' : 'Generate with RR matches and Save'}
            >
              {tournamentCreated ? 'Tournament with groups Created' : 'Generate with RR matches and Save'}
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
