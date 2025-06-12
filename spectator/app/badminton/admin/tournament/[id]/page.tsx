'use client';
import TeamList from '../../components/TeamList';
import Header from '../../../ui-components/Header';
import Navigation from '../../../ui-components/Navigation'

interface Params {
  id: string;
}

export default function TournamentPage({ params }: { params: Params }) {
  const { id } = params;
  const navigation = [
    { name: 'Tournament Teams', href: `/badminton/admin/tournament/${id}/`, current: true },
    { name: 'All Tournaments', href: '/badminton/admin/tournament', current: false },
    { name: 'Matches', href: `/badminton/admin/tournament/${id}/matches`, current: false },
    { name: 'Point Tables', href: `/badminton/admin/tournament/${id}/matches/points-table`, current: false },
    { name: 'Export Schedule', href: `/badminton/admin/tournament/${id}/matches/export`, current: false }
  ];
  
  return (
    <div className="min-h-full">
      <Navigation navigation={navigation} />
      <Header title="Tournament Home" />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TeamList tournamentId={id} />
        </div>
      </main>
    </div>
  );
}
