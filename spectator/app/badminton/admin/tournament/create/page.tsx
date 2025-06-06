'use client'

import { useState } from 'react'
import styles from '../../../scorer/badminton.module.css'
import Image from 'next/image'
import Link from 'next/link'
import TeamList from '../../components/TeamList'


export default function CreateTournamentPage() {
  const [numTeams, setNumTeams] = useState(4);
  const [tournamentId, setTournamentId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!numTeams || numTeams < 2) {
      alert('Number of teams must be at least 2')
      return
    }

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

    alert(`Tournament with ${numTeams} teams saved to localStorage!`)
  }

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
          Admin Home
        </h1>
        
      </header>
      <div className={styles.primaryContent}>
        <div className="max-w-md mx-auto mt-10 p-6 space-y-4">
            <label className="block">
                <span className="text-gray-700">Number of Teams:</span>
                <input
                type="number"
                min={2}
                className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400"
                value={numTeams}
                onChange={e => setNumTeams(Number(e.target.value))}
                />
            </label>

            <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
            >
                Generate and Save
            </button>
        </div>
        <TeamList tournamentId={tournamentId ?? ''} />
      </div>
    </main>
  )
}
