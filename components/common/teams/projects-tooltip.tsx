'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/mock-data/projects';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import {
   BacklogIcon,
   PausedIcon,
   ToDoIcon,
   InProgressIcon,
   TechnicalReviewIcon,
   CompletedIcon,
} from '@/mock-data/status';

interface ProjectsTooltipProps {
   projects: Project[];
}

const iconMap: { [key: string]: React.FC } = {
   BacklogIcon,
   PausedIcon,
   ToDoIcon,
   InProgressIcon,
   TechnicalReviewIcon,
   CompletedIcon,
};

export function ProjectsTooltip({ projects }: ProjectsTooltipProps) {
   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <div className="flex items-center gap-2 cursor-pointer">
                  <Icons.Box className="size-4" />
                  <span>{projects.length}</span>
               </div>
            </TooltipTrigger>
            <TooltipContent className="p-2">
               <div className="flex flex-col gap-1">
                  {projects.map((project, index) => {
                     let ProjectIcon: LucideIcon = Icons.Box;
                     const iconName = String(project.icon);
                     if (typeof iconName === 'string' && iconName in Icons) {
                        ProjectIcon = Icons[iconName as keyof typeof Icons] as LucideIcon;
                     }

                     const StatusIconComponent =
                        typeof project.status.icon === 'string' &&
                        Object.keys(iconMap).includes(project.status.icon)
                           ? iconMap[project.status.icon]
                           : Icons.Circle;

                     return (
                        <div key={index} className="flex items-center gap-1.5">
                           <ProjectIcon className="size-4 shrink-0" />
                           <span className="text-sm w-full text-left">{project?.name}</span>
                           <div className="shrink-0">
                              <StatusIconComponent />
                           </div>
                        </div>
                     );
                  })}
               </div>
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}
