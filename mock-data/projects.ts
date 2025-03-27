import { Status, status } from './status';
import * as Icons from 'lucide-react';
import { RemixiconComponentType } from '@remixicon/react';
import { User, users } from './users';
import { Priority, priorities } from './priorities';
import { supabase } from '@/utils/supabaseClient';
import { LucideIcon } from 'lucide-react';

export interface Project {
   project_id: number;
   name: string;
   status: Status;
   icon: LucideIcon | RemixiconComponentType;
   percent_complete: number;
   start_date: string;
   lead: User;
   priority: Priority;
   health: Health;
}

const fetchProjects = async () => {
   const { data, error } = await supabase.rpc('get_projects');

   if (error) {
      console.error('Error fetching projects:', error);
      return [];
   }

   return data as Project[];
};

export const projects: Promise<Project[]> = fetchProjects();

interface Health {
   health_id: number;
   name: string;
   color: string;
   description: string;
}
