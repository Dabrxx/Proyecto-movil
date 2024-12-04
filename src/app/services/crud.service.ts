import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private supabase;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabase;
  }

  // Obtener todas las aves
  async getAllBirdsByUser(userId: string) {
    return this.supabase.from('birds').select('*').eq('user_id', userId);
  }

  // Obtener un ave por ID
  async getBirdById(id: string) {
    return this.supabase.from('birds').select('*').eq('id', id).single();
  }

  // Crear una nueva ave
  async createBird(birdData: any) {
    return this.supabase.from('birds').insert([birdData]);
  }

  // Actualizar un ave
  async updateBird(id: string, birdData: any) {
    return this.supabase.from('birds').update(birdData).eq('id', id);
  }

  // Eliminar un ave
  async deleteBird(id: string) {
    return this.supabase.from('birds').delete().eq('id', id);
  }

  // Subir imagen al bucket
  async uploadImage(file: File) {
    const fileName = `bird_photos/${Date.now()}_${file.name}`;
    return this.supabase.storage.from('bird_photos').upload(fileName, file);
  }
  
}
