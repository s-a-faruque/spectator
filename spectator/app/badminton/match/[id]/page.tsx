"use client";
import styles from "./badminton.module.css";
import React, { useState, useEffect } from 'react';
import Image from "next/image";

import Ably from 'ably';

// Connect to Ably using the AblyProvider component and your API key
const ABLY_API_KEY = 'S3Ti0w.1ZoiQQ:JLsNMYxOaR_hLUFLKy1UpD1Gvgrbe0S4H_qKwEPmG98';

interface Params {
  id: string;
}

export default function Match({ params }: { params: Params }) {
  const { id } = params;
  const [matchFinished, setMatchFinished] = React.useState(false);
  const [homePlayerScore, setHomePlayerScore] = React.useState(0);
  const [awayPlayerScore, setAwayPlayerScore] = React.useState(0);
  const [winner, setWinner] = React.useState('');
  const [homePlayerName, setHomePlayerName] = useState('Player 1');
  const [awayPlayerName, setAwayPlayerName] = useState('Player 2');
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);
  
  const [messages, setMessages] = useState<Ably.InboundMessage[]>([]);

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
        if (message.name === 'score') {
          setHomePlayerScore(message.data.matchSets[0].homePlayerScore);
          setAwayPlayerScore(message.data.matchSets[0].awayPlayerScore);
          setHomePlayerName(message.data.homePlayerName);
          setAwayPlayerName(message.data.awayPlayerName);
        } else if (message.name === 'matchFinished') {
          setMatchFinished(true);
          setWinner(message.data.winner);
        }
        
      });
    }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Match</h1>
      </header>
      <div className={styles.primaryContent}>
        <div className={styles.scoreboard}>
          <div className={styles.player}>
            <div className={styles.playerName}><span>{homePlayerName}</span></div>
            <div className={styles.playerScore}>{homePlayerScore}</div>
          </div>
          <div className={styles.player}>
            <div className={styles.playerName}><span>{awayPlayerName}</span></div>
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
            <div className={`${styles.stack} ${styles.fullWidth} ${styles.flexHeight} ${styles.homeControlButton}`}>
              <span className={styles.controlButtonPlayerName}>
                {homePlayerName.length > 12 ? homePlayerName.substring(0, 12) + '...' : homePlayerName}
              </span>
              {homePlayerScore}
            </div>
            <div className={`${styles.stack} ${styles.fullWidth} ${styles.undoControlButton}`}> 
              :
            </div>
            <div className={`${styles.stack} ${styles.fullWidth} ${styles.flexHeight} ${styles.awayControlButton}`}>
              {awayPlayerScore} 
              <span className={styles.controlButtonPlayerName}>
                {awayPlayerName.length > 12 ? awayPlayerName.substring(0, 12) + '...' : awayPlayerName}
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
