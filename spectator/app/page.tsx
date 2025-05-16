"use client";
import styles from "./home.module.css";
import React from 'react';
import Link from "next/link";

export default function CardsPage() {
  const scorerHomePath = "/badminton/scorer";
  return (
    <main className={styles.main}>
      <header>
      </header>
      <section className={styles.hero}>
        <div>
          <span className={styles.firstHeadLine}>Share Live Scores Instantly with Your Audience. </span>
          <span>No Login, Always Free!</span>
        </div>
      </section>
      <section>
        <button
          className={styles.cta}
          onClick={() => {
            const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
            window.location.href = `/badminton/scorer/match/${uniqueId}`;
          }}
        >
          + NEW MATCH
        </button>
      </section>
      <footer className={styles.footer}>
        <strong>WTS / </strong> What&apos;s The Score
      </footer>
    </main>
  );
}
