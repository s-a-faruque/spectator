"use client";
import styles from "./badminton.module.css";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Nunito } from "next/font/google";

import Ably from 'ably';
import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';

// Connect to Ably using the AblyProvider component and your API key
const client = new Ably.Realtime({ key: 'S3Ti0w.1ZoiQQ:JLsNMYxOaR_hLUFLKy1UpD1Gvgrbe0S4H_qKwEPmG98' });
const ABLY_API_KEY = 'S3Ti0w.1ZoiQQ:JLsNMYxOaR_hLUFLKy1UpD1Gvgrbe0S4H_qKwEPmG98';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

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
        <span>{value}</span>
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
          setHomePlayerScore(message.data.homePlayerScore);
          setAwayPlayerScore(message.data.awayPlayerScore);
          setHomePlayerName(message.data.homePlayerName);
          setAwayPlayerName(message.data.awayPlayerName);
        } else if (message.name === 'matchFinished') {
          setMatchFinished(true);
          setWinner(message.data.winner);
        }
        
      });
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
    if(!canIncrement(homePlayerScore + 1, awayPlayerScore)){
      setMatchFinished(true);
      return;
    }
  };
  const incrementAwayPlayerScore = () => {
    if(!canIncrement(homePlayerScore, awayPlayerScore)){
      setMatchFinished(true);
      return;
    }
    setScoreHistory([...scoreHistory, { home: homePlayerScore, away: awayPlayerScore + 1 }]);
    setAwayPlayerScore(awayPlayerScore + 1);
    utterNumber(awayPlayerScore + 1);
    utterNumber(homePlayerScore);

    // const jokes = [ "দাঁড়া, তোর খবর আছে।", "খেলা শিখে খেলতে আইসো।", "খেলা hobey", "চাপ দিয়া বাপের নাম ভুলায়া দিবো" ];
    // const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    // const joke = new SpeechSynthesisUtterance(randomJoke);
    // //const joke = new SpeechSynthesisUtterance("খেলা শিখে খেলতে আইসো।");
    // //const joke = new SpeechSynthesisUtterance("খেলা শিখে খেলতে আইসো।");
    // //const joke = new SpeechSynthesisUtterance();
    
    // joke.lang = "bn-BD"; // You can customize the language
    // window.speechSynthesis.speak(joke);

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
  }

  const undoScore = () => {
    if (scoreHistory.length > 0) {
      if (scoreHistory.length === 1) {
        setHomePlayerScore(0);
        setAwayPlayerScore(0);
        setScoreHistory([]);
      } else {
        setScoreHistory(scoreHistory.slice(0, -1));
        const lastScore = scoreHistory[scoreHistory.length - 2];
        setHomePlayerScore(lastScore.home);
        setAwayPlayerScore(lastScore.away);
      }
      
    } 
  };

  const utterNumber = (score = 0) => {
    console.log(window.speechSynthesis.getVoices());
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(score.toString());
      // const utterance = new SpeechSynthesisUtterance("৩");
      utterance.lang = "en-US"; // You can customize the language
      //utterance.lang = "bn-BD"; // You can customize the language
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Match</h1>
      </header>
      <div className={styles.primaryContent}>
        <div className={styles.scoreboard}>
          <div className={styles.player}>
            <div className={styles.playerName}><EditableLabel value={homePlayerName} onChange={setHomePlayerName} /></div>
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
            <div className={`${styles.stack} ${styles.fullWidth} ${styles.flexHeight} ${styles.homeControlButton}`}>
              {homePlayerScore}
            </div>
            <div className={`${styles.stack} ${styles.fullWidth} ${styles.undoControlButton}`}> 
              vs
            </div>
            <div className={`${styles.stack} ${styles.fullWidth} ${styles.flexHeight} ${styles.awayControlButton}`}>
              {awayPlayerScore}
            </div>
          </div>
        )}
      </div>
      {/* <footer className={styles.footer}>
        <div className={styles.stack}>
            <button onClick={handleClearScore} className={`${styles.clearScoreButton} ${nunito.className}`}>
              <span>Clear All Scores</span>
            </button>
        </div>
        <div className={styles.stack}>
          <button onClick={handleFinishMatch} className={`${nunito.className} ${styles.finishMatchButton}`}>Finish match</button>
        </div>        
      </footer> */}
    </main>
  );
}
