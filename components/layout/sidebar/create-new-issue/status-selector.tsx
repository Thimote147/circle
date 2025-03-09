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
import { status as allStatus, Status } from '@/mock-data/status';
import { CheckIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface StatusSelectorProps {
   status: Status;
   onChange: (status: Status) => void;
}

export function StatusSelector({ status, onChange }: StatusSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number>(status.status_id);
   const [statuses, setStatuses] = useState<Status[]>([]);

   const { filterByStatus } = useIssuesStore();

   // Fetch statuses asynchronously once the component is mounted
   useEffect(() => {
      const loadStatuses = async () => {
         const statusesData = await allStatus;
         setStatuses(statusesData);
      };
      loadStatuses();
   }, []);

   useEffect(() => {
      setValue(status.status_id);
   }, [status.status_id]);

   const handleStatusChange = async (statusId: number) => {
      setValue(statusId);
      setOpen(false);

      const newStatus = statuses.find((s) => s.status_id === statusId);
      if (newStatus) {
         onChange(newStatus);
      }
   };

   const selectedStatus = statuses.find((s) => s.status_id === value);

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
                  {selectedStatus ? (
                     <>
                        <selectedStatus.icon />
                        <span>{selectedStatus.name}</span>
                     </>
                  ) : (
                     'To do'
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Set status..." />
                  <CommandList>
                     <CommandEmpty>No status found.</CommandEmpty>
                     <CommandGroup>
                        {statuses.map((item) => (
                           <CommandItem
                              key={item.status_id}
                              value={item.status_id.toString()}
                              onSelect={() => handleStatusChange(item.status_id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <item.icon />
                                 {item.name}
                              </div>
                              {value === item.status_id && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByStatus(item.status_id).length}
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
