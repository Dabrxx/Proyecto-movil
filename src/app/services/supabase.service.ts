import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseUrl = 'https://your-project-url.supabase.co';
  private supabaseKey = 'your-supabase-anon-key';
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);

  constructor() {}

  uploadImage(file: File) {
    const filePath = `bird_photos/${Date.now()}_${file.name}`;
    return this.supabase.storage
      .from('bird_photos')
      .upload(filePath, file);
  }

  insertBirdData(data: any) {
    return this.supabase
      .from('birds')
      .insert([data])
      .single();
  }
  // Obtener todas las aves
getBirds() {
    return this.supabase
      .from('birds')
      .select('*');
  }
  
  // Eliminar una ave por ID
  deleteBird(id: string) {
    return this.supabase
      .from('birds')
      .delete()
      .match({ id });
  }
  
}
