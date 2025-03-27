'use client';

import { useEffect, useState } from 'react';
import { Team, teams } from '@/mock-data/teams';
import TeamLine from './team-line';

export default function Teams() {
   const [teamData, setTeamData] = useState<Team[]>([]);

   useEffect(() => {
      const fetchTeams = async () => {
         const data = await teams;
         setTeamData(data);
      };

      fetchTeams();
   }, []);

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[70%] sm:w-[50%] md:w-[45%] lg:w-[40%]">Name</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Membership</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Identifier</div>
            <div className="w-[30%] sm:w-[20%] md:w-[15%]">Members</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Projects</div>
         </div>

         <div className="w-full">
            {teamData.map((team) => (
               <TeamLine key={team.team_id} team={team} />
            ))}
         </div>
      </div>
   );
}
