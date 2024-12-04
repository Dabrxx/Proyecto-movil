import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { SupabaseService } from '../../services/supabase.service';
import { NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment'; // Importamos el archivo environment

@Component({
  selector: 'app-bird-details',
  templateUrl: './bird-details.page.html',
  styleUrls: ['./bird-details.page.scss'],
})
export class BirdDetailsPage implements OnInit {
  bird: any; // Datos de la ave
  photoUrl: string; // URL de la imagen de la ave
  mapboxUrl: string = ''; // URL del mapa

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService,
    private supabaseService: SupabaseService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    const birdId = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la ave desde la URL
    if (birdId) {
      this.loadBirdDetails(birdId); // Cargar detalles de la ave
    }
  }

  // Cargar detalles de la ave desde Supabase
  async loadBirdDetails(birdId: string) {
    try {
      const { data, error } = await this.crudService.getBirdById(birdId); // Método para obtener una ave por ID
      if (error) {
        console.error('Error al obtener detalles de la ave:', error.message);
      } else {
        this.bird = data;
        // Obtener la URL de la imagen usando el servicio de Supabase
        this.photoUrl = this.supabaseService.getPublicImageUrl(data.photo_url);
        
        // Si las coordenadas están presentes, generar la URL del mapa usando Mapbox
        if (data.latitude && data.longitude) {
          this.mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f00(${data.longitude},${data.latitude})/${data.longitude},${data.latitude},14/500x300?access_token=${environment.mapboxAccessToken}`;
        }
      }
    } catch (error) {
      console.error('Error inesperado al cargar los detalles de la ave:', error);
    }
  }

  // Navegar para actualizar la ave
  updateBird() {
    this.router.navigate(['/update-bird', this.bird.id]);
  }

  // Eliminar la ave
  async deleteBird() {
    try {
      await this.crudService.deleteBird(this.bird.id);
      this.navCtrl.navigateBack('/preffer');
    } catch (error) {
      console.error('Error al eliminar la ave:', error);
    }
  }
}
