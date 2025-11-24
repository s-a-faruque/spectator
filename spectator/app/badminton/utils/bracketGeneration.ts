export interface Team {
    id: string;
    name: string;
}

export interface Match {
    id: string;
    teamA: string;
    teamB: string;
    round: string;
    stage: 'knockout';
    status: 'scheduled' | 'completed' | 'bye';
    nextMatchId?: string; // ID of the match the winner advances to
}

export const generateKnockoutBracket = (teams: Team[]): Match[] => {
    if (teams.length < 2) return [];

    const matches: Match[] = [];
    const numTeams = teams.length;

    // Find next power of 2
    let powerOf2 = 2;
    while (powerOf2 < numTeams) {
        powerOf2 *= 2;
    }

    // Calculate byes
    const numByes = powerOf2 - numTeams;
    const numRound1Matches = numTeams - numByes; // Actually, this logic is slightly off for standard brackets.
    // Standard approach:
    // Round 1 has (numTeams - powerOf2/2) * 2 teams playing? No.
    // Let's stick to a simpler model:
    // We create a "Round of X" where X = powerOf2.
    // We fill slots. If a slot is empty, it's a Bye.

    // Seeding: 1 vs 2, 3 vs 4... (Sequential for now)
    // Better seeding for brackets: 1 vs 8, 2 vs 7... but let's keep it simple first.

    const roundName = `Round of ${powerOf2}`;

    // Create first round matches
    // We need to distribute byes. Byes usually go to top seeds.
    // Let's assume teams are sorted by seed.
    // Top 'numByes' teams get a bye in the first round? 
    // Actually, if we have 6 teams (needs 8 slots). 2 Byes.
    // Match 1: Team 1 vs Bye (Team 1 advances)
    // Match 2: Team 4 vs Team 5
    // Match 3: Team 2 vs Bye (Team 2 advances)
    // Match 4: Team 3 vs Team 6

    // Let's just fill the bracket slots sequentially for MVP.
    // Slots: 1, 2, 3, ... powerOf2
    // Match 1: Slot 1 vs Slot 2
    // Match 2: Slot 3 vs Slot 4
    // ...

    const totalSlots = powerOf2;
    const numMatches = totalSlots / 2;

    for (let i = 0; i < numMatches; i++) {
        const teamAIndex = i * 2;
        const teamBIndex = i * 2 + 1;

        const teamA = teams[teamAIndex];
        const teamB = teams[teamBIndex]; // Might be undefined if we have fewer teams than slots

        // If teamB is missing, it's a Bye for teamA.
        // If teamA is also missing (shouldn't happen if logic is right), then it's empty.

        if (teamA && !teamB) {
            // Bye
            matches.push({
                id: `match_${Date.now()}_${i}`,
                teamA: teamA.id,
                teamB: 'BYE',
                round: roundName,
                stage: 'knockout',
                status: 'bye' // Auto-complete later
            });
        } else if (teamA && teamB) {
            matches.push({
                id: `match_${Date.now()}_${i}`,
                teamA: teamA.id,
                teamB: teamB.id,
                round: roundName,
                stage: 'knockout',
                status: 'scheduled'
            });
        }
    }

    return matches;
};
