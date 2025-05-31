"use client";
import styles from "../../badminton.module.css";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Ably from 'ably';

import { Nunito } from "next/font/google";
import Link from "next/link";
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

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
  const [homePlayerName, setHomePlayerName] = useState('Home');
  const [awayPlayerName, setAwayPlayerName] = useState('Away');
  const [matchType, setMatchType] = useState('best-of-1');
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    if (id) {
      // Use the id for any necessary logic
      console.log("Match ID:", id);
      const matchScore = localStorage.getItem('match-' + id);
      if (matchScore) {
        const score = JSON.parse(matchScore);
        setMatchScore(score);
        setHomePlayerScore(score.matchSets[0].homePlayerScore);
        setAwayPlayerScore(score.matchSets[0].awayPlayerScore);
        setHomePlayerName(score.homePlayerName);
        setAwayPlayerName(score.awayPlayerName);
      }
    }
  }, [id]);
  
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
    });
    
  }, []);

  const handleFinishMatch = () => {
    setMatchFinished(true);
  };

  const canIncrement = (homeScore: number, awayScore: number) => {
    if(homeScore >= 21 && homeScore - awayScore >= 2) {
      setWinner(homePlayerName);
      publishMatchFinished(homePlayerName);
      return false;
    }
    if(awayScore >= 21 && awayScore - homeScore >= 2) {
      setWinner(awayPlayerName);
      publishMatchFinished(awayPlayerName);
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

    publishScore({
      matchId: id,
      homePlayerName,
      awayPlayerName,
      matchStatus: 'in-progress',
      matchType: matchType as MatchType,
      matchSets: [
        {
          setNo: 1,
          homePlayerScore: homePlayerScore + 1,
          awayPlayerScore: awayPlayerScore,
          status: 'in-progress'
        }
      ]
    });

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

    publishScore({
      matchId: id,
      homePlayerName,
      awayPlayerName,
      matchStatus: 'in-progress',
      matchType: matchType as MatchType,
      matchSets: [
        {
          setNo: 1,
          homePlayerScore: homePlayerScore,
          awayPlayerScore: awayPlayerScore + 1,
          status: 'in-progress'
        }
      ]
    });

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

    publishScore({
      matchId: id,
      homePlayerName,
      awayPlayerName,
      matchStatus: 'in-progress',
      matchType: matchType as MatchType,
      matchSets: [
        {
          setNo: 1,
          homePlayerScore: 0,
          awayPlayerScore: 0,
          status: 'in-progress'
        }
      ]
    });
  }

  const undoScore = () => {
    if (scoreHistory.length > 0) {
      if (scoreHistory.length === 1) {
        setHomePlayerScore(0);
        setAwayPlayerScore(0);
        setScoreHistory([]);

        publishScore({
          matchId: id,
          homePlayerName,
          awayPlayerName,
          matchStatus: 'in-progress',
          matchType: matchType as MatchType,
          matchSets: [
            {
              setNo: 1,
              homePlayerScore: 0,
              awayPlayerScore: 0,
              status: 'in-progress'
            }
          ]
        });
      } else {
        setScoreHistory(scoreHistory.slice(0, -1));
        const lastScore = scoreHistory[scoreHistory.length - 2];
        setHomePlayerScore(lastScore.home);
        setAwayPlayerScore(lastScore.away);

        publishScore({
          matchId: id,
          homePlayerName,
          awayPlayerName,
          matchStatus: 'in-progress',
          matchType: matchType as MatchType,
          matchSets: [
            {
              setNo: 1,
              homePlayerScore: lastScore.home,
              awayPlayerScore: lastScore.away,
              status: 'in-progress'
            }
          ]
        });
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

type SetStatus = 'completed' | 'in-progress' | 'not-started';
type MatchStatus = 'scheduled' | 'in-progress' | 'completed';
type MatchType = 'best-of-1' | 'best-of-3' | 'best-of-5';

interface Score {
  matchId: string;
  homePlayerName: string;
  awayPlayerName: string;
  matchStatus: MatchStatus;
  matchType: MatchType;
  matchSets: MatchSet[];
}

interface MatchSet {
  setNo: number;
  homePlayerScore: number;
  awayPlayerScore: number;
  status: SetStatus;
}

interface Score {
  matchId: string;
  homePlayerName: string;
  awayPlayerName: string;
  matchStatus: MatchStatus;
  matchType: MatchType;
  matchSets: MatchSet[];
}

  const publishScore = (score: Score) => {
    const channel = ably?.channels.get('match-' + id);
    channel?.publish('score', score);

    // make it in different method
    localStorage.setItem('match-' + id, JSON.stringify(score));
  }

  const publishMatchFinished = (winner: string) => {
    const channel = ably?.channels.get('match-' + id);
    channel?.publish('matchFinished', {winner: winner});
  }

  const handleHomePlayerNameChange = (newName: string) => {
    setHomePlayerName(newName);
    // Update this to match the Score interface structure
    publishScore({
      matchId: id,
      homePlayerName: newName,
      awayPlayerName,
      matchStatus: 'in-progress',
      matchType: matchType as MatchType,
      matchSets: [
        {
          setNo: 1,
          homePlayerScore,
          awayPlayerScore,
          status: 'in-progress'
        }
      ]
    });
  }

  const handleAwayPlayerNameChange = (newName: string) => {
    setAwayPlayerName(newName);
    // Update this to match the Score interface structure
    publishScore({
      matchId: id,
      homePlayerName,
      awayPlayerName: newName,
      matchStatus: 'in-progress',
      matchType: matchType as MatchType,
      matchSets: [
        {
          setNo: 1,
          homePlayerScore,
          awayPlayerScore,
          status: 'in-progress'
        }
      ]
    });
  }

  return (
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>
            <Link className={styles.home} href="/badminton/scorer">
                <Image
                  src="/bar-chart.png"
                  alt="List Icon"
                  width={16}
                  height={16}
                />
            </Link>
            Match#  {id}
            <button
              onClick={() => {
                const url = window.location.href.replace('/scorer', '');
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
              }}
              className={styles.copyLinkButton}
            >
              <Image
                src="/copy.png"
                alt="Copy Icon"
                width={16}
                height={16}
              />
            </button>
            <button
              onClick={() => {
                const url = window.location.href.replace('/scorer', '');
                if (navigator.share) {
                  navigator.share({
                    title: 'Match Link',
                    url: url,
                  }).then(() => {
                    console.log('Thanks for sharing!');
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(url);
                  alert("Link copied to clipboard!");
                }
              }}
              className={styles.shareButton}
            >
              <Image
                src="/share.png"
                alt="Share Icon"
                width={16}
                height={16}
              />
            </button>
           
          </h1>
          
        </header>
        <div className={styles.primaryContent}>
          <div className={styles.scoreboard}>
            <div className={styles.player}>
              <div className={styles.playerName}>
                <EditableLabel value={homePlayerName} onChange={handleHomePlayerNameChange} /></div>
              <div className={styles.playerScore}>{homePlayerScore}</div>
            </div>
            <div className={styles.player}>
              <div className={styles.playerName}>
                {/* <TeamPlayerSelector onPairSelect={handleAwayPlayerPairSelect}/>
                {awayTeamName && <span className={styles.teamName}><strong>{awayTeamName}</strong></span>} */}
                <EditableLabel value={awayPlayerName} onChange={handleAwayPlayerNameChange} /></div>
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
