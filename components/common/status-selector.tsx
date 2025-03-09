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
import { status as allStatus, Status } from '@/lib/mock-data/status';
import { useIssuesStore } from '@/lib/store/issues-store';
import { CheckIcon } from 'lucide-react';
import { useId, useState, useEffect } from 'react';

interface StatusSelectorProps {
   status: Status;
   issueId: number;
}

export function StatusSelector({ status, issueId }: StatusSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number>(status.status_id);
   const [statusList, setStatusList] = useState<Status[]>([]);
   const { updateIssueStatus, filterByStatus } = useIssuesStore();

   // Load the status list asynchronously on component mount
   useEffect(() => {
      const fetchStatuses = async () => {
         const statuses = await allStatus;
         setStatusList(statuses);
      };
      fetchStatuses();
   }, []);

   useEffect(() => {
      setValue(status.status_id);
   }, [status.status_id]);

   const handleStatusChange = (statusId: number) => {
      setValue(statusId);
      setOpen(false);

      if (issueId) {
         const newStatus = statusList.find((s) => s.status_id === statusId);
         if (newStatus) {
            updateIssueStatus(issueId, newStatus);
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
                  {statusList.length > 0 && (
                     <>{statusList.find((item) => item.status_id === value)?.icon ?? null}</>
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
                        {statusList.map((item) => (
                           <CommandItem
                              key={item.status_id}
                              value={item.status_id}
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
