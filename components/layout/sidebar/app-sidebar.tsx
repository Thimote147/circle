'use client';

import { RiGithubLine } from '@remixicon/react';
import { Box, ContactRound, FolderKanban, Inbox, UserRound } from 'lucide-react';
import * as React from 'react';

import { HelpButton } from '@/components/layout/sidebar/help-button';
import { NavInbox } from '@/components/layout/sidebar/nav-inbox';
import { NavTeams } from '@/components/layout/sidebar/nav-teams';
import { NavWorkspace } from '@/components/layout/sidebar/nav-workspace';
import { OrgSwitcher } from '@/components/layout/sidebar/org-switcher';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { Team, teams } from '@/mock-data/teams';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const data = {
   inbox: [
      {
         name: 'Inbox',
         url: '#',
         icon: Inbox,
      },
      {
         name: 'My issues',
         url: '#',
         icon: FolderKanban,
      },
   ],
   workspace: [
      {
         name: 'Teams',
         url: '/rb-tech-sa/teams',
         icon: ContactRound,
      },
      {
         name: 'Projects',
         url: '/rb-tech-sa/projects',
         icon: Box,
      },
      {
         name: 'Members',
         url: '/rb-tech-sa/members',
         icon: UserRound,
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const [teamList, setTeamList] = useState<Team[]>([]);

   useEffect(() => {
      const fetchTeams = async () => {
         const data = await teams;
         setTeamList(data);
      };
      fetchTeams();
   }, []);

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <OrgSwitcher />
         </SidebarHeader>
         <SidebarContent>
            <NavInbox inbox={data.inbox} />
            <NavWorkspace workspace={data.workspace} />
            <NavTeams items={teamList.filter((t) => t.joined)} />
         </SidebarContent>
         <SidebarFooter>
            <div className="w-full flex flex-col gap-2">
               <div className="w-full flex items-center justify-between">
                  <HelpButton />
                  <Button size="icon" variant="secondary" asChild>
                     <Link
                        href="https://github.com/Thimote147/circle"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <RiGithubLine className="size-4" />
                     </Link>
                  </Button>
               </div>
            </div>
         </SidebarFooter>
      </Sidebar>
   );
}
