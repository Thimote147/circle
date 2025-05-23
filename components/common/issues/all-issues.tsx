'use client';

import { Status, status as fetchStatus } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { FC, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupIssues } from './group-issues';
import { SearchIssues } from './search-issues';
import { CustomDragLayer } from './issue-grid';
import { cn } from '@/lib/utils';

export default function AllIssues() {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';

   return (
      <div className={cn('w-full h-full', isViewTypeGrid && 'overflow-x-auto')}>
         {isSearching ? (
            <SearchIssuesView />
         ) : (
            <GroupIssuesListView isViewTypeGrid={isViewTypeGrid} />
         )}
      </div>
   );
}

const SearchIssuesView = () => (
   <div className="px-6 mb-6">
      <SearchIssues />
   </div>
);

const GroupIssuesListView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { issuesByStatus } = useIssuesStore();
   const [statuses, setStatuses] = useState<Status[]>([]);

   useEffect(() => {
      const loadStatuses = async () => {
         const data = await fetchStatus;
         setStatuses(data);
      };
      loadStatuses();
   }, []);

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {statuses.map((statusItem) => (
               <GroupIssues
                  key={statusItem.status_id}
                  status={statusItem}
                  issues={issuesByStatus[statusItem.status_id] || []}
                  count={issuesByStatus[statusItem.status_id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};
