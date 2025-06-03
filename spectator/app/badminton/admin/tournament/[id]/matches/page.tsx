'use client';

import MatchManager from "../../../components/MatchManager";
import styles from '../../../../scorer/badminton.module.css';
import Image from "next/image";
import Link from "next/link";

interface Params {
  id: string;
}

export default function MatchPage({ params }: { params: Params }) {
  const { id } = params;
  console.log("Tournament ID:", id);
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
          Admin Manage Matches
        </h1>
        
      </header>
      <div className={styles.primaryContent}>
        <div className={styles.matchesList}>
            <MatchManager tournamentId={id} />
        </div>
      </div>
    </main>
  );
}
