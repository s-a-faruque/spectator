"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import React, { useEffect, useState } from 'react';
import { useAuthToken } from "@/app/useAuthToken";

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
  document: {
    _id: string;
    score: number;
    FirstInnings: Innings;
    SecondInnings: Innings;
    status: string;
    result: string;
  };
}

interface Params {
  id: string;
}

export default function Home({ params }: { params: Params }) {
  const { id } = params;
  const { accessToken, loading: tokenLoading, error: tokenError } = useAuthToken();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [run, setRun] = useState<number>(0);
  const [wicket, setWicket] = useState<number>(0);
  const [over, setOver] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [status, setStatus] = useState<string | null>();
  const [result, setResult] = useState<string | null>();

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      const body: FetchBody = {
        collection: "scores",
        database: "scoreboard",
        dataSource: "Cluster0",
        filter: {
          matchId: id
        }
      };

      try {
        const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/findOne', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': 'Bearer ' + accessToken,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result: ApiResponse = await response.json();
        setData(result);

        if (result.document.status === 'FirstInnings') {
          setRun(parseInt(result.document.FirstInnings.run));
          setWicket(parseInt(result.document.FirstInnings.wicket));
          setOver(parseFloat(result.document.FirstInnings.over));
        } else {
          setRun(parseInt(result.document.SecondInnings.run));
          setWicket(parseInt(result.document.SecondInnings.wicket));
          setOver(parseFloat(result.document.SecondInnings.over));
          setTarget(parseInt(result.document.FirstInnings.run) + 1);
        }
        setResult(result.document.result);
        setStatus(result.document.status);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!tokenLoading && !tokenError) {
      fetchData();
    }
  }, [accessToken, id, tokenLoading, tokenError]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (tokenError || error) return (
    <>
      <div>Please refresh. Failed to load data - `{tokenError || error}`</div>
      <button className={styles.refresh} onClick={handleRefresh}>
        <Image
          src="/refresh-square.png"
          alt="Refresh Icon"
          width={20}
          height={20}
        />
      </button>
    </>
  );
  if (tokenLoading || loading) return <div>Loading...</div>;

  const renderContentBasedOnStatus = () => {
    switch (status) {
      case 'FirstInnings':
        return (
          <>
            <div>Batting: <span className={styles.uppercase}>{data?.document.FirstInnings.team.fullname}</span></div>
            <div className={styles.score}><strong>{run} / {wicket}</strong></div>
            <div>Over: {over}</div>
          </>
        );
      case 'SecondInnings':
        return (
          <>
            <div>Batting: <span className={styles.uppercase}>{data?.document.SecondInnings.team.fullname}</span></div>
            <div className={styles.score}><strong>{run} / {wicket}</strong></div>
            <div>Over: {over}</div>
            <div>Target: {target}</div>
          </>
        );
      case 'NotStarted':
        return <div>Match has not started yet</div>;
      case 'Complete':
        return (
          <>
            <div><span className={styles.uppercase}>{data?.document.FirstInnings.team.fullname}</span></div>
            <div className={styles.score}><strong>{data?.document.FirstInnings.run} / {data?.document.FirstInnings.wicket}</strong></div>
            <hr className={styles.divider}/>
            <div><span className={styles.uppercase}>{data?.document.SecondInnings.team.fullname}</span></div>
            <div className={styles.score}><strong>{data?.document.SecondInnings.run} / {data?.document.SecondInnings.wicket}</strong></div>
            <div className={styles.result}><strong>{data?.document.result} </strong></div>
          </>
        );
      default:
        return <div>Status not available.</div>;
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          <span className={styles.uppercase}>{data?.document.FirstInnings.team.fullname}</span> <span className={styles.versus}>VS</span> <span className={styles.uppercase}>{data?.document.SecondInnings.team.fullname}</span>
        </p>
      </div>
      <div className={styles.card}>
        {renderContentBasedOnStatus()}
      </div>
      <div className={styles.footer}>
        <Link href="../../">
          <Image
            src="/homepage.png"
            alt="Home Icon"
            width={20}
            height={20}
          />
        </Link>
        <button className={styles.refresh} onClick={handleRefresh}>
          <Image
            src="/refresh-square.png"
            alt="Refresh Icon"
            width={20}
            height={20}
          />
        </button>
      </div>
    </main>
  );
}
