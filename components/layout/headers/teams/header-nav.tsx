'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { teams } from '@/mock-data/teams';
import { Plus } from 'lucide-react';

export default function HeaderNav() {
   const [teamCount, setTeamCount] = useState(0);

   useEffect(() => {
      async function fetchTeams() {
         try {
            const teamData = await teams;
            setTeamCount(teamData.length);
         } catch (error) {
            console.error('Failed to fetch teams:', error);
         }
      }
      fetchTeams();
   }, []);

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2">
            <SidebarTrigger className="" />
            <div className="flex items-center gap-1">
               <span className="text-sm font-medium">Teams</span>
               <span className="text-xs bg-accent rounded-md px-1.5 py-1">{teamCount}</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Button className="relative" size="xs" variant="secondary">
               <Plus className="size-4" />
               Add team
            </Button>
         </div>
      </div>
   );
}
