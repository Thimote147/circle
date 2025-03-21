import { supabase } from '@/utils/supabaseClient';

export interface LabelInterface {
   label_id: number;
   name: string;
   color: string;
}

export const fetchLabels = async () => {
   const { data, error } = await supabase.from('labels').select('*');
   if (error) {
      console.error('Error fetching labels:', error);
      return [];
   }

   return data as LabelInterface[];
};

export const labels: Promise<LabelInterface[]> = fetchLabels();
