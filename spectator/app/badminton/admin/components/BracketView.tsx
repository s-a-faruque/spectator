import React from 'react';

interface Match {
    id: string;
    teamA: string;
    teamB: string;
    round?: string;
    stage: 'group' | 'knockout';
    status?: string;
    matchWinner?: 'A' | 'B' | null;
    setScores?: any[];
}

interface Team {
    id: string;
    name: string;
}

interface BracketViewProps {
    matches: Match[];
    teams: Team[];
}

export default function BracketView({ matches, teams }: BracketViewProps) {
    const getTeamName = (teamId: string) => {
        if (teamId === 'BYE') return 'BYE';
        return teams.find(t => t.id === teamId)?.name || teamId;
    };

    // Filter only knockout matches
    const knockoutMatches = matches.filter(m => m.stage === 'knockout');

    // Group by round
    // Ideally we should know the order of rounds.
    // For MVP, let's just group by the 'round' string.
    const rounds: { [key: string]: Match[] } = {};
    knockoutMatches.forEach(m => {
        const r = m.round || 'Unknown Round';
        if (!rounds[r]) rounds[r] = [];
        rounds[r].push(m);
    });

    // Sort rounds? 
    // "Round of 16", "Quarter-Final", "Semi-Final", "Final"
    // This is hard to sort alphabetically.
    // Let's rely on the order they were generated or just display them as is for now.
    // A better way is to sort by number of matches in the round (descending).
    const sortedRoundNames = Object.keys(rounds).sort((a, b) => rounds[b].length - rounds[a].length);

    return (
        <div className="overflow-x-auto py-8">
            <div className="flex gap-8 min-w-max">
                {sortedRoundNames.map(roundName => (
                    <div key={roundName} className="flex flex-col justify-around gap-8 min-w-[200px]">
                        <h3 className="text-center font-bold text-gray-700 mb-4">{roundName}</h3>
                        {rounds[roundName].map(match => (
                            <div key={match.id} className="border rounded-lg p-3 bg-white shadow-sm relative">
                                <div className={`flex justify-between items-center mb-2 ${match.matchWinner === 'A' ? 'font-bold text-green-600' : ''}`}>
                                    <span className="truncate max-w-[120px]" title={getTeamName(match.teamA)}>{getTeamName(match.teamA)}</span>
                                    {match.setScores && <span className="text-xs bg-gray-100 px-1 rounded ml-2">{match.setScores.filter((s: any) => s.teamAScore > s.teamBScore).length}</span>}
                                </div>
                                <div className="border-t border-gray-100 my-1"></div>
                                <div className={`flex justify-between items-center ${match.matchWinner === 'B' ? 'font-bold text-green-600' : ''}`}>
                                    <span className="truncate max-w-[120px]" title={getTeamName(match.teamB)}>{getTeamName(match.teamB)}</span>
                                    {match.setScores && <span className="text-xs bg-gray-100 px-1 rounded ml-2">{match.setScores.filter((s: any) => s.teamBScore > s.teamAScore).length}</span>}
                                </div>

                                {/* Connector lines could go here */}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
