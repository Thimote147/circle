'use client';

import { GroupIssues } from '@/components/common/group-issues';
import { status } from '@/lib/mock-data/status';
import { useIssuesStore } from '@/lib/store/issues-store';
import { useSearchStore } from '@/lib/store/search-store';
import { useViewStore } from '@/lib/store/view-store';
import { SearchIssues } from './search-issues';
import { cn } from '@/lib/utils';

export default function AllIssues() {
   const { issuesByStatus } = useIssuesStore();
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();

   return (
      <div className={cn('w-full h-full', viewType === 'grid' ? 'overflow-x-auto' : '')}>
         {isSearchOpen && searchQuery.trim() !== '' ? (
            <div className="px-6 mb-6">
               <SearchIssues />
            </div>
         ) : viewType === 'list' ? (
            <div>
               {status.map((statusItem) => (
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
               {status.map((statusItem) => (
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
