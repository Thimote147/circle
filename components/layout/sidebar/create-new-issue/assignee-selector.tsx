'use client';

import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIssuesStore } from '@/store/issues-store';
import { User, users as fetchUsers } from '@/mock-data/users';
import { CheckIcon, UserCircle } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AssigneeSelectorProps {
   assignee: User | null;
   onChange: (assignee: User | null) => void;
}

export function AssigneeSelector({ assignee, onChange }: AssigneeSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState(false);
   const [value, setValue] = useState<number | null>(assignee?.user_id || null);
   const [users, setUsers] = useState<User[]>([]);

   const { filterByAssignee } = useIssuesStore();

   useEffect(() => {
      setValue(assignee?.user_id || null);
   }, [assignee]);

   useEffect(() => {
      // Simuler le chargement des utilisateurs
      const loadUsers = async () => {
         const data = await fetchUsers; // Assure-toi que fetchUsers est une promesse
         setUsers(data);
      };
      loadUsers();
   }, []);

   const handleAssigneeChange = (userId: number | null) => {
      const selectedUser = users.find((u) => u.user_id === userId) || null;
      setValue(userId);
      onChange(selectedUser);
      setOpen(false);
   };

   const selectedUser = users.find((user) => user.user_id === value);

   return (
      <div className="*:not-first:mt-2">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="flex items-center justify-center gap-2"
                  size="xs"
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
               >
                  {selectedUser ? (
                     <Avatar className="size-5">
                        <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.username} />
                        <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                     </Avatar>
                  ) : (
                     <UserCircle className="size-5" />
                  )}
                  <span>{selectedUser ? selectedUser.username : 'Unassigned'}</span>
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Assign to..." />
                  <CommandList>
                     <CommandEmpty>No users found.</CommandEmpty>
                     <CommandGroup>
                        <CommandItem
                           value="unassigned"
                           onSelect={() => handleAssigneeChange(null)}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <UserCircle className="size-5" />
                              Unassigned
                           </div>
                           {value === null && <CheckIcon size={16} className="ml-auto" />}
                           <span className="text-muted-foreground text-xs">
                              {filterByAssignee(null).length}
                           </span>
                        </CommandItem>
                        {users.map((user) => (
                           <CommandItem
                              key={user.user_id}
                              value={String(user.user_id)}
                              onSelect={() => handleAssigneeChange(user.user_id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Avatar className="size-5">
                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                 {user.username}
                              </div>
                              {value === user.user_id && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByAssignee(user.user_id).length}
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
}
