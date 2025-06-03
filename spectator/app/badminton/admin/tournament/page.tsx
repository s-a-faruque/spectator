'use client';

import TournamentManager from '../components/TournamentManager';
import styles from '../../scorer/badminton.module.css';
import Image from "next/image";
import Link from "next/link";

export default function AdminTournamentPage() {
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
          <TournamentManager />
        </div>
      </div>
    </main>
  );
}
