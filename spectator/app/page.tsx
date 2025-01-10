"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React from 'react';

export default function CardsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p><strong> What&apos;s The Score! </strong></p>
        <p><span> Keep Scores. Stay Updated. </span></p>
      </div>
      <section className="hero">
        <div className={styles.card}>
          <a href="/badminton/scorer">Start Scoring Now 
            <Image src="/flag.png" alt="flag" width={16} height={16} />
          </a>
        </div>
      </section>

      <section className={styles.features}>
        <ul>
          <li><strong>Live Updates:</strong> Scores update in real time.</li>
          <li><strong>Mobile Friendly</strong>: Perfect for any device.</li>
          <li><strong>No Sign-Up Needed</strong>: Start immediately.</li>
        </ul>
      </section>
    
      <footer>
        -
      </footer>
    </main>
  );
}
