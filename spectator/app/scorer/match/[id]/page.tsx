"use client";
import Image from "next/image";
import Link from "next/link";
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
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>();
  const [run, setRun] = useState<number>(0);
  const [wicket, setWicket] = useState<number>(0);
  const [over, setOver] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [status, setStatus] = useState<string>('NotStarted');
  const [result, setResult] = useState<string | null>();
  const [unSavedRun, setUnSavedRun] = useState<boolean>(false);
  const [unSavedWicket, setUnSavedWicket] = useState<boolean>(false);
  const [unSavedOver, setUnSavedOver] = useState<boolean>(false);


  useEffect(() => {
    
    const fetchData = async () => {
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
        const accessTokenExpiry = Number(localStorage.getItem('accessToken'));
        if (Date.now() > accessTokenExpiry){
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
          localStorage.setItem('accessToken', authentication.access_token ?? null);
          const currentTime = Date.now();
          const futureTime = currentTime + 10000; 
          localStorage.setItem('accessTokenExpiry', futureTime.toString());
          setAccessToken(authentication.access_token);
        } else {
          setAccessToken(accessTokenFromLocalStorage);
        }

        
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
        localStorage.setItem('accessToken', authentication.access_token ?? null);
        const currentTime = Date.now();
        const futureTime = currentTime + 10000; 
        localStorage.setItem('accessTokenExpiry', futureTime.toString());
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

          if(result.document.status === 'FirstInnings'){
            setRun(parseInt(result.document.FirstInnings.run));
            setWicket(parseInt(result.document.FirstInnings.wicket));
            setOver(parseFloat(result.document.FirstInnings.over));
          } else {
            setRun(parseInt(result.document.SecondInnings.run));
            setWicket(parseInt(result.document.SecondInnings.wicket));
            setOver(parseFloat(result.document.SecondInnings.over));
            setTarget(parseInt(result.document.FirstInnings.run + 1))
          }
          setResult(result.document.result);
          setStatus(result.document.status);
        } catch (err: any) {
          console.error('Error fetching data:', err.message );
          setError(err.message);
        } finally {
          setLoading(false);
        }

      }
      
    };

    fetchData();
  }, [accessToken, id]);
  
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     window.location.reload();
  //   }, 20000); // Refresh every 20 seconds

  //   return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  // }, []);

  const handleRefresh = () => {
    window.location.reload();
  };
  if (error) return (
    <>
      <div>Please refresh. Failed to load data - `{error}`</div>
      <button className={styles.refresh} onClick={handleRefresh} >
        <Image
            src="/refresh-square.png" // Path to the icon image
            alt="Refresh Icon"
            width={20} // Adjust the width according to your needs
            height={20} // Adjust the height according to your needs
        />  
      </button>
    </>
    
  );
  if (!data) return <div>Loading...</div>;

  const updateOver = async (innings:string) =>{
    const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/updateOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({
          collection: "scores",
          database: "scoreboard",
          dataSource: "Cluster0",
          filter: {
            matchId: id
          },
          update: {
            $set : {
              [`${innings}.over`]: over
            }
          }
      }),
    });
    setUnSavedOver(false);
  }

  const updateRun = async (innings:string) =>{
    const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/updateOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({
          collection: "scores",
          database: "scoreboard",
          dataSource: "Cluster0",
          filter: {
            matchId: id
          },
          update: {
            $set : {
              [`${innings}.run`]: run
            }
          }
      }),
    });
    setUnSavedRun(false);
  }

  const updateWicket = async (innings:string) =>{
    const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/updateOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({
          collection: "scores",
          database: "scoreboard",
          dataSource: "Cluster0",
          filter: {
            matchId: id
          },
          update: {
            $set : {
              [`${innings}.wicket`]: wicket
            }
          }
      }),
    });
    setUnSavedWicket(false);
  }

  const updateStatus = async (status:string) =>{
    const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-gdwsjkb/endpoint/data/v1/action/updateOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({
          collection: "scores",
          database: "scoreboard",
          dataSource: "Cluster0",
          filter: {
            matchId: id
          },
          update: {
            $set : {
              status: status
            }
          }
      }),
    });
    setUnSavedWicket(false);
  }
  const addRun = (runToAdd:number) => {
    setRun(run + runToAdd); // Update state when the input changes
    setUnSavedRun(true);
  };
  const addWicket = (wicketToAdd:number) => {
    setWicket(wicket + wicketToAdd); // Update state when the input changes
    setUnSavedWicket(true);
  };
  const addOver = (ballToAdd:number) => {
    let totalOvers = Math.floor(over); // Get the integer part (completed overs)
    let ballsInOver = Math.round((over - totalOvers) * 10);
    if(ballsInOver + ballToAdd > 5){
      ballsInOver = 0;
      totalOvers += 1;
    } else if (ballsInOver + ballToAdd < 0) {
      ballsInOver = 5;
      totalOvers -= 1;
    } else {
      ballsInOver += ballToAdd;
    }
    setOver(totalOvers + ballsInOver / 10); // Update state when the input changes
    setUnSavedOver(true);
  };
  
  const renderContentBasedOnStatus = () => {
    switch (status) {
      case 'FirstInnings':
        return (
          <>
            <div>Batting: <span className={styles.uppercase}>{data.document.FirstInnings.team.fullname}</span></div>
            <div> Run : 
              <button className={styles.refresh} onClick={()=>addRun(-1)} >-</button>
              {run}
              <button className={styles.refresh} onClick={()=>addRun(1)} >+</button>
              {
                unSavedRun ?
                (<button className={styles.refresh} onClick={() => updateRun('FirstInnings')}>
                <Image
                  src="/upload.png" // Path to the icon image
                  alt="Upload Icon"
                  width={20} // Adjust the width according to your needs
                  height={20} // Adjust the height according to your needs
                />
              </button>)
                :
                (
                  <button className={styles.refresh}>
                    <Image
                    src="/checkmark.png" // Path to the icon image
                    alt="Upload Icon"
                    width={20} // Adjust the width according to your needs
                    height={20} // Adjust the height according to your needs
                  />
                  </button>
                )
              }
            </div>
            <div> Wicket : 
              <button className={styles.refresh} onClick={()=>addWicket(-1)} >-</button>
              {wicket}
              <button className={styles.refresh} onClick={()=>addWicket(1)} >+</button>
              
              {
                unSavedWicket ?
                (
                  <button className={styles.refresh} onClick={() => updateWicket('FirstInnings')}>
                    <Image
                      src="/upload.png" // Path to the icon image
                      alt="Upload Icon"
                      width={20} // Adjust the width according to your needs
                      height={20} // Adjust the height according to your needs
                    />
                  </button>
                )
                :
                (
                  <button className={styles.refresh}>
                    <Image
                    src="/checkmark.png" // Path to the icon image
                    alt="Upload Icon"
                    width={20} // Adjust the width according to your needs
                    height={20} // Adjust the height according to your needs
                  />
                  </button>
                )
              }
            </div>
            <div> Over : 
              <button className={styles.refresh} onClick={()=>addOver(-1)} >-</button>
              {over}
              <button className={styles.refresh} onClick={()=>addOver(1)} >+</button>
              {
                unSavedOver ?
                (
                  <button className={styles.refresh} onClick={() => updateOver('FirstInnings')}>
                    <Image
                      src="/upload.png" // Path to the icon image
                      alt="Upload Icon"
                      width={20} // Adjust the width according to your needs
                      height={20} // Adjust the height according to your needs
                    />
                  </button>
                )
                :
                (
                  <button className={styles.refresh}>
                    <Image
                    src="/checkmark.png" // Path to the icon image
                    alt="Upload Icon"
                    width={20} // Adjust the width according to your needs
                    height={20} // Adjust the height according to your needs
                  />
                  </button>
                )
              }
            </div>


            <div className={styles.score}>
              
              <strong>
                {run} 
                / 
                {wicket}
              </strong>
            </div>
            <div>Over: {over}
            </div>
          </>
        );
      case 'SecondInnings':
        return (
          <>
            <div>Batting: <span className={styles.uppercase}>{data.document.SecondInnings.team.fullname}</span></div>
            <div> Run : 
              <button className={styles.refresh} onClick={()=>addRun(-1)} >-</button>
              {run}
              <button className={styles.refresh} onClick={()=>addRun(1)} >+</button>
              {
                unSavedRun ?
                (<button className={styles.refresh} onClick={() => updateRun('SecondInnings')}>
                <Image
                  src="/upload.png" // Path to the icon image
                  alt="Upload Icon"
                  width={20} // Adjust the width according to your needs
                  height={20} // Adjust the height according to your needs
                />
              </button>)
                :
                (
                  <button className={styles.refresh}>
                    <Image
                    src="/checkmark.png" // Path to the icon image
                    alt="Upload Icon"
                    width={20} // Adjust the width according to your needs
                    height={20} // Adjust the height according to your needs
                  />
                  </button>
                )
              }
            </div>
            <div> Wicket : 
              <button className={styles.refresh} onClick={()=>addWicket(-1)} >-</button>
              {wicket}
              <button className={styles.refresh} onClick={()=>addWicket(1)} >+</button>
              
              {
                unSavedWicket ?
                (
                  <button className={styles.refresh} onClick={() => updateWicket('SecondInnings')}>
                    <Image
                      src="/upload.png" // Path to the icon image
                      alt="Upload Icon"
                      width={20} // Adjust the width according to your needs
                      height={20} // Adjust the height according to your needs
                    />
                  </button>
                )
                :
                (
                  <button className={styles.refresh}>
                    <Image
                    src="/checkmark.png" // Path to the icon image
                    alt="Upload Icon"
                    width={20} // Adjust the width according to your needs
                    height={20} // Adjust the height according to your needs
                  />
                  </button>
                )
              }
            </div>
            <div> Over : 
              <button className={styles.refresh} onClick={()=>addOver(-1)} >-</button>
              {over}
              <button className={styles.refresh} onClick={()=>addOver(1)} >+</button>
              {
                unSavedOver ?
                (
                  <button className={styles.refresh} onClick={() => updateOver('SecondInnings')}>
                    <Image
                      src="/upload.png" // Path to the icon image
                      alt="Upload Icon"
                      width={20} // Adjust the width according to your needs
                      height={20} // Adjust the height according to your needs
                    />
                  </button>
                )
                :
                (
                  <button className={styles.refresh}>
                    <Image
                    src="/checkmark.png" // Path to the icon image
                    alt="Upload Icon"
                    width={20} // Adjust the width according to your needs
                    height={20} // Adjust the height according to your needs
                  />
                  </button>
                )
              }
            </div>
            <div className={styles.score}>
              <strong>
                {run} 
                {/* <input
                  type="number"
                  placeholder="Enter new run"
                  value={run}
                  onChange={handleRunChange}
                />
                <button className={styles.refresh} onClick={() => updateRun('SecondInnings')}>√</button> */}
                / 
                {wicket}
                {/* <input
                  type="number"
                  placeholder="Enter new wicket"
                  value={wicket}
                  onChange={handleWicketChange}
                />
                <button onClick={() => updateWicket('SecondInnings')}>√</button> */}
              </strong>
            </div>
            <div>Over: {over} 
              {/* <input
                type="number"
                placeholder="Enter new over"
                value={over}
                onChange={handleOverChange}
              />
              <button onClick={() => updateOver('SecondInnings')}>√</button> */}
            </div>
            <div>Target: {target}</div>
          </>
        );
      case 'NotStarted':
        return (
          <>
            <div>Match has not started yet</div>
          </>
        );
      case 'Complete':
        return (
          <>
            <div><span className={styles.uppercase}>{data.document.FirstInnings.team.fullname}</span></div>
            <div className={styles.score}><strong>{data.document.FirstInnings.run} / {data.document.FirstInnings.wicket}</strong></div>
            <hr className={styles.divider}/>
            <div><span className={styles.uppercase}>{data.document.SecondInnings.team.fullname}</span></div>
            <div className={styles.score}><strong>{data.document.SecondInnings.run} / {data.document.SecondInnings.wicket}</strong></div>
            <div className={styles.result}><strong>{data.document.result} </strong></div>
          </>
        );
      default:
        return <div>Status not available.</div>;
    }
  };

  const handleStatusChange = (e: any) => {
    setStatus(e.target.value || 'Not started');
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          <span className={styles.uppercase}>{data.document.FirstInnings.team.fullname}</span> <span className={styles.versus}>VS</span> <span className={styles.uppercase}>{data.document.SecondInnings.team.fullname}</span>
        </p>
      </div>
      
      <div className={styles.card}>
        <div>
          Current Status: 
          <select className={styles.refresh} value={status ?? undefined} onChange={handleStatusChange}>
            <option value="NotStarted">Not Started</option>
            <option value="FirstInnings">First Innings</option>
            <option value="SecondInnings">Second Innings</option>
            <option value="Complete">Complete</option>
          </select>

          <button className={styles.refresh} onClick={() => updateStatus(status)}>
            <Image
              src="/upload.png" // Path to the icon image
              alt="Upload Icon"
              width={20} // Adjust the width according to your needs
              height={20} // Adjust the height according to your needs
            />
          </button>
        </div>
        {renderContentBasedOnStatus()}
      </div>
      
      <div className={styles.footer}>
        <Link href="../../">
          <Image
            src="/homepage.png" // Path to the icon image
            alt="Home Icon"
            width={20} // Adjust the width according to your needs
            height={20} // Adjust the height according to your needs
          />
        </Link>
        <button className={styles.refresh} onClick={handleRefresh} >
        <Image
            src="/refresh-square.png" // Path to the icon image
            alt="Refresh Icon"
            width={20} // Adjust the width according to your needs
            height={20} // Adjust the height according to your needs
          />  
        </button>
        
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
