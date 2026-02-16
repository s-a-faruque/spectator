"use client";
import { useState, useEffect } from 'react';
import { PlayerRegistration } from './components/PlayerRegistration';
import { CourtCard, Player } from './components/CourtCard';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { User, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

interface Court {
  id: number;
  queue: string[]; // Array of player IDs
}

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [courts, setCourts] = useState<Court[]>([
    { id: 1, queue: [] },
    { id: 2, queue: [] },
    { id: 3, queue: [] },
    { id: 4, queue: [] },
    { id: 5, queue: [] },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('courtQueuePlayers');
    const savedCourts = localStorage.getItem('courtQueueCourts');
    const savedCurrentPlayer = localStorage.getItem('courtQueueCurrentPlayer');

    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    if (savedCourts) {
      setCourts(JSON.parse(savedCourts));
    }
    if (savedCurrentPlayer) {
      setCurrentPlayerId(savedCurrentPlayer);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('courtQueuePlayers', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('courtQueueCourts', JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    if (currentPlayerId) {
      localStorage.setItem('courtQueueCurrentPlayer', currentPlayerId);
    }
  }, [currentPlayerId]);

  const handleRegister = (name: string, email: string) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      email: email || undefined,
    };
    setPlayers([...players, newPlayer]);
    setCurrentPlayerId(newPlayer.id);
    toast.success(`Welcome, ${name}!`);
  };

  const handleJoinQueue = (courtId: number) => {
    if (!currentPlayerId) return;

    // Check if player is already in any queue
    const isInQueue = courts.some((court) => court.queue.includes(currentPlayerId));
    if (isInQueue) {
      toast.error('You are already in a queue. Leave your current queue first.');
      return;
    }

    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === courtId
          ? { ...court, queue: [...court.queue, currentPlayerId] }
          : court
      )
    );

    const player = players.find((p) => p.id === currentPlayerId);
    toast.success(`${player?.name} joined Court ${courtId} queue`);
  };

  const handleLeaveQueue = (courtId: number) => {
    if (!currentPlayerId) return;

    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === courtId
          ? { ...court, queue: court.queue.filter((id) => id !== currentPlayerId) }
          : court
      )
    );

    const player = players.find((p) => p.id === currentPlayerId);
    toast.info(`${player?.name} left Court ${courtId} queue`);
  };

  const getCurrentPlayerCourtId = (): number | null => {
    const court = courts.find((court) => court.queue.includes(currentPlayerId || ''));
    return court ? court.id : null;
  };

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isRegistered = currentPlayer !== undefined;
  const currentPlayerCourtId = getCurrentPlayerCourtId();

  const handleLogout = () => {
    // Remove player from any queue
    if (currentPlayerCourtId) {
      handleLeaveQueue(currentPlayerCourtId);
    }
    setCurrentPlayerId(null);
    localStorage.removeItem('courtQueueCurrentPlayer');
    toast.info('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Court Queue Manager</h1>
          <p className="text-slate-600">Join a court queue and track your position</p>
        </div>

        {/* Player Registration */}
        {!isRegistered && (
          <PlayerRegistration
            onRegister={handleRegister}
            isRegistered={isRegistered}
          />
        )}

        {/* Current Player Info */}
        {isRegistered && currentPlayer && (
          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="size-5" />
                  <span>Your Profile</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Name:</span> {currentPlayer.name}
              </p>
              {currentPlayer.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {currentPlayer.email}
                </p>
              )}
              {currentPlayerCourtId && (
                <p className="text-sm">
                  <span className="font-medium">Current Queue:</span> Court {currentPlayerCourtId}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Players List */}
        {isRegistered && players.length > 0 && (
          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                All Registered Players ({players.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-2 rounded-md text-sm ${
                      player.id === currentPlayerId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {player.name} {player.id === currentPlayerId && '(You)'}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courts Grid */}
        {isRegistered && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {courts.map((court) => {
              const queuePlayers = court.queue
                .map((playerId) => players.find((p) => p.id === playerId))
                .filter((p): p is Player => p !== undefined);

              return (
                <CourtCard
                  key={court.id}
                  courtNumber={court.id}
                  queue={queuePlayers}
                  currentPlayerId={currentPlayerId}
                  onJoinQueue={() => handleJoinQueue(court.id)}
                  onLeaveQueue={() => handleLeaveQueue(court.id)}
                  isPlayerInThisCourt={court.queue.includes(currentPlayerId || '')}
                  isPlayerInAnyQueue={currentPlayerCourtId !== null}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}