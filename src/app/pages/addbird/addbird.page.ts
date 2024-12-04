import { Component, AfterViewInit } from '@angular/core';
import { CrudService } from '../../services/crud.service'; // Importa CrudService
import * as mapboxgl from 'mapbox-gl'; // Importamos mapbox-gl
import { AuthenticaService } from 'src/app/authentica.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addbird',
  templateUrl: './addbird.page.html',
  styleUrls: ['./addbird.page.scss'],
})
export class AddbirdPage implements AfterViewInit {
  
  birdName: string = '';
  scientificName: string = '';
  description: string = '';
  colors: string[] = [];
  latitude: number = 0;
  longitude: number = 0;
  imageFile!: File;  // Variable para almacenar el archivo de la imagen

  map!: mapboxgl.Map;

  constructor(
    private crudService: CrudService,
    private authService:AuthenticaService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    this.initMap();
  }

  // Inicializa el mapa de Mapbox
  initMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-71.53285158962608, -33.03383294345084], // Coordenadas iniciales
      zoom: 10,
      accessToken: 'pk.eyJ1IjoiYmlvZGl2ZXJzaWRhZCIsImEiOiJjbTQ2ZzJudmEwdGN1MnZwa3J5MWNmMjk4In0.u-3Ducr0OwlE-QsLYJmCiA',
    });

    // Actualizar coordenadas al mover el mapa
    this.map.on('move', () => {
      const center = this.map.getCenter();
      this.latitude = center.lat;
      this.longitude = center.lng;
    });
  }

  // Maneja la selección de la imagen
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  // Validar el formulario
  isFormValid() {
    return this.birdName && this.latitude && this.longitude && this.imageFile;
  }

  // Enviar los datos del formulario
  async submitBirdForm() {
    if (!this.isFormValid()) {
      console.error('Formulario inválido');
      return;
    }
  
    try {
      const userId = await this.authService.getUserUID();
      if (!userId) {
        console.error('Usuario no autenticado');
        return;
      }
  
      const { data: imageData, error: imageError } = await this.crudService.uploadImage(this.imageFile);
      if (imageError || !imageData?.path) {
        console.error('Error al subir la imagen:', imageError);
        return;
      }
  
      const birdData = {
        name: this.birdName,
        scientific_name: this.scientificName || null,
        description: this.description || null,
        colors: this.colors.join(','), 
        latitude: this.latitude,
        longitude: this.longitude,
        photo_url: imageData.path,
        user_id: userId,
      };
  
      const { error: insertError } = await this.crudService.createBird(birdData);
      if (insertError) {
        console.error('Error al insertar los datos del ave:', insertError);
      } else {
        alert('¡Ave agregada correctamente!');
        // Navegar de vuelta a la página de preferencias (preffer)
        this.router.navigate(['/preffer']);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  }

  colorOptions = ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Morado', 'Rosa', 'Gris', 'Negro', 'Blanco'];
}