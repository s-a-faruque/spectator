"use client";
import React, { useState, useEffect } from "react";

const teamsData = [
    {
      "name": "Dhaka",
      "players": [
        { "id": 1, "name": "Labib" },
        { "id": 2, "name": "Kallol" },
        { "id": 3, "name": "Rabbi" },
        { "id": 4, "name": "Biplob" }
      ]
    },
    {
      "name": "Sylhet",
      "players": [
        { "id": 5, "name": "Jamil" },
        { "id": 6, "name": "Afsar" },
        { "id": 7, "name": "Aktar" },
        { "id": 8, "name": "Wahed" }
      ]
    },
    {
      "name": "Rajshahi",
      "players": [
        { "id": 9, "name": "Rasel" },
        { "id": 10, "name": "Ahnaf" },
        { "id": 11, "name": "Anwer" },
        { "id": 12, "name": "Masroor" }
      ]
    },
    {
      "name": "Cumilla",
      "players": [
        { "id": 13, "name": "Zilani" },
        { "id": 14, "name": "Bappi" },
        { "id": 15, "name": "Fahim" },
        { "id": 16, "name": "Rubayet" }
      ]
    },
    {
      "name": "Cox's Bazar",
      "players": [
        { "id": 17, "name": "Faruqi" },
        { "id": 18, "name": "Rajesh" },
        { "id": 19, "name": "Hasan" },
        { "id": 20, "name": "Nayeem" }
      ]
    },
    {
      "name": "Barishal",
      "players": [
        { "id": 21, "name": "Babu" },
        { "id": 22, "name": "Nuzair" },
        { "id": 23, "name": "Adnan" },
        { "id": 24, "name": "Nageeb" }
      ]
    },
    {
      "name": "Chattogram",
      "players": [
        { "id": 25, "name": "Tomal" },
        { "id": 26, "name": "Rabbani" },
        { "id": 27, "name": "Sazidy" },
        { "id": 28, "name": "Sifat" }
      ]
    },
    {
      "name": "Mymensingh",
      "players": [
        { "id": 29, "name": "Farhad" },
        { "id": 30, "name": "Shakil" },
        { "id": 31, "name": "Sakib" },
        { "id": 32, "name": "Kamal" }
      ]
    },
    {
      "name": "Rangpur",
      "players": [
        { "id": 33, "name": "Khalid" },
        { "id": 34, "name": "Redwan" },
        { "id": 35, "name": "Monirul" },
        { "id": 36, "name": "Shoaib" }
      ]
    },
    {
      "name": "Khulna",
      "players": [
        { "id": 37, "name": "Nohel" },
        { "id": 38, "name": "Mansif" },
        { "id": 39, "name": "Sanin" },
        { "id": 40, "name": "Tauhid" }
      ]
    }
  ];

interface TeamPlayerSelectorProps {
  onPairSelect?: (teamName: string, player1: string, player2: string) => void;
}

const TeamPlayerSelector: React.FC<TeamPlayerSelectorProps> = ({ onPairSelect }) => {
  const [selectedTeam, setSelectedTeam] = useState<{ name: string; players: { id: number; name: string }[] } | null>(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [showSelectors, setShowSelectors] = useState(true);

  useEffect(() => {
    if (player1 && player2 && player1 !== player2) {
      onPairSelect?.(selectedTeam?.name || "", player1, player2);
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
