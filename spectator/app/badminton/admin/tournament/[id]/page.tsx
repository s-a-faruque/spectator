'use client';

import styles from '../../../scorer/badminton.module.css';
import Image from "next/image";
import Link from "next/link";
import TeamList from '../../components/TeamList';
interface Params {
  id: string;
}
export default function TournamentPage({ params }: { params: Params }) {
  const { id } = params;
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>
          <Link className={styles.home} href="/">
              <Image
                src="/homepage.png"
                alt="Home Icon"
                width={16}
                height={16}
              />
          </Link>
          Admin Tournament
        </h1>
        
      </header>
      <div className={styles.primaryContent}>
        <div className={styles.matchesList}>
          <TeamList tournamentId={id} />
        </div>
        <div className="mt-4 text-center">
              <Link
                href={`/badminton/admin/tournament/${id}/matches`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Manage Matches
              </Link>
            </div>
      </div>
    </main>
  );
}
