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
        <p>
          <strong>HALIFAX</strong> <span> AMATEUR CRICKET TOURNAMENT 24</span>
        </p>
        <button className={styles.refresh} onClick={handleRefresh}>
          <Image
            src="/refresh.png"
            alt="Refresh Icon"
            width={20}
            height={20}
          />
        </button>
      </div>
      {data.documents.map((match: any, index: any) => (
        <div className={styles.card} key={match._id}>
          <Link href={`/match/${match._id}`}>
            <span className={styles.matchNo}>{index + 1}</span>
            <span className={styles.uppercase}>{match.FirstInnings.team.fullname}</span>
            <span className={styles.versus}>VS</span>
            <span className={styles.uppercase}>{match.SecondInnings.team.fullname}</span>
          </Link>
        </div>
      ))}
    </main>
  );
}
