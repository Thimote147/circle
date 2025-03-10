import { supabase } from '@/utils/supabaseClient';
import { Team } from './teams';

export interface User {
   user_id: number;
   firstname: string;
   lastname: string;
   username: string;
   password: string;
   avatarUrl: string;
   email: string;
   status: 'online' | 'offline' | 'away';
   role: 'Member' | 'Admin' | 'Guest';
   joinedDate: string;
   teams: Team[];
}

export const statusUserColors = {
   online: '#00cc66',
   offline: '#969696',
   away: '#ffcc00',
};

const fetchUsers = async () => {
   const { data, error } = await supabase.rpc('get_users').select('*');
   if (error) {
      console.error('Error fetching users:', error);
      return [];
   }

   // Transform the data to match the expected structure
   const transformedData = data.map((user: User) => ({
      ...user,
      status: user.status || 'offline',
   }));

   return transformedData as User[];
};

export const users: Promise<User[]> = fetchUsers();
