"use client";
import React, { useState, useEffect } from "react";

const teamsData = [
    {
      "name": "Dhaka",
      "players": [
        { "id": 1, "name": "Alice Johnson" },
        { "id": 2, "name": "Brian Smith" },
        { "id": 3, "name": "Cindy Ray" },
        { "id": 4, "name": "Derek Miles" }
      ]
    },
    {
      "name": "Sylhet",
      "players": [
        { "id": 5, "name": "Ethan Page" },
        { "id": 6, "name": "Farah Bloom" },
        { "id": 7, "name": "George Tan" },
        { "id": 8, "name": "Hana Liu" }
      ]
    },
    {
      "name": "Rajshahi",
      "players": [
        { "id": 9, "name": "Isaac Noor" },
        { "id": 10, "name": "Jasmine Khan" },
        { "id": 11, "name": "Kunal Sethi" },
        { "id": 12, "name": "Laura Singh" }
      ]
    },
    {
      "name": "Cumilla",
      "players": [
        { "id": 13, "name": "Mike Dee" },
        { "id": 14, "name": "Nina Roy" },
        { "id": 15, "name": "Oscar Grant" },
        { "id": 16, "name": "Priya Das" }
      ]
    },
    {
      "name": "Cox's Bazar",
      "players": [
        { "id": 17, "name": "Quinn Fraser" },
        { "id": 18, "name": "Riya Hassan" },
        { "id": 19, "name": "Steve Patel" },
        { "id": 20, "name": "Tina Chow" }
      ]
    },
    {
      "name": "Barishal",
      "players": [
        { "id": 21, "name": "Umair Reza" },
        { "id": 22, "name": "Vera Gomes" },
        { "id": 23, "name": "Will Chen" },
        { "id": 24, "name": "Xena Zhang" }
      ]
    },
    {
      "name": "Chattogram",
      "players": [
        { "id": 25, "name": "Yusuf Malik" },
        { "id": 26, "name": "Zara Pritchard" },
        { "id": 27, "name": "Alan Grey" },
        { "id": 28, "name": "Becky Liew" }
      ]
    },
    {
      "name": "Mymensingh",
      "players": [
        { "id": 29, "name": "Charlie Ray" },
        { "id": 30, "name": "Dana Wells" },
        { "id": 31, "name": "Eliot Moore" },
        { "id": 32, "name": "Faith Young" }
      ]
    },
    {
      "name": "Rangpur",
      "players": [
        { "id": 33, "name": "Gabe O'Neil" },
        { "id": 34, "name": "Hailey Noor" },
        { "id": 35, "name": "Ishaan Kapoor" },
        { "id": 36, "name": "Jada Lee" }
      ]
    },
    {
      "name": "Khulna",
      "players": [
        { "id": 37, "name": "Kevin Shah" },
        { "id": 38, "name": "Lily Morgan" },
        { "id": 39, "name": "Mohsin Ali" },
        { "id": 40, "name": "Nora Wood" }
      ]
    }
  ];

interface TeamPlayerSelectorProps {
  onPairSelect?: (player1: string, player2: string) => void;
}

const TeamPlayerSelector: React.FC<TeamPlayerSelectorProps> = ({ onPairSelect }) => {
  const [selectedTeam, setSelectedTeam] = useState<{ name: string; players: { id: number; name: string }[] } | null>(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [showSelectors, setShowSelectors] = useState(true);

  useEffect(() => {
    if (player1 && player2 && player1 !== player2) {
      onPairSelect?.(player1, player2);
      setShowSelectors(false); // Collapse dropdowns
    }
  }, [player1, player2, onPairSelect]);

  interface Player {
    id: number;
    name: string;
  }

  interface Team {
    name: string;
    players: Player[];
  }

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const teamName = e.target.value;
    const team = teamsData.find((t) => t.name === teamName) as Team | undefined;
    setSelectedTeam(team || null);
    setPlayer1("");
    setPlayer2("");
    setShowSelectors(true);
  };

  const handlePlayerChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter(e.target.value);
  };

  return (
    <div>
      <select onChange={handleTeamChange} value={selectedTeam?.name || ""}>
        <option value="">-- Select Team --</option>
        {teamsData.map((team) => (
          <option key={team.name} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>

      {selectedTeam && showSelectors && (
        <>
          <h5>Select Pair of Players from {selectedTeam.name}</h5>
          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            <select
              value={player1}
              onChange={(e) => handlePlayerChange(e, setPlayer1)}
            >
              <option value="">-- Player 1 --</option>
              {selectedTeam.players.map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>

            <select
              value={player2}
              onChange={(e) => handlePlayerChange(e, setPlayer2)}
            >
              <option value="">-- Player 2 --</option>
              {selectedTeam.players.map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          {player1 && player2 && player1 === player2 && (
            <p style={{ color: "red" }}>Please select two different players.</p>
          )}

          {player1 && player2 && player1 !== player2 && (
            <p>
              ✅ Selected Pair: <strong>{player1}</strong> & <strong>{player2}</strong>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TeamPlayerSelector;
