import { Component, AfterViewInit } from '@angular/core';
import { CrudService } from '../../services/crud.service'; // Importa correctamente CrudService
import * as mapboxgl from 'mapbox-gl'; // Importamos mapbox-gl

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
  imageFile!: File;
  latitude: number = 0;
  longitude: number = 0;
  searchQuery: string = '';

  map!: mapboxgl.Map;

  constructor(private crudService: CrudService) {}

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

  // Registrar archivo seleccionado
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  // Validar el formulario
  isFormValid() {
    return this.birdName && this.imageFile && this.latitude && this.longitude;
  }

  // Enviar datos del ave
  async submitBirdForm() {
    if (!this.isFormValid()) {
      console.error('Formulario inválido');
      return;
    }

    try {
      // Subir la imagen al bucket
      const { data: imageData, error: imageError } = await this.crudService.uploadImage(this.imageFile);
      if (imageError) {
        console.error('Error al subir la imagen:', imageError);
        return;
      }

      // Crear el objeto con los datos del ave
      const birdData = {
        name: this.birdName,
        scientific_name: this.scientificName || null,
        description: this.description || null,
        colors: this.colors.join(','), // Convierte el arreglo a cadena separada por comas
        photo_url: imageData?.path, // Ruta de la imagen subida
        latitude: this.latitude,
        longitude: this.longitude,
      };

      // Insertar los datos del ave en la base de datos
      const { error: insertError } = await this.crudService.createBird(birdData);
      if (insertError) {
        console.error('Error al insertar los datos del ave:', insertError);
      } else {
        console.log('Ave agregada correctamente');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  }

  colorOptions = ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Morado', 'Rosa', 'Gris', 'Negro', 'Blanco'];

}
