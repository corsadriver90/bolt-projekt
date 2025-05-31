import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from '@/lib/supabaseClient';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const logAdminEvent = async (type, source, message, details, ankaufsNummer) => {
  if (!supabase) {
    console.error("Supabase client not initialized. Cannot log admin event via Edge Function.");
    console.error("Original Log Data (not sent):", { type, source, message, details, ankaufsNummer });
    return;
  }

  const logPayload = {
    type,
    source,
    message,
    details: details || {},
    ankaufs_nummer: ankaufsNummer || null,
  };

  try {
    const { data, error } = await supabase.functions.invoke('log-admin-event', {
      body: logPayload,
    });

    if (error) {
      console.error('Error invoking log-admin-event Edge Function:', error);
      console.error("Original Log Data for Failed Edge Function Call:", logPayload);
    } else if (data && data.error) {
      console.error('Error reported by log-admin-event Edge Function:', data.error, data.details);
      console.error("Original Log Data for Failed Edge Function Logic:", logPayload);
    } else {
      console.log('Admin event logged successfully via Edge Function.');
    }
  } catch (e) {
    console.error('Exception while invoking log-admin-event Edge Function:', e);
    console.error("Original Log Data for Exception during Edge Function Call:", logPayload);
  }
};