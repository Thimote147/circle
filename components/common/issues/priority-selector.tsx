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
import { priorities, Priority } from '@/mock-data/priorities';
import { CheckIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface PrioritySelectorProps {
   priority: Priority;
   issueId?: number;
}

export function PrioritySelector({ priority, issueId }: PrioritySelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number>(priority.priority_id);
   const [priorityData, setPriorityData] = useState<Priority[]>([]); // Etat pour stocker les priorités
   const { filterByPriority, updateIssuePriority } = useIssuesStore();

   useEffect(() => {
      const fetchPriorities = async () => {
         const fetchedPriorities = await priorities;
         setPriorityData(fetchedPriorities);
      };
      fetchPriorities();
   }, []);

   useEffect(() => {
      setValue(priority.priority_id);
   }, [priority.priority_id]);

   const handlePriorityChange = async (priorityId: number) => {
      setValue(priorityId);
      setOpen(false);

      if (issueId) {
         const newPriority = priorityData.find((p) => p.priority_id === priorityId);
         if (newPriority) {
            updateIssuePriority(issueId, newPriority);
         }
      }
   };

   return (
      <div className="*:not-first:mt-2">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="size-7 flex items-center justify-center"
                  size="icon"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
               >
                  {priorityData.length > 0 && (
                     <>
                        {priorityData
                           .filter((item) => item.priority_id === value)
                           .map((selectedItem) => {
                              const Icon = selectedItem.icon;
                              return (
                                 <Icon
                                    key={selectedItem.priority_id}
                                    className="text-muted-foreground size-4"
                                 />
                              );
                           })}
                     </>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Set priority..." />
                  <CommandList>
                     <CommandEmpty>No priority found.</CommandEmpty>
                     <CommandGroup>
                        {priorityData.map((item) => (
                           <CommandItem
                              key={item.priority_id}
                              value={item.priority_id.toString()}
                              onSelect={() => handlePriorityChange(item.priority_id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <item.icon className="text-muted-foreground size-4" />
                                 {item.name}
                              </div>
                              {value === item.priority_id && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByPriority(item.priority_id).length}
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
