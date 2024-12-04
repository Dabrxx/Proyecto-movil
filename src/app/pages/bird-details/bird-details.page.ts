import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { SupabaseService } from '../../services/supabase.service';
import { NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bird-details',
  templateUrl: './bird-details.page.html',
  styleUrls: ['./bird-details.page.scss'],
})
export class BirdDetailsPage implements OnInit {
  bird: any = {}; // Inicializar el objeto bird como vacío
  photoUrl: string;
  mapboxUrl: string = '';
  latitude: number;
  longitude: number;

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService,
    private supabaseService: SupabaseService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    const birdId = this.route.snapshot.paramMap.get('id');
    if (birdId) {
      this.loadBirdDetails(birdId);
    }
  }

  async loadBirdDetails(birdId: string) {
    try {
      const { data, error } = await this.crudService.getBirdById(birdId);
      if (error) {
        console.error('Error al obtener detalles de la ave:', error.message);
      } else {
        this.bird = data;
        this.photoUrl = this.supabaseService.getPublicImageUrl(data.photo_url);

        if (data.latitude && data.longitude) {
          this.latitude = data.latitude;
          this.longitude = data.longitude;
          this.mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f00(${this.longitude},${this.latitude})/${this.longitude},${this.latitude},14/500x300?access_token=${environment.mapboxAccessToken}`;
        }
      }
    } catch (error) {
      console.error('Error inesperado al cargar los detalles de la ave:', error);
    }
  }

  updateBird() {
    this.router.navigate(['/update-bird', this.bird.id]);
  }

  async deleteBird() {
    try {
      await this.crudService.deleteBird(this.bird.id);
      this.navCtrl.navigateBack('/preffer');
    } catch (error) {
      console.error('Error al eliminar la ave:', error);
    }
  }

  // Método para guardar las actualizaciones
  async saveUpdates() {
    try {
      const updatedBird = {
        name: this.bird.name,
        scientific_name: this.bird.scientific_name,
        description: this.bird.description,
        colors: this.bird.colors,
        latitude: this.latitude,
        longitude: this.longitude,
      };
      await this.crudService.updateBird(this.bird.id, updatedBird);
      this.navCtrl.navigateBack('/preffer');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }
}
