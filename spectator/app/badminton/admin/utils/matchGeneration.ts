// Generate round robin matches for a group
export function generateGroupStageMatches(teams: any[], groupId: string) {
  const matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: `match_${groupId}_${teams[i].id}_${teams[j].id}_${Date.now()}_${Math.random()}`,
        teamA: teams[i].id,
        teamB: teams[j].id,
        groupId,
        stage: 'group',
        teamAPlayers: [],
        teamBPlayers: [],
        numSets: 3,
        winPoints: 2,
        setScores: [
          { setNo: 1, teamAScore: 0, teamBScore: 0 },
          { setNo: 2, teamAScore: 0, teamBScore: 0 },
          { setNo: 3, teamAScore: 0, teamBScore: 0 }
        ],
        matchWinner: null,
        status: 'scheduled',
      });
    }
  }
  return matches;
}
