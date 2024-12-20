"use client";
import styles from "./badminton.module.css";

export default function CardsPage() {
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
      </div>
    </main>
  );
}
