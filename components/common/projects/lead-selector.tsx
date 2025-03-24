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
import { users, User } from '@/mock-data/users';
import { CheckIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useId, useState, useEffect } from 'react';

interface LeadSelectorProps {
   lead: User;
   onLeadChange?: (userId: number) => void;
}

export function LeadSelector({ lead, onLeadChange }: LeadSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number>(lead.user_id);
   const [userList, setUserList] = useState<User[]>([]);

   useEffect(() => {
      async function fetchUsers() {
         const usersData = await users;
         setUserList(usersData);
      }
      fetchUsers();
   }, []);

   const handleLeadChange = (userId: number) => {
      setValue(userId);
      setOpen(false);

      if (onLeadChange) {
         onLeadChange(userId);
      }
   };

   return (
      <div>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="flex items-center justify-center gap-1 h-7 px-2"
                  size="sm"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
               >
                  {(() => {
                     const selectedUser = userList.find((user) => user.user_id === value);
                     if (selectedUser) {
                        return (
                           <>
                              <Avatar className="size-5 mr-1">
                                 <AvatarImage
                                    src={selectedUser.avatarUrl}
                                    alt={selectedUser.username}
                                 />
                                 <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs hidden md:inline">
                                 {selectedUser.username}
                              </span>
                           </>
                        );
                     }
                     return null;
                  })()}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="border-input w-48 p-0" align="start">
               <Command>
                  <CommandInput placeholder="Set lead..." />
                  <CommandList>
                     <CommandEmpty>No user found.</CommandEmpty>
                     <CommandGroup>
                        {userList.map((user) => (
                           <CommandItem
                              key={user.user_id}
                              value={user.user_id.toString()}
                              onSelect={(value) => handleLeadChange(Number(value))}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Avatar className="size-5">
                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                 <span className="text-xs">{user.username}</span>
                              </div>
                              {value === user.user_id && (
                                 <CheckIcon size={14} className="ml-auto" />
                              )}
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
