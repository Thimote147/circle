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
import { status as allStatus, Status } from '@/mock-data/status';
import { CheckIcon } from 'lucide-react';
import { useId, useState, useEffect } from 'react';

interface StatusWithPercentProps {
   status: Status;
   percent_complete: number;
   onStatusChange?: (statusId: number) => void;
}

export function StatusWithPercent({
   status,
   percent_complete,
   onStatusChange,
}: StatusWithPercentProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number>(status.status_id);
   const [statuses, setStatuses] = useState<Status[]>([]);

   useEffect(() => {
      async function fetchStatuses() {
         const fetchedStatuses = await allStatus;
         setStatuses(fetchedStatuses);
      }
      fetchStatuses();
   }, []);

   const handleStatusChange = (statusId: number) => {
      setValue(statusId);
      setOpen(false);

      if (onStatusChange) {
         onStatusChange(statusId);
      }
   };

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               id={id}
               className="flex items-center justify-center gap-1.5"
               size="sm"
               variant="ghost"
               role="combobox"
               aria-expanded={open}
            >
               {(() => {
                  const selectedItem = statuses.find((item) => item.status_id === value);
                  if (selectedItem) {
                     const Icon = selectedItem.icon;
                     return <Icon />;
                  }
                  return null;
               })()}
               <span className="text-xs font-medium mt-[1px]">{percent_complete}%</span>
            </Button>
         </PopoverTrigger>
         <PopoverContent className="border-input w-48 p-0" align="start">
            <Command>
               <CommandInput placeholder="Set status..." />
               <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                     {statuses.map((item) => {
                        const Icon = item.icon;
                        return (
                           <CommandItem
                              key={item.status_id}
                              value={item.status_id.toString()}
                              onSelect={(value) => handleStatusChange(Number(value))}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Icon />
                                 <span className="text-xs">{item.name}</span>
                              </div>
                              {value === item.status_id && (
                                 <CheckIcon size={14} className="ml-auto" />
                              )}
                           </CommandItem>
                        );
                     })}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
