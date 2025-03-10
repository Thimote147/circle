'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { statusUserColors, User, users } from '@/mock-data/users';
import { CheckIcon, CircleUserRound, Send, UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AssigneeUserProps {
   user: User | null;
}

export function AssigneeUser({ user }: AssigneeUserProps) {
   const [open, setOpen] = useState(false);
   const [currentAssignee, setCurrentAssignee] = useState<User | null>(user);
   const [userList, setUserList] = useState<User[]>([]);

   useEffect(() => {
      // Charger les utilisateurs de manière asynchrone
      const fetchUsers = async () => {
         const fetchedUsers = await users; // Si `users` est une promesse, attends qu'elle soit résolue.
         setUserList(fetchedUsers);
      };

      fetchUsers();
   }, []); // L'effet se lance une seule fois après le premier rendu

   const renderAvatar = () => {
      if (currentAssignee) {
         return (
            <Avatar className="size-6 shrink-0">
               {currentAssignee.avatarUrl ? (
                  <>
                     <AvatarImage src={currentAssignee.avatarUrl} alt={currentAssignee.username} />
                     <AvatarFallback>{currentAssignee.username}</AvatarFallback>
                  </>
               ) : (
                  <CircleUserRound className="size-5 text-zinc-600" />
               )}
            </Avatar>
         );
      } else {
         return (
            <div className="size-6 flex items-center justify-center">
               <CircleUserRound className="size-5 text-zinc-600" />
            </div>
         );
      }
   };

   return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
         <DropdownMenuTrigger asChild>
            <button className="relative w-fit focus:outline-none">
               {renderAvatar()}
               {currentAssignee && (
                  <span
                     className="border-background absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full border-2"
                     style={{ backgroundColor: statusUserColors[currentAssignee.status] }}
                  >
                     <span className="sr-only">{currentAssignee.status}</span>
                  </span>
               )}
            </button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start" className="w-[206px]">
            <DropdownMenuLabel>Assign to...</DropdownMenuLabel>
            <DropdownMenuItem
               onClick={(e) => {
                  e.stopPropagation();
                  setCurrentAssignee(null);
                  setOpen(false);
               }}
            >
               <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  <span>No assignee</span>
               </div>
               {!currentAssignee && <CheckIcon className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {userList.map((user) => (
               <DropdownMenuItem
                  key={user.user_id}
                  onClick={(e) => {
                     e.stopPropagation();
                     setCurrentAssignee(user);
                     setOpen(false);
                  }}
               >
                  <div className="flex items-center gap-2">
                     <Avatar className="h-5 w-5">
                        {user.avatarUrl ? (
                           <>
                              <AvatarImage src={user.avatarUrl} alt={user.username} />
                              <AvatarFallback>{user.username}</AvatarFallback>
                           </>
                        ) : (
                           <CircleUserRound className="size-5 text-zinc-600" />
                        )}
                     </Avatar>
                     <span>{user.username}</span>
                  </div>
                  {currentAssignee?.user_id === user.user_id && (
                     <CheckIcon className="ml-auto h-4 w-4" />
                  )}
               </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>New user</DropdownMenuLabel>
            <DropdownMenuItem>
               <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Invite and assign...</span>
               </div>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
