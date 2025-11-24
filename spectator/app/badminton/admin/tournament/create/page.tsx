'use client'

import { useState } from 'react'
import Header from '../../../ui-components/Header';
import Navigation from '../../../ui-components/Navigation'
import Footer from '../../../ui-components/Footer'
import TeamList from '../../components/TeamList'

export default function CreateTournamentPage() {
  const [mode, setMode] = useState<'quick' | 'bulk'>('quick');
  const [format, setFormat] = useState<'League' | 'Knockout' | 'Hybrid'>('League');
  const [numTeams, setNumTeams] = useState(4);
  const [bulkInput, setBulkInput] = useState('');
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [tournamentCreated, setTournamentCreated] = useState(false);

  const handleCreate = () => {
    // Always generate a new tournamentId on create
    const newTournamentId = `tournament_${Math.random().toString(36).substring(2, 8)}`;
    let teams = [];

    if (mode === 'quick') {
      teams = Array.from({ length: numTeams }, (_, i) => {
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
    } else {
      // Parse bulk input
      const lines = bulkInput.split('\n').filter(line => line.trim() !== '');
      teams = lines.map((line, i) => {
        const parts = line.split(':');
        const teamName = parts[0].trim();
        const teamId = `team_${Date.now()}_${i}`;

        let players: { id: string, name: string }[] = [];
        if (parts.length > 1) {
          const playerNames = parts[1].split(',').map(p => p.trim()).filter(p => p !== '');
          players = playerNames.map((pName, pIdx) => ({
            id: `${teamId}_p${pIdx + 1}`,
            name: pName
          }));
        }

        return {
          id: teamId,
          name: teamName,
          players: players
        };
      });
    }

    const tournament = {
      id: newTournamentId,
      name: `Tournament ${new Date().toISOString().slice(0, 10)}`,
      location: 'Unknown',
      startDate: '',
      endDate: '',
      format,
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

            {/* Mode Toggle */}
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${mode === 'quick'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                onClick={() => setMode('quick')}
                disabled={tournamentCreated}
              >
                Quick Generate
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${mode === 'bulk'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                onClick={() => setMode('bulk')}
                disabled={tournamentCreated}
              >
                Bulk Entry
              </button>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tournament Format</label>
              <div className="grid grid-cols-3 gap-2">
                {['League', 'Knockout', 'Hybrid'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`px-2 py-2 text-sm font-medium border rounded-lg ${format === f
                      ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    onClick={() => setFormat(f as any)}
                    disabled={tournamentCreated}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {format === 'League' && 'Round Robin: Everyone plays everyone (or in groups).'}
                {format === 'Knockout' && 'Single Elimination: Loser goes home.'}
                {format === 'Hybrid' && 'Groups first, then top teams advance to Knockout.'}
              </p>
            </div>

            {mode === 'quick' ? (
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
            ) : (
              <label className="block">
                <span className="text-gray-700">Enter Teams (One per line):</span>
                <div className="text-xs text-gray-500 mb-2">
                  Format: <code>Team Name: Player 1, Player 2</code>
                </div>
                <textarea
                  className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 font-mono text-sm"
                  rows={8}
                  placeholder={`Thunderbirds: John, Jane\nEagles: Mike, Rachel\nJust A Team Name`}
                  value={bulkInput}
                  onChange={e => setBulkInput(e.target.value)}
                  disabled={tournamentCreated}
                />
              </label>
            )}

            <button
              onClick={handleCreate}
              className={`w-full px-4 py-3 rounded font-bold transition duration-200 shadow-md ${tournamentCreated ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              disabled={tournamentCreated}
              title={tournamentCreated ? 'Tournament already created. Delete to create a new one.' : 'Generate and Save'}
            >
              {tournamentCreated ? 'Tournament Created' : 'Generate Tournament'}
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
