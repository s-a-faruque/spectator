"use client";
import styles from "../../badminton.module.css";
import React, { useState } from 'react';
import Image from "next/image";
import { Nunito } from "next/font/google";
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
        <span onClick={handleLabelClick}>{value}</span>
      )}
    </div>
  );
};

export default function Match() {
  const [matchFinished, setMatchFinished] = React.useState(false);
  const [homePlayerScore, setHomePlayerScore] = React.useState(0);
  const [awayPlayerScore, setAwayPlayerScore] = React.useState(0);
  const [scoreHistory, setScoreHistory] = React.useState<{ home: number; away: number }[]>([]);
  const [winner, setWinner] = React.useState('');
  const [homePlayerName, setHomePlayerName] = useState('Player 1');
  const [awayPlayerName, setAwayPlayerName] = useState('Player 2');


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
  );
}
