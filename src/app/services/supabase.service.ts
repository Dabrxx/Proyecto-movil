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

  // Método para generar la URL pública de una imagen en el bucket 'bird_photos'
  getPublicImageUrl(fileName: string): string {
    const SUPABASE_URL = environment.supabaseConfig.supabaseUrl; // URL base de Supabase
    const BUCKET_NAME = 'bird_photos'; // Nombre del bucket
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
  }

  // Método para obtener la sesión activa de Supabase
  async getSession() {
    try {
      const session = await this.supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error al obtener la sesión de Supabase:', error);
      return null;
    }
  }
}
