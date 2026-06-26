import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  'https://ddvboxgescsptvhkjgjl.supabase.co'

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdmJveGdlc2NzcHR2aGtqZ2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTY2MjUsImV4cCI6MjA2NDc3MjYyNX0.eIDNQwbV1MLDaplX3yH9CdTb6W7DXF8qZ15sb60C0fQ'

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
  const { data, error } = await supabase
    .from('waitlist')
    .insert({ email, ...utm })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'duplicate', waitlistId: null }
    return { error: 'network', waitlistId: null }
  }
  return { error: null, waitlistId: data.id }
}

export async function submitSurvey(
  waitlistId: string,
  frequency: string,
  attraction: string[],
  intent: string,
) {
  await supabase.from('survey_responses').insert({
    waitlist_id: waitlistId,
    frequency,
    attraction,
    intent,
  })
}
