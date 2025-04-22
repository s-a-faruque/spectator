"use client";
import styles from "./badminton.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function CardsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);

  const clearMatches = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("match-")) {
        const item = localStorage.getItem(key);
        if (item) {
          localStorage.removeItem(key);
        }
      }
    }
    setMatches([]);
  };
  interface Match {
    homePlayerName: string;
    homePlayerScore: number;
    awayPlayerName: string;
    awayPlayerScore: number;
  }

  useEffect(() => {
    //const isAuthenticated = localStorage.getItem("auth");

    // if (!isAuthenticated) {
    //   router.push("/login"); // Redirect to login if not authenticated
    // } else {
      // Load matches from localStorage
      const loadedMatches = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("match-")) {
          const item = localStorage.getItem(key);
          if (item) {
            const match = JSON.parse(item);
            match.id = key.replace("match-", ""); // Parse ID from key
            loadedMatches.push(match);
          }
        }
      }
      setMatches(loadedMatches);
    //}
  }, [router]);

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
          Scorer Home
        </h1>
        
      </header>
      <div className={styles.primaryContent}>
        <button
          className={styles.startButton}
          onClick={() => {
            const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
            window.location.href = `/badminton/scorer/match/${uniqueId}`;
          }}
        >
          +
        </button>
        <div className={styles.matchesList}>
          {matches.length === 0 ? (
            <p>You have not started any matches yet</p>
          ) : (
            <div style={{ float: "right", justifyContent: "space-between" }}>
              <button className={styles.clearMatchesButton} style={{ float: "right" }} onClick={clearMatches}>
                <Image src="/bin.png" alt="Logout" width={16} height={16} /> Clear All Matches
              </button>
            </div>
          )}
            
          {matches.map((match, index) => (
            <Link key={index} href={`/badminton/scorer/match/${match.id}`} className={styles.matchItemLink} passHref>
                <div className={styles.matchItem} style={{ cursor: 'pointer' }}>
                  <div>{match.homeTeamName} : {match.homePlayerName}</div>
                  <div><strong>{match.homePlayerScore}</strong> : <strong>{match.awayPlayerScore}</strong></div>
                  <div>{match.awayTeamName} : {match.awayPlayerName}</div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
