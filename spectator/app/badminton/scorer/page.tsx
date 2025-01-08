"use client";
import styles from "./badminton.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function CardsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("auth"); // Clear authentication flag
    router.push("/login"); // Redirect to login
  };

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
            loadedMatches.push(JSON.parse(item));
          }
        }
      }
      setMatches(loadedMatches);
    //}
  }, [router]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Home page of a scorer</h1>
        
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
            <div style={{ float: "right", justifyContent: "space-between" }}>
              <button className={styles.clearMatchesButton} style={{ float: "right" }}>
                <Image src="/bin.png" alt="Logout" width={16} height={16} /> Clear All Matches
              </button>
            </div>
            
          {matches.map((match, index) => (
            <div key={index} className={styles.matchItem}>
              <div>{match.homePlayerName} </div> <div>{match.homePlayerScore} : {match.awayPlayerScore} </div> <div>{match.awayPlayerName}</div>
              <button className={styles.clearMatchesButton}>
                <Image src="/bin.png" alt="Logout" width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
