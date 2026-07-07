import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  'https://qihlqrmbcbfzjwfegsxv.supabase.co'

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaGxxcm1iY2Jmemp3ZmVnc3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NTA5NjMsImV4cCI6MjA5ODQyNjk2M30.zuNzWH4iYUoejb5dhLvGPuq097lBWIE2RP3jsfrzvng'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function getUtm() {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  }
}

export async function trackEvent(
  event_type: string,
  time_on_page_sec?: number,
) {
  const { utm_source } = getUtm()
  await supabase.from('page_events').insert({
    event_type,
    time_on_page_sec: time_on_page_sec ?? null,
    utm_source,
  })
}

export async function submitEmail(email: string): Promise<{ error: string | null; waitlistId: string | null }> {
  const utm = getUtm()
  // Generate UUID client-side to avoid needing a SELECT policy after insert
  const id = crypto.randomUUID()
  const { error } = await supabase
    .from('waitlist')
    .insert({ id, email, ...utm })

  if (error) {
    if (error.code === '23505') return { error: 'duplicate', waitlistId: null }
    return { error: 'network', waitlistId: null }
  }
  return { error: null, waitlistId: id }
}

export async function submitSurvey(
  waitlistId: string,
  frequency: string,
  attraction: string[],
  entryFormat: string,
) {
  await supabase.from('survey_responses').insert({
    waitlist_id: waitlistId,
    frequency,
    attraction,
    entry_format: entryFormat,
  })
}
