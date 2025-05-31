import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://rdkczrfvfnytwgdgjbjn.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJka2N6cmZ2Zm55dHdnZGdqYmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTgyMjAsImV4cCI6MjA2Mjk5NDIyMH0.eImMFCmK9fuaVradXF_bcY18sj-ltNpfw_f-suldnkg';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);