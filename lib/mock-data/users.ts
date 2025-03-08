import { supabase } from '@/utils/supabaseClient';

export interface User {
   user_id: string;
   firstname: string;
   lastname: string;
   username: string;
   password: string;
   avatarUrl: string;
   email: string;
   status: 'online' | 'offline' | 'away';
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

   console.log('Fetched users:', transformedData);

   return transformedData as User[];
};

export const users: User[] = await fetchUsers();
