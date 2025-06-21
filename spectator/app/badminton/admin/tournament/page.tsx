'use client';

import TournamentManager from '../components/TournamentManager';
import Header from '../../ui-components/Header';
import Navigation from '../../ui-components/Navigation'
import Footer from '../../ui-components/Footer'

const navigation = [
    { name: 'Create A Tournament', href: '/badminton/admin/tournament/create', current: false },
    { name: 'All Tournaments', href: '/badminton/admin/tournament', current: true },
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
      <Footer />
    </div>
  );
}
