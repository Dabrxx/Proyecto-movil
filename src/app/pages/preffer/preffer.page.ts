import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/favorites.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';  // Importamos Router

@Component({
  selector: 'app-preffer',
  templateUrl: './preffer.page.html',
  styleUrls: ['./preffer.page.scss'],
})
export class PrefferPage implements OnInit {
  favorites: any[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private afAuth: AngularFireAuth,
    private router: Router  // Inyectamos el Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.favoritesService.getFavorites(user.uid).subscribe((data) => {
          this.favorites = data;
        });
      }
    });
  }

  modifyFavorite(favorite: any) {
    // Implementa la lógica para modificar el favorito
    console.log('Modificar favorito:', favorite);
    // Puedes redirigir a un formulario de edición si lo deseas
  }

  deleteFavorite(id: string) {
    this.favoritesService.deleteFavorite(id).then(() => {
      console.log('Favorito eliminado');
    }).catch(error => {
      console.error('Error al eliminar favorito:', error);
    });
  }

  viewFavoriteDetails(favorite: any) {
    // Redirige a species-details pasando el birdId del favorito
    if (favorite.birdId) {
      this.router.navigate(['/species-details', favorite.birdId]);
    } else {
      console.error('birdId no encontrado en el favorito');
    }
  }
}