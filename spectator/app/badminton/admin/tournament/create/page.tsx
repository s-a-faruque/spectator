'use client'

import { useState } from 'react'
import styles from '../../../scorer/badminton.module.css'
import Image from 'next/image'
import Link from 'next/link'


export default function CreateTournamentPage() {
  const [numTeams, setNumTeams] = useState(4)

  const handleCreate = () => {
    if (!numTeams || numTeams < 2) {
      alert('Number of teams must be at least 2')
      return
    }

    const tournamentId = `tournament_${Math.random().toString(36).substring(2, 8)}`
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
      id: tournamentId,
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
        <label className="block mb-4">
        Number of Teams:
        <input
          type="number"
          min={2}
          className="w-full border p-2"
          value={numTeams}
          onChange={e => setNumTeams(Number(e.target.value))}
        />
      </label>

      <button
        onClick={handleCreate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Generate and Save
      </button>
      </div>
    </main>
  )
}
