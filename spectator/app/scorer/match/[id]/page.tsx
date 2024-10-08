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
  const { accessToken, error } = useAuthToken();  // Use the custom hook
  const [data, setData] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [run, setRun] = useState<number>(0);
  const [wicket, setWicket] = useState<number>(0);
  const [over, setOver] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [status, setStatus] = useState<string>('NotStarted');
  const [result, setResult] = useState<string | null>();
  const [unSavedRun, setUnSavedRun] = useState<boolean>(false);
  const [unSavedWicket, setUnSavedWicket] = useState<boolean>(false);
  const [unSavedOver, setUnSavedOver] = useState<boolean>(false);
  const [firstInningsTeamName, setFirstInningsTeamName] = useState<string>('');
  const [secondInningsTeamName, setSecondInningsTeamName] = useState<string>('');
  const [matchResult, setMatchResult] = useState<string>('');

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
        setMatchResult(result.document.result);
        setStatus(result.document.status);
        setFirstInningsTeamName(result.document.FirstInnings.team.fullname);
        setSecondInningsTeamName(result.document.SecondInnings.team.fullname);
        
      } catch (err: any) {
        console.error('Error fetching data:', err.message );
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, id]);

  const handleRefresh = () => {
    window.location.reload();
  };
  if (error) return (
    <>
      <div>Please refresh. Failed to load data - `{error}`
        <button className={styles.refresh} onClick={handleRefresh} >
          <Image
              src="/refresh-square.png" // Path to the icon image
              alt="Refresh Icon"
              width={20} // Adjust the width according to your needs
              height={20} // Adjust the height according to your needs
          />  
        </button>
      </div>
    </>
    
  );
  if (loading) return <div>Loading...</div>;

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
  const updateTeam = async () =>{
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
              'FirstInnings.team.fullname' : firstInningsTeamName,
              'SecondInnings.team.fullname' : secondInningsTeamName,
            }
          }
      }),
    });
  }
  const updateMatchResult = async () =>{
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
              result : matchResult,
            }
          }
      }),
    });
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
    if(!data) return 'No data';
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
            <div>
              First Innings:
              <select className={styles.refresh} value={firstInningsTeamName} onChange={handleFirstInningsTeamNameChange}>
                <option value={data.document.FirstInnings.team.fullname}>{data.document.FirstInnings.team.fullname}</option>
                <option value={data.document.SecondInnings.team.fullname}>{data.document.SecondInnings.team.fullname}</option>
              </select>
              <button className={styles.refresh} onClick={() => updateTeam()}>
                <Image
                  src="/upload.png" // Path to the icon image
                  alt="Upload Icon"
                  width={20} // Adjust the width according to your needs
                  height={20} // Adjust the height according to your needs
                />
              </button>
            </div>
            <div>
              Second Innings : {secondInningsTeamName}
            </div>
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
            <div className={styles.result}><strong>{matchResult} </strong></div>
            <div>
              <input type="string" value={matchResult} onChange={handleMatchResultChange}></input>
              <button className={styles.refresh} onClick={() => updateMatchResult()}>
                <Image
                  src="/upload.png" // Path to the icon image
                  alt="Upload Icon"
                  width={20} // Adjust the width according to your needs
                  height={20} // Adjust the height according to your needs
                />
              </button>
            </div>
          </>
        );
      default:
        return <div>Status not available.</div>;
    }
  };

  const handleStatusChange = (e: any) => {
    setStatus(e.target.value || 'Not started');
  }

  const handleFirstInningsTeamNameChange = (e: any) => {
    if(data && e.target.value != data?.document.FirstInnings.team.fullname){
      setFirstInningsTeamName(e.target.value || '');
      setSecondInningsTeamName(data ? data.document.FirstInnings.team.fullname : '');
    }
  }
  
  const handleMatchResultChange = (e: any) => {
    setMatchResult(e.target.value || '');
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
        <span className={styles.uppercase}>{data?.document.FirstInnings.team.fullname}</span> <span className={styles.versus}>VS</span> <span className={styles.uppercase}>{data?.document.SecondInnings.team.fullname}</span>
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
    </main>
  );
}
