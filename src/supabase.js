import { createClient } from '@supabase/supabase-js'

const supaUrl = 'https://xrqpjyyxykxuakqrzmzd.supabase.co'
const supaKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBqeXl4eWt4dWFrcXJ6bXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDY3NTUsImV4cCI6MjA5NDkyMjc1NX0.aPHqpVEDYHBrpG8y84cLGccNN1YW4CcCCid_7YoYt7U'

export const supabase = createClient(supaUrl, supaKey)
