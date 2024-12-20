"use client";
import styles from "../../badminton.module.css";
import React, { useState } from 'react';
import Image from "next/image";
import { Nunito } from "next/font/google";
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const EditableLabel = ({ initialValue }: { initialValue: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleLabelClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
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

  const handleFinishMatch = () => {
    setMatchFinished(true);
  };

  const incrementHomePlayerScore = () => {
    setScoreHistory([...scoreHistory, { home: homePlayerScore + 1, away: awayPlayerScore }]);
    setHomePlayerScore(homePlayerScore + 1);
  };
  const incrementAwayPlayerScore = () => {
    setScoreHistory([...scoreHistory, { home: homePlayerScore, away: awayPlayerScore + 1 }]);
    setAwayPlayerScore(awayPlayerScore + 1);
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
        <h1>Match page of a scorer</h1>
      </header>
      <div className={styles.primaryContent}>
        <div className={styles.scoreboard}>
          <div className={styles.player}>
            <div className={styles.playerName}><EditableLabel initialValue="Team 1" /></div>
            <div className={styles.playerScore}>{homePlayerScore}</div>
          </div>
          <div className={styles.player}>
            <div className={styles.playerName}><EditableLabel initialValue="Team 2" /></div>
            <div className={styles.playerScore}>{awayPlayerScore}</div>
          </div>
        </div>
        {matchFinished ? (
          <div className={styles.congratulations}>Congratulations! The match is finished.</div>
        ) : (
          <div className={styles.fullWidth}>
            <div className={styles.stack}>
              <button className={`${styles.homeControlButton} ${nunito.className}`} onClick={incrementHomePlayerScore}>{homePlayerScore}</button>
            </div>
            <div className={styles.stack}>
              <button className={`${styles.undoControlButton} ${nunito.className}`} onClick={undoScore}>
                <Image
                  src="/refresh.png"
                  alt="Refresh Icon"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            <div className={styles.stack}>
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
