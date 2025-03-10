'use client';

import { useEffect, useState } from 'react';
import { User, users } from '@/mock-data/users';
import MemberLine from './member-line';

export default function Members() {
   const [userList, setUserList] = useState<User[]>([]);

   useEffect(() => {
      const fetchUsers = async () => {
         // Assuming `users` is a promise or async data source
         const data = await users;
         setUserList(data);
      };

      fetchUsers();
   }, []); // Empty dependency array to run only once when the component mounts

   return (
      <div>
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[30%]">Name</div>
            <div className="w-[20%]">Status</div>
            <div className="w-[20%]">Joined</div>
            <div className="w-[30%]">Teams</div>
         </div>

         <div className="w-full flex flex-col items-center">
            {userList.map((user) => (
               <MemberLine key={user.user_id} user={user} />
            ))}
         </div>
      </div>
   );
}
