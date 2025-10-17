// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://puxwyiuunwpomnxrpeks.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eHd5aXV1bndwb21ueHJwZWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ5Mjg1NSwiZXhwIjoyMDcyMDY4ODU1fQ.499OBo881D7plLYg7tdOjSkfTzXHgK-fCEIEtsX_lhg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
