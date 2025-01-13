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
          <span><strong>No Login, Always Free!</strong></span>
        </div>
      </section>
      <section><Link className={styles.cta} href={scorerHomePath}>START NOW</Link></section>
      <footer className={styles.footer}>
        <strong>WTS / </strong> What&apos;s The Score
      </footer>
    </main>
  );
}
