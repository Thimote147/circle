'use client';

import { GroupIssues } from '@/components/common/group-issues';
import { Status, status } from '@/lib/mock-data/status';
import { useIssuesStore } from '@/lib/store/issues-store';
import { useSearchStore } from '@/lib/store/search-store';
import { useViewStore } from '@/lib/store/view-store';
import { SearchIssues } from './search-issues';
import { cn } from '@/lib/utils';
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

   // Si les statuts ou les issues sont encore en train de se charger, afficher un loader
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
