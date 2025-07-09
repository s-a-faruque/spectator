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
        
        <button
          className='pl-2 ml-2 bg-gray-100 hover:bg-gray-600 font-semibold py-2 px-4 rounded'
          onClick={() => {
            window.location.assign(`/feedback`);
          }}
        >
          Feedback Please! <span role="img" aria-label="smile">😊</span>
        </button>
        
        <a className="pl-2 mt-4 bg-gray-100 hover:bg-gray-900 font-semibold py-2 px-2 rounded" href="https://coff.ee/safique" target="_blank">
					☕
				</a>
      </footer>
    </main>
  );
}
