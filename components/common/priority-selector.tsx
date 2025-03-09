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
import { priorities, Priority } from '@/lib/mock-data/priorities';
import { useIssuesStore } from '@/lib/store/issues-store';
import { CheckIcon } from 'lucide-react';
import { useId, useState, useEffect } from 'react';

interface PrioritySelectorProps {
   priority: Priority;
   issueId?: number;
}

export function PrioritySelector({ priority, issueId }: PrioritySelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number>(priority.priority_id);

   const { filterByPriority, updateIssuePriority } = useIssuesStore();

   useEffect(() => {
      setValue(priority.priority_id);
   }, [priority.priority_id]);

   const handlePriorityChange = (priorityId: number) => {
      setValue(priorityId);
      setOpen(false);

      if (issueId) {
         const newPriority = priorities.find((p) => p.priority_id === priorityId);
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
                  {(() => {
                     const selectedItem = priorities.find((item) => item.priority_id === value);
                     if (selectedItem) {
                        const Icon = selectedItem.icon;
                        return <Icon className="text-muted-foreground size-4" />;
                     }
                     return null;
                  })()}
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
                        {priorities.map((item) => (
                           <CommandItem
                              key={item.priority_id}
                              value={item.priority_id}
                              onSelect={handlePriorityChange}
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
