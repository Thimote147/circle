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
import { LabelInterface, labels } from '@/mock-data/labels';
import { CheckIcon, TagIcon } from 'lucide-react';
import { useId, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LabelSelectorProps {
   selectedLabels: LabelInterface[];
   onChange: (labels: LabelInterface[]) => void;
}

export function LabelSelector({ selectedLabels, onChange }: LabelSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [labelList, setLabelList] = useState<LabelInterface[]>([]);

   const { filterByLabel } = useIssuesStore();

   useEffect(() => {
      const fetchLabels = async () => {
         const fetchedLabels = await labels;
         setLabelList(fetchedLabels);
      };

      fetchLabels();
   }, []);

   const handleLabelToggle = (label: LabelInterface) => {
      const isSelected = selectedLabels.some((l) => l.label_id === label.label_id);
      let newLabels: LabelInterface[];

      if (isSelected) {
         newLabels = selectedLabels.filter((l) => l.label_id !== label.label_id);
      } else {
         newLabels = [...selectedLabels, label];
      }

      onChange(newLabels);
   };

   return (
      <div className="*:not-first:mt-2">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className={cn(
                     'flex items-center justify-center',
                     selectedLabels.length === 0 && 'size-7'
                  )}
                  size={selectedLabels.length > 0 ? 'xs' : 'icon'}
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
               >
                  <TagIcon className="size-4" />
                  {selectedLabels.length > 0 && (
                     <div className="flex -space-x-0.5">
                        {selectedLabels.map((label) => (
                           <div
                              key={label.label_id}
                              className={`size-3 rounded-full`}
                              style={{ backgroundColor: label.color }}
                           />
                        ))}
                     </div>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Search labels..." />
                  <CommandList>
                     <CommandEmpty>No labels found.</CommandEmpty>
                     <CommandGroup>
                        {labelList.map((label) => {
                           const isSelected = selectedLabels.some(
                              (l) => l.label_id === label.label_id
                           );
                           return (
                              <CommandItem
                                 key={label.label_id}
                                 value={label.label_id.toString()}
                                 onSelect={() => handleLabelToggle(label)}
                                 className="flex items-center justify-between"
                              >
                                 <div className="flex items-center gap-2">
                                    <div
                                       className={`size-3 rounded-full`}
                                       style={{ backgroundColor: label.color }}
                                    />
                                    <span>{label.name}</span>
                                 </div>
                                 {isSelected && <CheckIcon size={16} className="ml-auto" />}
                                 <span className="text-muted-foreground text-xs">
                                    {filterByLabel(label.label_id).length}
                                 </span>
                              </CommandItem>
                           );
                        })}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
}
