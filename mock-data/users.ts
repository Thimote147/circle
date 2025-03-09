import { supabase } from '@/utils/supabaseClient';

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
   teamIds: string[];
}

const fetchUsers = async () => {
   const { data, error } = await supabase.from('users').select('*');
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
