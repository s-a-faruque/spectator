"use client";
import styles from "./home.module.css";
import React from 'react';


export default function CardsPage() {
  return (
    <main className={styles.main}>
      <header>
      </header>
      <section className={styles.hero}>
        <div>
          <span className={styles.firstHeadLine}>
            Tournaments Made Simple
            {/* Share Live Scores Instantly with Your Audience.  */}
          </span> <br />
          {/* <span>No Login, Always Free!</span> */}
        </div>
      </section>
      <section>
        <button
          className={styles.cta}
          onClick={() => {
            const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
            window.location.assign(`/badminton/scorer/match/${uniqueId}`);
          }}
        >
          + NEW SINGLE MATCH
        </button>
        <br />
        <br />
        <button
          className={styles.cta}
          onClick={() => {
            window.location.assign(`/badminton/admin/tournament/create`);
          }}
        >
          + CREATE A TOURNAMENT
        </button>
        <br />
        <br />
        <button
          className={styles.cta}
          onClick={() => {
            window.location.assign(`/badminton/admin/tournament`);
          }}
        >
          EXISTING TOURNAMENTS
        </button>
        <br />
        <br />
        
      </section>
      <footer className={styles.footer}>
        <strong>WTS / </strong> What&apos;s The Score
      </footer>
    </main>
  );
}
