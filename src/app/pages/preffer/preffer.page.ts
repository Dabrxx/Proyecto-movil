import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/favorites.service';
import { CrudService } from '../../services/crud.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service'; // Importar el servicio Supabase

@Component({
  selector: 'app-preffer',
  templateUrl: './preffer.page.html',
  styleUrls: ['./preffer.page.scss'],
})
export class PrefferPage implements OnInit {
  favorites: any[] = []; // Lista de favoritos de Firebase
  birds: any[] = []; // Lista de aves desde Supabase
  segmentValue: string = 'birds'; // Valor inicial del segmento
  session: any; // Almacenar la sesión activa

  constructor(
    private favoritesService: FavoritesService,
    private crudService: CrudService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private supabaseService: SupabaseService // Inyectar el servicio Supabase
  ) {}

  ngOnInit() {
    this.loadBirds(); // Cargar aves de Supabase
    this.loadFavorites(); // Cargar favoritos de Firebase
    this.checkSession(); // Verificar la sesión activa de Supabase
  }

  // Método para verificar si hay una sesión activa
  async checkSession() {
    this.session = await this.supabaseService.getSession();
    console.log('Sesión activa:', this.session);
  }

  // Cargar aves desde Supabase
  async loadBirds() {
    try {
      const { data, error } = await this.crudService.getAllBirds();
      if (error) {
        console.error('Error al obtener las aves:', error.message);
      } else {
        // Generar las URLs de las imágenes usando el servicio Supabase
        this.birds = (data || []).map(bird => ({
          ...bird,
          photo_url: bird.photo_url ? this.supabaseService.getPublicImageUrl(bird.photo_url) : 'assets/default-image.jpg', // Usar el servicio para generar la URL
        }));
      }
    } catch (error) {
      console.error('Error inesperado al cargar aves:', error);
    }
  }

  // Cargar favoritos desde Firebase
  loadFavorites() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.favoritesService.getFavorites(user.uid).subscribe((data) => {
          this.favorites = data || [];
        });
      }
    }).catch((error) => {
      console.error('Error al obtener el usuario autenticado:', error);
    });
  }

  // Modificar favorito en Firebase
  modifyFavorite(favorite: any) {
    console.log('Modificando favorito:', favorite);
    // Implementar lógica para modificar favorito
  }

  // Modificar ave en Supabase
  modifyBird(bird: any) {
    console.log('Modificando ave:', bird);
    // Implementar lógica para modificar ave
  }

  // Eliminar favorito de Firebase
  deleteFavorite(id: string) {
    this.favoritesService.deleteFavorite(id).then(() => {
      console.log('Favorito eliminado correctamente');
    }).catch((error) => {
      console.error('Error al eliminar el favorito:', error);
    });
  }

  // Eliminar ave de Supabase
  deleteBird(id: string) {
    this.crudService.deleteBird(id).then(() => {
      console.log('Ave eliminada correctamente');
      this.loadBirds(); // Recargar la lista de aves
    }).catch((error) => {
      console.error('Error al eliminar el ave:', error);
    });
  }

  // Ver detalles de un favorito (Firebase)
  viewFavoriteDetails(favorite: any) {
    if (favorite.birdId) {
      this.router.navigate(['/species-details', favorite.birdId]);
    } else {
      console.error('birdId no encontrado en el favorito');
    }
  }

  // Ver detalles de un ave (Supabase)
  viewBirdDetailsSupa(bird: any) {
    if (bird.id) {
      this.router.navigate(['/bird-details', bird.id]);
    } else {
      console.error('ID de ave no encontrado');
    }
  }
}
