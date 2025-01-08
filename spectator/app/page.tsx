"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthToken } from './useAuthToken';  // Adjust import path based on your folder structure

interface FetchBody {
  collection: string;
  database: string;
  dataSource: string;
  filter: any;
}
interface Innings {
  run: string;
  over: string;
  team: Team;
  wicket: string;
};
type Team = {
  fullname: string
};
interface ApiResponse {
  documents: document[]; 
}
interface document {
  _id: string;
  score: number;
  FirstInnings: Innings;
  SecondInnings: Innings;
  status: string;
}
interface Params {
  id: string;
}

export default function CardsPage() {
  const { accessToken, loading, error } = useAuthToken();  // Use the custom hook
  const [data, setData] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      const body: FetchBody = {
        collection: "scores",
        database: "scoreboard",
        dataSource: "Cluster0",
        filter: { sportsType: "cricket" }
      };

      try {
        const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/find', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result: ApiResponse = await response.json();
        setData(result);
      } catch (err: any) {
        setApiError(err.message);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching token: {error}</div>;
  if (apiError) return <div>Error fetching data: {apiError}</div>;
  if (!data) return <div>Loading match data...</div>;

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
      {/* {data.documents.map((match: any, index: any) => (
        <div className={styles.card} key={match._id}>
          <Link href={`/match/${match.matchId}`}>
            <span className={styles.matchNo}>{index + 1}</span>
            <span className={styles.uppercase}>{match.FirstInnings.team.fullname}</span>
            <span className={styles.versus}>VS</span>
            <span className={styles.uppercase}>{match.SecondInnings.team.fullname}</span>
          </Link>
        </div>
      ))} */}
      <footer>
        -
      </footer>
    </main>
  );
}
