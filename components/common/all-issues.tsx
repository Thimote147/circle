'use client';

import { GroupIssues } from '@/components/common/group-issues';
import { useIssuesStore } from '@/store/issues-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { cn } from '@/lib/utils';
import { Status, status } from '@/mock-data/status';
import { SearchIssues } from './search-issues';
import { useEffect, useState } from 'react';

export default function AllIssues() {
   const { issuesByStatus } = useIssuesStore();
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const [statusList, setStatusList] = useState<Status[]>([]);
   const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false);
   const [isLoadingIssues, setIsLoadingIssues] = useState<boolean>(false);

   useEffect(() => {
      const fetchStatus = async () => {
         const fetchedStatus = await status;
         setStatusList(fetchedStatus);
         setIsLoadingStatus(true);
      };
      fetchStatus();
   }, []);

   useEffect(() => {
      if (issuesByStatus && Object.keys(issuesByStatus).length > 0) {
         setIsLoadingIssues(true);
      }
   }, [issuesByStatus]);

   if (!isLoadingStatus || !isLoadingIssues) {
      return <div>Loading...</div>;
   }

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
