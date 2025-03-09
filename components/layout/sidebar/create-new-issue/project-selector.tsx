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
import { Project, projects } from '@/mock-data/projects';
import { Box, CheckIcon, FolderIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface ProjectSelectorProps {
   project: Project | undefined;
   onChange: (project: Project | undefined) => void;
}

export function ProjectSelector({ project, onChange }: ProjectSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number | undefined>(project?.project_id);
   const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);

   const { filterByProject } = useIssuesStore();

   // Fetch projects once on component mount
   useEffect(() => {
      const loadProjects = async () => {
         const loaded = await projects;
         setLoadedProjects(loaded);
      };
      loadProjects();
   }, []);

   useEffect(() => {
      setValue(project?.project_id);
   }, [project]);

   const handleProjectChange = async (projectId: number) => {
      if (projectId === 0) {
         setValue(undefined);
         onChange(undefined);
      } else {
         setValue(projectId);
         const newProject = loadedProjects.find((p) => p.project_id === projectId);
         if (newProject) {
            onChange(newProject);
         }
      }
      setOpen(false);
   };

   const selectedProject = loadedProjects.find((p) => p.project_id === value);

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
                  {selectedProject ? (
                     <>
                        <selectedProject.icon className="size-4" />
                        <span>{selectedProject.name}</span>
                     </>
                  ) : (
                     <Box className="size-4" />
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Set project..." />
                  <CommandList>
                     <CommandEmpty>No projects found.</CommandEmpty>
                     <CommandGroup>
                        <CommandItem
                           value="no-project"
                           onSelect={() => handleProjectChange(0)}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <FolderIcon className="size-4" />
                              No Project
                           </div>
                           {value === undefined && <CheckIcon size={16} className="ml-auto" />}
                        </CommandItem>
                        {loadedProjects.map((project) => (
                           <CommandItem
                              key={project.project_id}
                              value={project.project_id.toString()}
                              onSelect={() => handleProjectChange(project.project_id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <project.icon className="size-4" />
                                 {project.name}
                              </div>
                              {value === project.project_id && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByProject(project.project_id).length}
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
