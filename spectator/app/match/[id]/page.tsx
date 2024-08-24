"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useEffect, useState } from 'react';

interface FetchBody {
  collection: string;
  database: string;
  dataSource: string;
  projection: Record<string, number>;
}

interface ApiResponse {
  document: {
    _id: string;
    score: number;
  };
}

interface Params {
  id: string;
}

export default function Home({ params }: { params: Params }) {

  const { id } = params;
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    
    const fetchData = async () => {
      console.log('use Effect');
      const body: FetchBody = {
        collection: "scores",
        database: "scoreboard",
        dataSource: "Cluster0",
        projection: { "_id": 1, "score": 1 }
      };

      try {
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/findOne', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': 'szh5JljBccYCUJHBEUCrwDscVhwLsfv0pHUTw4iGtuhFrKiDkD9KFepQLhCVoSxW',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result: ApiResponse = await response.json();
        setData(result);
      } catch (err: any) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  if (error) return <div>Failed to load data 44 `{error}`</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <div>Product ID: {id}</div>
        <div>
          <h1>Data from MongoDB</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
