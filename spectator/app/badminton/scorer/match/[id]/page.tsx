"use client";
import styles from "../../badminton.module.css";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Ably, { Types } from 'ably';

import { Nunito } from "next/font/google";
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

// const client = new Ably.Realtime({ key: 'S3Ti0w.1ZoiQQ:JLsNMYxOaR_hLUFLKy1UpD1Gvgrbe0S4H_qKwEPmG98' });
const ABLY_API_KEY = 'S3Ti0w.1ZoiQQ:JLsNMYxOaR_hLUFLKy1UpD1Gvgrbe0S4H_qKwEPmG98';

interface EditableLabelProps {
  value: string;
  onChange: (newValue: string) => void;
}

const EditableLabel: React.FC<EditableLabelProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleLabelClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          autoFocus
        />
      ) : (
        <span onClick={handleLabelClick}>{value}</span>
      )}
    </div>
  );
};
interface Params {
  id: string;
}
export default function Match({ params }: { params: Params }) {
  const { id } = params;
  const [matchFinished, setMatchFinished] = React.useState(false);
  const [homePlayerScore, setHomePlayerScore] = React.useState(0);
  const [awayPlayerScore, setAwayPlayerScore] = React.useState(0);
  const [scoreHistory, setScoreHistory] = React.useState<{ home: number; away: number }[]>([]);
  const [winner, setWinner] = React.useState('');
  const [homePlayerName, setHomePlayerName] = useState('Player 1');
  const [awayPlayerName, setAwayPlayerName] = useState('Player 2');

  useEffect(() => {
    if (id) {
      // Use the id for any necessary logic
      console.log("Match ID:", id);
    }
  }, [id]);
  
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);
  
  const [messages, setMessages] = useState<Types.Message[]>([]);



  // const [channel] = useChannel('match', (message) => {
  //   setMessages(previousMessages => [...previousMessages, message]);
  // });
  
  useEffect(() => {
    // Initialize the Ably Realtime instance
    const ablyInstance = new Ably.Realtime({ key: ABLY_API_KEY });
    setAbly(ablyInstance);
    
    // Connect to a specific channel
    const ablyChannel = ablyInstance.channels.get("match-" + id);
    setChannel(ablyChannel);
    
    // Subscribe to the channel
    ablyChannel.subscribe((message) => {
      console.log("Received message:", message);
      console.log("Received data:", message.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    // // Cleanup: Unsubscribe when the component unmounts
    // return () => {
    //   ablyChannel.unsubscribe();
    //   ablyInstance.close();
    // };
  }, []);

  const handleFinishMatch = () => {
    setMatchFinished(true);
  };

  const canIncrement = (homeScore: number, awayScore: number) => {
    if(homeScore >= 21 && homeScore - awayScore >= 2) {
      setWinner(homePlayerName);
      return false;
    }
    if(awayScore >= 21 && awayScore - homeScore >= 2) {
      setWinner(awayPlayerName);
      return false;
    }
    return true;
  };

  const incrementHomePlayerScore = () => {
    if(!canIncrement(homePlayerScore, awayPlayerScore)){
      setMatchFinished(true);
      return;
    }
    setScoreHistory([...scoreHistory, { home: homePlayerScore + 1, away: awayPlayerScore }]);
    setHomePlayerScore(homePlayerScore + 1);

    utterNumber(homePlayerScore + 1);
    utterNumber(awayPlayerScore);

    publishScore({homePlayerScore: homePlayerScore + 1, awayPlayerScore: awayPlayerScore});

    if(!canIncrement(homePlayerScore + 1, awayPlayerScore)){
      setMatchFinished(true);
      return;
    }
  };
  const incrementAwayPlayerScore = () => {
    if(!canIncrement(homePlayerScore, awayPlayerScore)){
      setMatchFinished(true);
      return
    }
    setScoreHistory([...scoreHistory, { home: homePlayerScore, away: awayPlayerScore + 1 }]);
    setAwayPlayerScore(awayPlayerScore + 1);

    utterNumber(awayPlayerScore + 1);
    utterNumber(homePlayerScore);

    publishScore({homePlayerScore: homePlayerScore, awayPlayerScore: awayPlayerScore + 1});

    if(!canIncrement(homePlayerScore, awayPlayerScore + 1)){
      setMatchFinished(true);
      return;
    }
  };
  const handleClearScore = () => {
    setHomePlayerScore(0);
    setAwayPlayerScore(0);
    setScoreHistory([]);
    setMatchFinished(false);

    publishScore({homePlayerScore: 0, awayPlayerScore: 0});
  }

  const undoScore = () => {
    if (scoreHistory.length > 0) {
      if (scoreHistory.length === 1) {
        setHomePlayerScore(0);
        setAwayPlayerScore(0);
        setScoreHistory([]);

        publishScore({homePlayerScore: 0, awayPlayerScore: 0});
      } else {
        setScoreHistory(scoreHistory.slice(0, -1));
        const lastScore = scoreHistory[scoreHistory.length - 2];
        setHomePlayerScore(lastScore.home);
        setAwayPlayerScore(lastScore.away);

        publishScore({homePlayerScore: lastScore.home, awayPlayerScore: lastScore.away});
      }
      
    } 
  };

  const utterNumber = (score = 0) => {
    console.log(window.speechSynthesis.getVoices());
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(score.toString());
      utterance.lang = "en-US"; // You can customize the language
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  }

  const handlePublish = () => {
    const channel = ably?.channels.get('match-' + id);
    channel?.publish('score', {homePlayerScore, awayPlayerScore});
  }

  interface Score {
    homePlayerScore: number;
    awayPlayerScore: number;
  }

  const publishScore = (score: Score) => {
    const channel = ably?.channels.get('match-' + id);
    channel?.publish('score', score);
  }

  return (
    // <AblyProvider client={ably}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Match#  {id}</h1>
          
            {/* <div className={styles.stack}>
              <button className={`${styles.undoControlButton} ${nunito.className}`} onClick={handlePublish}>
                <Image
                  src="/upload.png"
                  alt="Refresh Icon"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            <div>
              { 
                messages.map(message => { 
                  return <p key={message.id}>{message.data.homePlayerScore} - {message.data.awayPlayerScore}</p> 
                })
              }
             
            </div> */}
            
        </header>
        <div className={styles.primaryContent}>
          <div className={styles.scoreboard}>
            <div className={styles.player}>
              <div className={styles.playerName}>
                <EditableLabel value={homePlayerName} onChange={setHomePlayerName} /></div>
              <div className={styles.playerScore}>{homePlayerScore}</div>
            </div>
            <div className={styles.player}>
              <div className={styles.playerName}><EditableLabel value={awayPlayerName} onChange={setAwayPlayerName} /></div>
              <div className={styles.playerScore}>{awayPlayerScore}</div>
            </div>
          </div>
          {matchFinished ? (
            <div className={styles.congratulations}>
              <Image
                    src="/medal.png"
                    alt="Medal Icon"
                    width={100}
                    height={100}
                  />
                  <div>Congratulations {winner}!</div>
              
            </div>
          ) : (
            <div className={`${styles.controls} ${styles.fullWidth}`}>
              <div className={`${styles.stack} ${styles.fullWidth} ${styles.flexHeight}`}>
                <button className={`${styles.homeControlButton} ${nunito.className}`} onClick={incrementHomePlayerScore}>{homePlayerScore}</button>
              </div>
              <div className={`${styles.stack} ${styles.fullWidth}`}>
                <button className={`${styles.undoControlButton} ${nunito.className}`} onClick={undoScore}>
                  <Image
                    src="/refresh.png"
                    alt="Refresh Icon"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <div className={`${styles.stack} ${styles.fullWidth} ${styles.flexHeight}`}>
                <button className={`${styles.awayControlButton} ${nunito.className}`} onClick={incrementAwayPlayerScore}>{awayPlayerScore}</button>
              </div>
            </div>
          )}
        </div>
        <footer className={styles.footer}>
          <div className={styles.stack}>
              <button onClick={handleClearScore} className={`${styles.clearScoreButton} ${nunito.className}`}>
                <span>Clear All Scores</span>
              </button>
          </div>
          <div className={styles.stack}>
            <button onClick={handleFinishMatch} className={`${nunito.className} ${styles.finishMatchButton}`}>Finish match</button>
          </div>        
        </footer>
      </main>
    // </AblyProvider>
    
  );
}
