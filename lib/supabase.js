import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);

export const logPrompts = async (dataStr) => {
    const { error } = await supabaseAdmin
      .from('runs')
      .insert({ 
        prompts: dataStr,
      });
    
    if (error) {
      console.error('Error logging run:', error);
    }
  };

  export const logCompletions = async (dataStr) => {
    const { error } = await supabaseAdmin
      .from('runs')
      .insert({ 
        completions: dataStr,
      });
    
    if (error) {
      console.error('Error logging run:', error);
    }
  };