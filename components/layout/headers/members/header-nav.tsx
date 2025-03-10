'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { users } from '@/mock-data/users';
import { Plus } from 'lucide-react';
import { ThemeToggle } from '../../theme-toggle';

export default function HeaderNav() {
   const [userCount, setUserCount] = useState<number | null>(null);

   useEffect(() => {
      async function fetchUsers() {
         const allUsers = await users;
         setUserCount(allUsers.length);
      }
      fetchUsers();
   }, []);

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2">
            <SidebarTrigger className="" />
            <div className="flex items-center gap-1">
               <span className="text-sm font-medium">Members</span>
               <span className="text-xs bg-accent rounded-md px-1.5 py-1">
                  {userCount !== null ? userCount : '...'}
               </span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button className="relative" size="xs" variant="secondary">
               <Plus className="size-4" />
               Invite
            </Button>
         </div>
      </div>
   );
}
