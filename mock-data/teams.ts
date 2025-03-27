import { supabase } from '@/utils/supabaseClient';
import { Project } from './projects';
import { User } from './users';

export interface Team {
   team_id: number;
   name: string;
   icon: string;
   joined: boolean;
   color: string;
   members: User[];
   projects: Project[];
}

const fetchTeams = async () => {
   const { data, error } = await supabase.rpc('get_teams');
   if (error) {
      console.error('Error fetching teams:', error);
      return [];
   }

   return data as Team[];
};

export const teams: Promise<Team[]> = fetchTeams();
