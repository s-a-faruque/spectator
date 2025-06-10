'use client';

import TournamentManager from '../components/TournamentManager';
import Header from '../../ui-components/Header';
import Navigation from '../../ui-components/Navigation'

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team & Groups', href: '#', current: false },
  { name: 'Matches', href: '#', current: false },
]

export default function AdminTournamentPage() {
  return (
    <div className="min-h-full">
      <Navigation navigation={navigation} />
      <Header title="Tournaments" />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TournamentManager />
        </div>
      </main>
    </div>
  );
}
