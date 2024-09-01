"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useEffect, useState } from 'react';

interface FetchBody {
  collection: string;
  database: string;
  dataSource: string;
  filter: any;
}
interface Innings {
  run: string;
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
  const [accessToken, setAccessToken] = useState<string | null>();
  const [run, setRun] = useState<number>(0);
  const [wicket, setWicket] = useState<number>(0);

  useEffect(() => {
    
    const fetchData = async () => {
      console.log('use Effect');
      const body: FetchBody = {
        collection: "scores",
        database: "scoreboard",
        dataSource: "Cluster0",
        filter: {
          matchId: id
        }
      };
      const accessTokenFromLocalStorage = localStorage.getItem('accessToken')
      if (accessTokenFromLocalStorage){
        console.log(accessTokenFromLocalStorage);
        setAccessToken(accessTokenFromLocalStorage);
      } else {
        const response = await fetch('https://realm.mongodb.com/api/client/v2.0/app/data-gdwsjkb/auth/providers/api-key/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
          },
          body: JSON.stringify({
            'key': 'szh5JljBccYCUJHBEUCrwDscVhwLsfv0pHUTw4iGtuhFrKiDkD9KFepQLhCVoSxW',
          }),
        });
        const authentication = await response.json();
        console.log(authentication);
        localStorage.setItem('accessToken', authentication.access_token ?? null);
        setAccessToken(authentication.access_token);
      }
      /*
        1. Is there any accessToken in localStorage? 
          if yes, use it.
          if no, 
            1. do an initial authentication
            2. store in localStorage
            3. use it. ex. setAccessToken(accessToken)
      */

      //if(accessTokenFromLocalStorage){
      if(typeof accessToken !== 'undefined'){
        
        console.log(accessTokenFromLocalStorage);

        try {
          const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/findOne', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Request-Headers': '*',
              //'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiNjZjOGUzMjIzODE5YTQ2YTczNGRhOTI0IiwiZXhwIjoxNzI1MDQ5MjUyLCJpYXQiOjE3MjUwNDc0NTIsImlzcyI6IjY2ZDIyMjljYjc0YzExZjFlOWVjYWJmZSIsImp0aSI6IjY2ZDIyMjljYjc0YzExZjFlOWVjYWMwMSIsInN0aXRjaF9kZXZJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInN0aXRjaF9kb21haW5JZCI6IjY2YzhlMzIyMzgxOWE0NmE3MzRkYTkyNCIsInN1YiI6IjY2YzhlMzQ2YTg5ZjFlZmNiYmJmMThhNSIsInR5cCI6ImFjY2VzcyJ9.gSOJ5Fp2KBLQPC5_GW2XOlyQpu0wXhpNDTcZsGzVPoo',
              //'Authorization': 'Bearer ' + accessTokenFromLocalStorage,
              'Authorization': 'Bearer ' + accessToken,
              // 'api-key': 'szh5JljBccYCUJHBEUCrwDscVhwLsfv0pHUTw4iGtuhFrKiDkD9KFepQLhCVoSxW',
            },
            body: JSON.stringify(body),
          });
  
          // if response is about to be expired token
          // get accessToken with refresh token
          // call API with this new accessToken
          if (!response.ok) {
            const responseAccessToken = await fetch('https://realm.mongodb.com/api/client/v2.0/app/data-gdwsjkb/auth/providers/api-key/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
              },
              body: JSON.stringify({
                'key': 'szh5JljBccYCUJHBEUCrwDscVhwLsfv0pHUTw4iGtuhFrKiDkD9KFepQLhCVoSxW',
              }),
            });
            const authentication = await responseAccessToken.json();
            console.log(authentication);
            localStorage.setItem('accessToken', authentication.access_token ?? null);
            setAccessToken(authentication.access_token);
            
            throw new Error('Failed to fetch data');
          }
  
          const result: ApiResponse = await response.json();
          setData(result);
          setRun(parseInt(result.document.FirstInnings.run));
          setWicket(parseInt(result.document.FirstInnings.wicket));
        } catch (err: any) {
          console.error('Error fetching data:', err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }

      }
      
    };

    fetchData();
  }, [accessToken]);
  
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     window.location.reload();
  //   }, 20000); // Refresh every 20 seconds

  //   return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  // }, []);

  if (error) return <div>Failed to load data 44 `{error}`</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          <span className={styles.uppercase}>{data.document.FirstInnings.team.fullname}</span> <span className={styles.versus}>VS</span> <span className={styles.uppercase}>{data.document.SecondInnings.team.fullname}</span>
        </p>
      </div>
      
      <div className={styles.card}>
        <pre>{run} / {wicket}</pre>
      </div>
      
      {/* <div className={styles.center}>
        <div>Product ID: {id}</div>
        <div>
          <h1>Data from MongoDB</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div> */}
    </main>
  );
}
