import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, ArrowRight, LogOut } from 'lucide-react';

export interface Player {
  id: string;
  name: string;
  email?: string;
}

interface CourtCardProps {
  courtNumber: number;
  queue: Player[];
  currentPlayerId: string | null;
  onJoinQueue: () => void;
  onLeaveQueue: () => void;
  isPlayerInThisCourt: boolean;
  isPlayerInAnyQueue: boolean;
}

export function CourtCard({
  courtNumber,
  queue,
  currentPlayerId,
  onJoinQueue,
  onLeaveQueue,
  isPlayerInThisCourt,
  isPlayerInAnyQueue,
}: CourtCardProps) {
  const nextToPlayCount = 4;
  const nextToPlay = queue.slice(0, nextToPlayCount);
  const waiting = queue.slice(nextToPlayCount);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Court {courtNumber}</span>
          <Badge variant="secondary" className="ml-2">
            <Users className="size-3 mr-1" />
            {queue.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next to Play Section */}
        {nextToPlay.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowRight className="size-4 text-green-600" />
              <span>Next to Play</span>
            </div>
            <div className="space-y-1">
              {nextToPlay.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 p-2 rounded-md bg-green-50 border border-green-200 ${
                    player.id === currentPlayerId ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm">{player.name}</span>
                  {player.id === currentPlayerId && (
                    <Badge variant="default" className="text-xs">You</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waiting List */}
        {waiting.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Waiting ({waiting.length})
            </div>
            <div className="space-y-1">
              {waiting.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 p-2 rounded-md bg-muted ${
                    player.id === currentPlayerId ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted-foreground text-white text-xs">
                    {nextToPlayCount + index + 1}
                  </span>
                  <span className="flex-1 text-sm">{player.name}</span>
                  {player.id === currentPlayerId && (
                    <Badge variant="default" className="text-xs">You</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty Queue */}
        {queue.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No players in queue</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2">
          {isPlayerInThisCourt ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={onLeaveQueue}
            >
              <LogOut className="size-4 mr-2" />
              Leave Queue
            </Button>
          ) : (
            <Button
              variant="default"
              className="w-full"
              onClick={onJoinQueue}
              disabled={isPlayerInAnyQueue}
            >
              <Users className="size-4 mr-2" />
              {isPlayerInAnyQueue ? 'Already in a Queue' : 'Join Queue'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
