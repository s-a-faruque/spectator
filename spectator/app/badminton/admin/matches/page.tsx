'use client';

import MatchManager from "../components/MatchManager";


export default function MatchPage() {
  const tournamentId = "6iL-qjQ"; // Replace with dynamic or actual ID if needed
  return (
    <div style={{ padding: 20 }}>
      <h1>Manage Matches</h1>
      <MatchManager tournamentId={tournamentId} />
    </div>
  );
}
