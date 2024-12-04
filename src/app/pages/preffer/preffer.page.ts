import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from 'src/app/favorites.service';
import { CrudService } from '../../services/crud.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { AuthenticaService } from 'src/app/authentica.service';

@Component({
  selector: 'app-preffer',
  templateUrl: './preffer.page.html',
  styleUrls: ['./preffer.page.scss'],
})
export class PrefferPage implements OnInit, OnDestroy {
  favorites: any[] = []; // Lista de favoritos de Firebase
  birds: any[] = []; // Lista de aves desde Supabase
  segmentValue: string = 'birds'; // Valor inicial del segmento
  session: any; // Sesión activa de Supabase
  private updateInterval: any; // Intervalo para la actualización periódica

  constructor(
    private favoritesService: FavoritesService,
    private crudService: CrudService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private supabaseService: SupabaseService,
    private authenticaService: AuthenticaService
  ) {}

  async ngOnInit() {
    // Validar si el usuario está autenticado
    const isAuthenticated = await this.authenticaService.isAuthenticated();
    if (!isAuthenticated) {
      console.error('Usuario no autenticado');
      this.router.navigate(['/login']); // Redirigir al inicio de sesión
      return;
    }

    // Cargar datos iniciales
    await this.loadBirds();
    this.loadFavorites();
    await this.checkSession();
  }


  async ionViewWillEnter() {
    // Actualizar favoritos al reingresar a la página
    const user = await this.afAuth.currentUser;
    if (user) {
      this.favoritesService.getFavorites(user.uid).subscribe(
        (data) => {
          this.favorites = data || [];
        },
        (error) => console.error('Error al cargar favoritos:', error)
      );
    }
    await this.loadBirds();
    this.loadFavorites();
  }

  async checkSession() {
    try {
      this.session = await this.supabaseService.getSession();
      console.log('Sesión activa de Supabase:', this.session);
    } catch (error) {
      console.error('Error al obtener sesión de Supabase:', error);
    }
  }

  async loadBirds() {
    try {
      const userId = await this.authenticaService.getUserUID();
      if (!userId) {
        console.error('Usuario no autenticado para cargar aves.');
        return;
      }

      const { data, error } = await this.crudService.getAllBirdsByUser(userId);
      if (error) {
        console.error('Error al obtener aves desde Supabase:', error.message);
        return;
      }

      this.birds = (data || []).map((bird) => ({
        ...bird,
        photo_url: bird.photo_url
          ? this.supabaseService.getPublicImageUrl(bird.photo_url)
          : 'assets/default-image.jpg',
      }));
    } catch (error) {
      console.error('Error inesperado al cargar aves:', error);
    }
  }

  loadFavorites() {
    this.afAuth.currentUser
      .then((user) => {
        if (user) {
          this.favoritesService.getFavorites(user.uid).subscribe(
            (data) => {
              this.favorites = data || [];
            },
            (error) => console.error('Error al cargar favoritos:', error)
          );
        }
      })
      .catch((error) => {
        console.error('Error al obtener el usuario autenticado:', error);
      });
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval); // Limpiar el intervalo al destruir el componente
    }
  }

  modifyFavorite(favorite: any) {
    console.log('Modificando favorito:', favorite);
    // Implementar lógica para modificar
  }

  modifyBird(bird: any) {
    console.log('Modificando ave:', bird);
    // Implementar lógica para modificar
  }

  deleteFavorite(id: string) {
    this.favoritesService.deleteFavorite(id).then(() => {
      console.log('Favorito eliminado correctamente');
      this.loadFavorites(); // Recargar favoritos
    });
  }

  deleteBird(id: string) {
    this.crudService.deleteBird(id).then(() => {
      console.log('Ave eliminada correctamente');
      this.loadBirds(); // Recargar aves
    });
  }

  viewFavoriteDetails(favorite: any) {
    if (favorite?.birdId) {
      this.router.navigate(['/species-details', favorite.birdId]);
    } else {
      console.error('birdId no encontrado en el favorito');
    }
  }

  viewBirdDetailsSupa(bird: any) {
    if (bird?.id) {
      this.router.navigate(['/bird-details', bird.id]);
    } else {
      console.error('ID de ave no encontrado');
    }
  }
}
