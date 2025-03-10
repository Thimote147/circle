'use client';

import { GroupIssues } from '@/components/common/issues/group-issues';
import { cn } from '@/lib/utils';
import { Status, status } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { SearchIssues } from './search-issues';
import { useEffect, useState } from 'react';

export default function AllIssues() {
   const { issuesByStatus } = useIssuesStore();
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const [statusList, setStatusList] = useState<Status[]>([]);

   useEffect(() => {
      const fetchStatus = async () => {
         const fetchedStatus = await status;
         setStatusList(fetchedStatus);
      };

      fetchStatus();
   }, []);

   return (
      <div className={cn('w-full h-full', viewType === 'grid' ? 'overflow-x-auto' : '')}>
         {isSearchOpen && searchQuery.trim() !== '' ? (
            <div className="px-6 mb-6">
               <SearchIssues />
            </div>
         ) : viewType === 'list' ? (
            <div>
               {statusList.map((statusItem) => (
                  <GroupIssues
                     key={statusItem.status_id}
                     status={statusItem}
                     issues={issuesByStatus[statusItem.status_id] || []}
                     count={issuesByStatus[statusItem.status_id]?.length || 0}
                  />
               ))}
            </div>
         ) : (
            <div className="flex h-full gap-3 px-2 py-2 min-w-max">
               {statusList.map((statusItem) => (
                  <GroupIssues
                     key={statusItem.status_id}
                     status={statusItem}
                     issues={issuesByStatus[statusItem.status_id] || []}
                     count={issuesByStatus[statusItem.status_id]?.length || 0}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
