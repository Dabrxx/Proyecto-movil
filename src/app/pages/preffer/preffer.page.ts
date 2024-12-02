import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/favorites.service';
import { SupabaseService } from '../../services/supabase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preffer',
  templateUrl: './preffer.page.html',
  styleUrls: ['./preffer.page.scss'],
})
export class PrefferPage implements OnInit {
  favorites: any[] = []; // Usado para favoritos de Firebase
  birds: any[] = []; // Usado para aves desde Supabase

  constructor(
    private favoritesService: FavoritesService,
    private supabaseService: SupabaseService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBirds(); // Cargamos aves de Supabase
    this.loadFavorites(); // Cargamos favoritos de Firebase
  }

  // Cargar aves desde Supabase
  async loadBirds() {
    try {
      const { data, error } = await this.supabaseService.getBirds();
      if (error) {
        console.error('Error al obtener las aves', error);
      } else {
        this.birds = data;
      }
    } catch (error) {
      console.error('Error al cargar aves', error);
    }
  }

  // Cargar favoritos desde Firebase
  loadFavorites() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.favoritesService.getFavorites(user.uid).subscribe((data) => {
          this.favorites = data;
        });
      }
    });
  }

  // Modificar favorito de Firebase
  modifyFavorite(favorite: any) {
    console.log('Modificar favorito:', favorite);
    // Lógica para modificar
  }

  // Modificar ave de Supabase
  modifyBird(bird: any) {
    console.log('Modificar ave:', bird);
    // Lógica para modificar
  }

  // Eliminar favorito de Firebase
  deleteFavorite(id: string) {
    this.favoritesService.deleteFavorite(id).then(() => {
      console.log('Favorito eliminado');
    }).catch(error => {
      console.error('Error al eliminar favorito:', error);
    });
  }

  // Eliminar ave de Supabase
  deleteBird(id: string) {
    this.supabaseService.deleteBird(id).then(() => {
      console.log('Ave eliminada');
      this.loadBirds(); // Recargamos aves después de eliminar
    });
  }

  // Ver detalles de favorito de Firebase
  viewFavoriteDetails(favorite: any) {
    if (favorite.birdId) {
      this.router.navigate(['/species-details', favorite.birdId]);
    } else {
      console.error('birdId no encontrado en el favorito');
    }
  }

  // Ver detalles de ave de Supabase
  viewBirdDetails(bird: any) {
    if (bird.id) {
      this.router.navigate(['/species-details', bird.id]);
    } else {
      console.error('ID de ave no encontrado');
    }
  }
}
