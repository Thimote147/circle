import { LabelInterface, labels } from './labels';
import { Project, projects } from './projects';
import { User, users } from './users';
import { Priority, priorities } from './priorities';
import { Status, status } from './status';
import { supabase } from '@/utils/supabaseClient';

export interface Issue {
   id: string;
   identifier: string;
   title: string;
   status: Status;
   assignees: User | null;
   priority: Priority;
   labels: LabelInterface[];
   createdAt: string;
   cycleId: string;
   project?: Project;
   subissues?: string[];
}

const fetchIssues = async () => {
   const { data, error } = await supabase.from('issues').select('*');
   if (error) {
      console.error('Error fetching issues:', error);
      return [];
   }

   // Transform the data to match the expected structure
   const transformedData = data.map((issue: any) => ({
      ...issue,
      status: { status_id: issue.status },
      assignees: issue.assignee ? { id: issue.assignee } : null,
      priority: { id: issue.priority },
      labels: issue.label ? [{ id: issue.label }] : [],
   }));

   return transformedData as Issue[];
};

export const issues: Issue[] = await fetchIssues();

export function groupIssuesByStatus(issues: Issue[]): Record<string, Issue[]> {
   return issues.reduce<Record<string, Issue[]>>((acc, issue) => {
      const statusId = issue.status.status_id;

      if (!acc[statusId]) {
         acc[statusId] = [];
      }

      acc[statusId].push(issue);

      return acc;
   }, {});
}
