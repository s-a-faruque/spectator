'use client';
import TournamentTeamManager from '../../../components/TournamentTeamManager';
import styles from '../../../../scorer/badminton.module.css';
import Image from "next/image";
import Link from "next/link";

interface Params {
  id: string;
}

// export default function TournamentGroupPage({ params }: { params: Params }) {
//   const { id } = params;
//   console.log("Tournament ID:", id);
//   return (
//     <main className={styles.main}>
//       <header className={styles.header}>
//         <h1>
//           <Link className={styles.home} href="/badminton/admin/tournament">
//               <Image
//                 src="/homepage.png"
//                 alt="Home Icon"
//                 width={16}
//                 height={16}
//               />
//           </Link>
//           Admin Groups Home
//         </h1>
        
//       </header>
//       <div className={styles.primaryContent}>
//         <div className={styles.matchesList}>
//             <TournamentTeamManager tournamentId={id}/>
//         </div>
//       </div>
//     </main>
//   );
// }
// 'use client';


import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const sampleTeams = [
  { id: 't1', name: 'Smash Bros' },
  { id: 't2', name: 'Shuttle Shockers' },
  { id: 't3', name: 'Drop Shotters' },
  { id: 't4', name: 'Ace Hunters' },
  { id: 't5', name: 'Net Ninjas' }
];

export default function GroupAssignmentPage() {
  const [groupCount, setGroupCount] = useState(2);
  const [groups, setGroups] = useState<{ [key: string]: string[] }>({});
  const [teams, setTeams] = useState(sampleTeams);

  const GROUP_STORAGE_KEY = 'dnd_groups';

  // Create groups like { Group A: [], Group B: [] }
  const createGroups = () => {
    const newGroups: { [key: string]: string[] } = {};
    for (let i = 0; i < groupCount; i++) {
      const groupName = `Group ${String.fromCharCode(65 + i)}`; // A, B, C...
      newGroups[groupName] = [];
    }
    newGroups['Unassigned'] = teams.map(t => t.id);
    setGroups(newGroups);
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(newGroups));
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(GROUP_STORAGE_KEY);
    if (saved) {
      setGroups(JSON.parse(saved));
    } else {
      createGroups();
    }
  }, []);

  const getTeamById = (id: string) => teams.find(t => t.id === id);

  // Drag handler
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceGroup = source.droppableId;
    const destGroup = destination.droppableId;

    const sourceItems = Array.from(groups[sourceGroup]);
    const destItems = Array.from(groups[destGroup]);
    const [moved] = sourceItems.splice(source.index, 1);

    destItems.splice(destination.index, 0, moved);

    const newGroups = {
      ...groups,
      [sourceGroup]: sourceItems,
      [destGroup]: destItems
    };

    setGroups(newGroups);
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(newGroups));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Group Assignment</h2>

      <div className="mb-4">
        <input
          type="number"
          value={groupCount}
          min={1}
          onChange={e => setGroupCount(Number(e.target.value))}
          className="border px-2 py-1 mr-2"
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={createGroups}
        >
          Create Groups
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(groups).map(([groupName, teamIds]) => (
            <Droppable droppableId={groupName} key={groupName}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded shadow"
                >
                  <h3 className="font-semibold mb-2">{groupName}</h3>
                  {teamIds.map((teamId, index) => {
                    const team = getTeamById(teamId);
                    return (
                      <Draggable
                        key={teamId}
                        draggableId={teamId}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white border p-2 mb-2 rounded"
                          >
                            {team?.name}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
