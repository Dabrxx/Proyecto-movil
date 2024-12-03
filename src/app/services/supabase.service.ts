import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    const { supabaseUrl, supabaseKey } = environment.supabaseConfig;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
}
