'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/mock-data/projects';
import * as Icons from 'lucide-react';
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
   const isValidIcon = (icon: string): icon is keyof typeof Icons => {
      return icon in Icons;
   };

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
                     const ProjectIcon = isValidIcon(project.icon)
                        ? Icons[project.icon]
                        : Icons.Box;
                     const StatusIcon =
                        iconMap[project.status.icon as keyof typeof iconMap] || Icons.Circle;
                     return (
                        <div key={index} className="flex items-center gap-1.5">
                           <ProjectIcon className="size-4 shrink-0" />
                           <span className="text-sm w-full text-left">{project?.name}</span>
                           <div className="shrink-0">
                              <StatusIcon />
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
