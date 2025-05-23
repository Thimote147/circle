import { groupIssuesByStatus, Issue, issues as mockIssues } from '@/mock-data/issues';
import { LabelInterface } from '@/mock-data/labels';
import { Priority } from '@/mock-data/priorities';
import { Project } from '@/mock-data/projects';
import { Status } from '@/mock-data/status';
import { User } from '@/mock-data/users';
import { supabase } from '@/utils/supabaseClient';
import { create } from 'zustand';

interface IssuesState {
   // Data
   issues: Issue[];
   issuesByStatus: Record<string, Issue[]>;

   // Actions
   getAllIssues: () => Promise<Issue[]>;
   addIssue: (issue: Issue) => void;
   updateIssue: (id: number, updatedIssue: Partial<Issue>) => void;
   deleteIssue: (id: number) => void;

   // Filters
   filterByStatus: (statusId: number) => Issue[];
   filterByPriority: (priorityId: number) => Issue[];
   filterByAssignee: (userId: number | null) => Issue[];
   filterByLabel: (labelId: number) => Issue[];
   filterByProject: (projectId: number) => Issue[];
   searchIssues: (query: string) => Issue[];

   // Status management
   updateIssueStatus: (issueId: number, newStatus: Status) => void;

   // Priority management
   updateIssuePriority: (issueId: number, newPriority: Priority) => void;

   // Assignee management
   updateIssueAssignee: (issueId: number, newAssignee: User[] | null) => void;

   // Labels management
   addIssueLabel: (issueId: number, label: LabelInterface) => void;
   removeIssueLabel: (issueId: number, labelId: number) => void;

   // Project management
   updateIssueProject: (issueId: number, newProject: Project | undefined) => void;

   // Utility functions
   getIssueById: (id: number) => Issue | undefined;
}

export const useIssuesStore = create<IssuesState>((set, get) => ({
   // Initial state
   issues: [],
   issuesByStatus: {},

   // Actions
   getAllIssues: async () => {
      const { data, error } = await supabase.rpc('get_issues').select('*');
      if (error) {
         console.error('Error fetching issues:', error);
         return [];
      }
      return data as Issue[];
   },

   addIssue: async (issue: Issue) => {
      const { error, data } = await supabase.rpc('insert_issue', {
         p_identifier: issue.identifier,
         p_title: issue.title,
         p_description: issue.description,
         p_status: issue.status.status_id,
         p_priority: issue.priority.priority_id,
         p_labels: issue.labels.length > 0 ? issue.labels.map((label) => label.label_id) : null,
         p_createdAt: issue.createdAt.split('T')[0],
         p_cycleId: issue.cycleId || 1,
         p_project: issue.project ? issue.project.project_id : null,
         p_subissues: issue.subissues && issue.subissues.length > 0 ? issue.subissues : null,
      });

      if (error) {
         console.error('Error adding issue:', error);
         return;
      }

      set((state) => {
         const newIssues = [...state.issues, issue];
         return {
            issues: newIssues,
            issuesByStatus: groupIssuesByStatus(newIssues),
         };
      });
   },

   updateIssue: (id: number, updatedIssue: Partial<Issue>) => {
      set((state) => {
         const newIssues = state.issues.map((issue) =>
            issue.issue_id === id ? { ...issue, ...updatedIssue } : issue
         );

         supabase
            .from('issues')
            .update(
               updatedIssue.priority
                  ? { priority: updatedIssue.priority.priority_id }
                  : { status: updatedIssue.status!.status_id }
            )
            .eq('issue_id', id)
            .then(({ data, error }) => {
               if (error) {
                  console.error('Error updating issue:', error);
               }
            });

         return {
            issues: newIssues,
            issuesByStatus: groupIssuesByStatus(newIssues),
         };
      });
   },

   deleteIssue: (id: number) => {
      set((state) => {
         const newIssues = state.issues.filter((issue) => issue.issue_id !== id);
         return {
            issues: newIssues,
            issuesByStatus: groupIssuesByStatus(newIssues),
         };
      });
   },

   // Filters
   filterByStatus: (statusId: number) => {
      return get().issues.filter((issue) => issue.status.status_id === statusId);
   },

   filterByPriority: (priorityId: number) => {
      return get().issues.filter((issue) => issue.priority.priority_id === priorityId);
   },

   filterByAssignee: (userId: number | null) => {
      if (userId === null) {
         return get().issues.filter((issue) => issue.assignees === null);
      }
      return get().issues.filter(
         (issue) => issue.assignees && issue.assignees[0]?.user_id === userId
      );
   },

   filterByLabel: (labelId: number) => {
      return get().issues.filter((issue) =>
         issue.labels.some((label) => label.label_id === labelId)
      );
   },

   filterByProject: (projectId: number) => {
      return get().issues.filter((issue) => issue.project?.project_id === projectId);
   },

   searchIssues: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return get().issues.filter(
         (issue) =>
            issue.title.toLowerCase().includes(lowerCaseQuery) ||
            issue.identifier.toLowerCase().includes(lowerCaseQuery)
      );
   },

   // Status management
   updateIssueStatus: (issueId: number, newStatus: Status) => {
      get().updateIssue(issueId, { status: newStatus });
   },

   // Priority management
   updateIssuePriority: (issueId: number, newPriority: Priority) => {
      get().updateIssue(issueId, { priority: newPriority });
   },

   // Assignee management
   updateIssueAssignee: (issueId: number, newAssignee: User[] | null) => {
      get().updateIssue(issueId, { assignees: newAssignee });
   },

   // Labels management
   addIssueLabel: (issueId: number, label: LabelInterface) => {
      const issue = get().getIssueById(issueId);
      if (issue) {
         const updatedLabels = [...issue.labels, label];
         get().updateIssue(issueId, { labels: updatedLabels });
      }
   },

   removeIssueLabel: (issueId: number, labelId: number) => {
      const issue = get().getIssueById(issueId);
      if (issue) {
         const updatedLabels = issue.labels.filter((label) => label.label_id !== labelId);
         get().updateIssue(issueId, { labels: updatedLabels });
      }
   },

   // Project management
   updateIssueProject: (issueId: number, newProject: Project | undefined) => {
      get().updateIssue(issueId, { project: newProject });
   },

   // Utility functions
   getIssueById: (id: number) => {
      return get().issues.find((issue) => issue.issue_id === id);
   },
}));

// Initialize issues after store creation
const initializeStore = async () => {
   const receivedIssues = await mockIssues;
   useIssuesStore.setState({
      issues: receivedIssues,
      issuesByStatus: groupIssuesByStatus(receivedIssues),
   });
};

initializeStore();
