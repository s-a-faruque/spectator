'use client';
import TournamentTeamManager from './components/TournamentTeamManager';

export default function AdminPage() {
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
          Admin Home
        </h1>
        
      </header>
      <div className={styles.primaryContent}>
        <div className={styles.matchesList}>
            <TournamentTeamManager />
        </div>
      </div>
    </main>
  );
}
