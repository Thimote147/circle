import { Status } from './status';
import { LucideIcon } from 'lucide-react';
import { RemixiconComponentType } from '@remixicon/react';
import { supabase } from '@/utils/supabaseClient';

export interface Project {
   project_id: number;
   name: string;
   status: Status;
   icon: LucideIcon | RemixiconComponentType;
   percentComplete: number;
   startDate: string;
}

const fetchProjects = async () => {
   const { data, error } = await supabase.from('projects').select('*');

   if (error) {
      console.error('Error fetching projects:', error);
      return [];
   }

   return data as Project[];
};

export const projects: Promise<Project[]> = fetchProjects();
