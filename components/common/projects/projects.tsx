'use client';

import { useEffect, useState } from 'react';
import { Project, projects } from '@/mock-data/projects';
import ProjectLine from '@/components/common/projects/project-line';

export default function Projects() {
   const [projectList, setProjectList] = useState<Project[]>([]);

   useEffect(() => {
      const fetchProjects = async () => {
         const getProjects = await projects;
         setProjectList(getProjects);
      };

      fetchProjects();
   }, []);

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[60%] sm:w-[70%] xl:w-[46%]">Title</div>
            <div className="w-[20%] sm:w-[10%] xl:w-[13%] pl-2.5">Health</div>
            <div className="hidden w-[10%] sm:block pl-2">Priority</div>
            <div className="hidden xl:block xl:w-[13%] pl-2">Lead</div>
            <div className="hidden xl:block xl:w-[13%] pl-2.5">Target date</div>
            <div className="w-[20%] sm:w-[10%] pl-2">Status</div>
         </div>

         <div className="w-full">
            {projectList.map((project) => (
               <ProjectLine key={project.project_id} project={project} />
            ))}
         </div>
      </div>
   );
}
