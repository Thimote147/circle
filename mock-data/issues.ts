import { LexoRank } from '@/lib/utils';
import { LabelInterface, labels } from './labels';
import { Priority, priorities } from './priorities';
import { Project, projects } from './projects';
import { Status, status } from './status';
import { User, users } from './users';
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
   rank: string;
}

// generates issues ranks using LexoRank algorithm.
export const ranks: string[] = [];
const generateIssuesRanks = () => {
   const firstRank = new LexoRank('a3c');
   ranks.push(firstRank.toString());
   for (let i = 1; i < 30; i++) {
      const previousRank = LexoRank.from(ranks[i - 1]);
      const currentRank = previousRank.increment();
      ranks.push(currentRank.toString());
   }
};
generateIssuesRanks();

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

export async function sortIssuesByPriority(issues: Issue[]): Promise<Issue[]> {
   const { data: prioritiesData, error: prioritiesError } = await supabase
      .from('priorities')
      .select('*');

   if (prioritiesError) {
      console.error('Error fetching priorities:', prioritiesError);
      return issues;
   }

   const priorityOrder: Record<number, number> = {};
   prioritiesData.forEach((priority) => {
      if (priority.name === 'Urgent') {
         priorityOrder[priority.priority_id] = 0;
      } else if (priority.name === 'High') {
         priorityOrder[priority.priority_id] = 1;
      } else if (priority.name === 'Medium') {
         priorityOrder[priority.priority_id] = 2;
      } else if (priority.name === 'Low') {
         priorityOrder[priority.priority_id] = 3;
      } else if (priority.name === 'No Priority') {
         priorityOrder[priority.priority_id] = 4;
      }
   });

   return issues
      .slice()
      .sort(
         (a, b) =>
            priorityOrder[a.priority.priority_id as keyof typeof priorityOrder] -
            priorityOrder[b.priority.priority_id as keyof typeof priorityOrder]
      );
}
