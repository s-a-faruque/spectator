'use client';

import MatchManager from "../../../components/MatchManager";

interface Params {
  id: string;
}

export default function MatchPage({ params }: { params: Params }) {
  const { id } = params;
  console.log("Tournament ID:", id);
  return (
    <div style={{ padding: 20 }}>
      <h1>Manage Matches</h1>
      <MatchManager tournamentId={id} />
    </div>
  );
}
