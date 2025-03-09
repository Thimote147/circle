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
   const { data, error } = await supabase.from('teams').select('*');
   if (error) {
      console.error('Error fetching teams:', error);
      return [];
   }

   // Transform the data to match the expected structure
   const transformedData = data.map((team: Team) => ({
      ...team,
      members: [],
      projects: [],
   }));

   return transformedData as Team[];
};

export const teams: Promise<Team[]> = fetchTeams();

// export const teams: Team[] = [
//    {
//       id: 'CORE',
//       name: 'LNDev Core',
//       icon: '🛠️',
//       joined: true,
//       color: '#FF0000',
//       members: [],
//       projects: [],
//    },
//    {
//       id: 'DESIGN',
//       name: 'Design System',
//       icon: '🎨',
//       joined: true,
//       color: '#00FF00',
//       members: [],
//       projects: [],
//    },
//    {
//       id: 'PERFOMANCE',
//       name: 'Performance Lab',
//       icon: '☀️',
//       joined: true,
//       color: '#0000FF',
//       members: [],
//       projects: [],
//    },
//    {
//       id: 'UX',
//       name: 'UX Team',
//       icon: '👨🏼‍🎨',
//       joined: false,
//       color: '#FF00FF',
//       members: [],
//       projects: [],
//    },
//    {
//       id: 'DATA',
//       name: 'Data Science',
//       icon: '📊',
//       joined: false,
//       color: '#0000FF',
//       members: [],
//       projects: [],
//    },
//    {
//       id: 'MOBILE',
//       name: 'Mobile Development',
//       icon: '📱',
//       joined: false,
//       color: '#0000FF',
//       members: [],
//       projects: [],
//    },
//    {
//       id: 'WEB',
//       name: 'Web Development',
//       icon: '🌐',
//       joined: true,
//       color: '#0000FF',
//       members: [],
//       projects: [],
//    },
//    {
//       id: 'UI',
//       name: 'UI/UX Team',
//       icon: '👨🏼‍🎨',
//       joined: false,
//       color: '#FF00FF',
//       members: [],
//       projects: [],
//    },
// ];
