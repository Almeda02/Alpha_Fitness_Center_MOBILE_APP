import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uvvchpuogfiljvdehsng.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dmNocHVvZ2ZpbGp2ZGVoc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE1NjUsImV4cCI6MjA3MTYzNzU2NX0.Wk3tUfrUzR6b1dAmbFGcr6NdoXVneohDwlVuMVOTMno';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
