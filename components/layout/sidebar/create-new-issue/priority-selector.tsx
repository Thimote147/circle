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
   onChange: (priority: Priority) => void;
}

export function PrioritySelector({ priority, onChange }: PrioritySelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number>(priority.priority_id);
   const [loadedPriorities, setLoadedPriorities] = useState<Priority[]>([]);

   const { filterByPriority } = useIssuesStore();

   // Fetch priorities once on component mount
   useEffect(() => {
      const loadPriorities = async () => {
         const loaded = await priorities;
         setLoadedPriorities(loaded);
      };
      loadPriorities();
   }, []);

   useEffect(() => {
      setValue(priority.priority_id);
   }, [priority.priority_id]);

   const handlePriorityChange = async (priorityId: number) => {
      setValue(priorityId);
      setOpen(false);

      const newPriority = loadedPriorities.find((p) => p.priority_id === priorityId);
      if (newPriority) {
         onChange(newPriority);
      }
   };

   const selectedPriority = loadedPriorities.find((item) => item.priority_id === value);

   return (
      <div className="*:not-first:mt-2">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="flex items-center justify-center"
                  size="xs"
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
               >
                  {selectedPriority ? (
                     <>
                        <selectedPriority.icon className="text-muted-foreground size-4" />
                        <span>{selectedPriority.name}</span>
                     </>
                  ) : (
                     'No priority'
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
                        {loadedPriorities.map((item) => (
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
