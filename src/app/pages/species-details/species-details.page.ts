import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpeciesService } from '../../services/species.service';
import { FavoritesService } from 'src/app/favorites.service';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-species-details',
  templateUrl: './species-details.page.html',
  styleUrls: ['./species-details.page.scss'],
})
export class SpeciesDetailsPage implements OnInit {
  bird: any;

  constructor(
    private route: ActivatedRoute,
    private speciesService: SpeciesService,
    private favoritesService: FavoritesService,
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
  ) {}

  ngOnInit() {
    const birdId = this.route.snapshot.paramMap.get('id');
    if (birdId) {
      this.speciesService.getBirdData(birdId).subscribe((response: any) => {
        const bird = response.results[0];
        this.bird = {
          photo: bird.default_photo?.medium_url || 'No disponible',
          commonName: bird.preferred_common_name || 'No disponible',
          scientificName: bird.name || 'No disponible',
          description: this.getFullDescription(bird) || 'Descripción no disponible',
          location: bird.place_guess || 'Lugar no disponible',
        };
      });
    }
  }

  // Función para seleccionar el texto más completo disponible
  getFullDescription(bird: any): string {
    const description = bird.wikipedia_text || bird.wikipedia_summary;
    return this.stripHtml(description);
  }

  // Función para eliminar etiquetas HTML
  stripHtml(html: string): string {
    return html ? html.replace(/<[^>]+>/g, '') : '';
  }

  // Método para agregar a favoritos
  async addToFavorites() {
    const { photo, commonName, scientificName, description } = this.bird;

    // Obtener el usuario autenticado
    const user = await this.afAuth.currentUser;
    if (user) {
      // Llamamos al servicio de favoritos pasando los parámetros correctos
      this.favoritesService.addFavorite(photo, commonName, scientificName, description)
        .then(() => {
          this.presentToast('Pájaro añadido a favoritos');
        })
        .catch((error) => {
          console.error('Error al añadir a favoritos:', error);
          this.presentToast('Error al añadir a favoritos', 'danger');
        });
    } else {
      console.error('Usuario no autenticado');
      this.presentToast('Por favor, inicie sesión', 'danger');
    }
  }

  // Función para mostrar un toast de éxito/error
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}