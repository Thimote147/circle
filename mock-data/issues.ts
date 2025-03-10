import { LabelInterface } from './labels';
import { Project } from './projects';
import { User } from './users';
import { Priority } from './priorities';
import { Status } from './status';
import { supabase } from '@/utils/supabaseClient';

export interface Issue {
   issue_id: number;
   identifier: string;
   title: string;
   description: string;
   status: Status;
   assignees: User | null;
   priority: Priority;
   labels: LabelInterface[];
   createdAt: string;
   cycleId: number;
   project?: Project;
   subissues?: number[];
}

const fetchIssues = async () => {
   const { data, error } = await supabase.rpc('get_issues').select('*');
   if (error) {
      console.error('Error fetching issues:', error);
      return [];
   }

   return data as Issue[];
};

export const issues: Promise<Issue[]> = fetchIssues();

export function groupIssuesByStatus(issues: Issue[]): Record<number, Issue[]> {
   return issues.reduce<Record<number, Issue[]>>((acc, issue) => {
      const statusId = issue.status.status_id;

      if (!acc[statusId]) {
         acc[statusId] = [];
      }

      acc[statusId].push(issue);

      return acc;
   }, {});
}
