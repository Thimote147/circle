'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as Icons from 'lucide-react';
import { Project } from '@/mock-data/projects';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface HealthPopoverProps {
   project: Project;
}

export function HealthPopover({ project }: HealthPopoverProps) {
   const getHealthIcon = (healthId: number) => {
      switch (healthId) {
         case 3:
            return <Icons.CircleCheck className="size-4 text-green-500" />;
         case 2:
            return <Icons.CircleX className="size-4 text-red-500" />;
         case 4:
            return <Icons.AlertCircle className="size-4 text-amber-500" />;
         case 1:
         default:
            return <Icons.HelpCircle className="size-4 text-muted-foreground" />;
      }
   };

   const isMobile = useIsMobile();

   const IconComponent = Icons[project.icon as keyof typeof Icons] as LucideIcon;

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               className="flex items-center justify-center gap-1 h-7 px-2"
               size="sm"
               variant="ghost"
            >
               {getHealthIcon(project.health.health_id)}
               <span className="text-xs mt-[1px] ml-0.5 hidden xl:inline">
                  {project.health.name}
               </span>
            </Button>
         </PopoverTrigger>
         <PopoverContent
            side={isMobile ? 'bottom' : 'left'}
            className={cn('p-0 w-[480px]', isMobile ? 'w-full' : '')}
         >
            <div className="flex items-center justify-between border-b p-3">
               <div className="flex items-center gap-2">
                  {IconComponent && (
                     <IconComponent className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <h4 className="font-medium text-sm">{project.name}</h4>
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                     Subscribe
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     className="h-7 px-2 text-xs flex items-center gap-1"
                  >
                     <Icons.Bell className="size-3" />
                     New update
                  </Button>
               </div>
            </div>
            <div className="p-3 space-y-3">
               <div className="flex items-center justify-start gap-3">
                  <div className="flex items-center gap-2">
                     {getHealthIcon(project.health.health_id)}
                     <span className="text-sm">{project.health.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Avatar className="size-5">
                        <AvatarImage src={project.lead.avatarUrl} alt={project.lead.username} />
                        <AvatarFallback>{project.lead.username.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <span className="text-xs text-muted-foreground">{project.lead.username}</span>
                     <span className="text-xs text-muted-foreground">·</span>
                     <span className="text-xs text-muted-foreground">
                        {new Date(project.start_date).toLocaleDateString()}
                     </span>
                  </div>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">{project.health.description}</p>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
}
