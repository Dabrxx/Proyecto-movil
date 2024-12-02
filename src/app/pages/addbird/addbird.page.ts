import { Component, AfterViewInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import * as mapboxgl from 'mapbox-gl';  // Importamos mapbox-gl

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

  constructor(private supabaseService: SupabaseService) {}

  ngAfterViewInit() {
    this.initMap();
  }

  // Inicializa el mapa de Mapbox
  initMap() {
    // Sin asignar accessToken aquí (lo usaremos desde el mapa directamente)
    this.map = new mapboxgl.Map({
      container: 'map',  // ID del div del mapa
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.6483, -33.4569],  // Coordenadas iniciales (Santiago de Chile)
      zoom: 10,
      accessToken: 'pk.eyJ1IjoiYmlvZGl2ZXJzaWRhZCIsImEiOiJjbTQ2ZzJudmEwdGN1MnZwa3J5MWNmMjk4In0.u-3Ducr0OwlE-QsLYJmCiA'  // Coloca el token directamente aquí
    });

    // Actualizar coordenadas en tiempo real cuando el mapa se mueve
    this.map.on('move', () => {
      const center = this.map.getCenter();
      this.latitude = center.lat;
      this.longitude = center.lng;
    });
  }

  // Buscar ubicación con la API de Mapbox
  async searchLocation() {
    if (this.searchQuery.trim() === '') return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          this.searchQuery
        )}.json?access_token=pk.eyJ1IjoiYmlvZGl2ZXJzaWRhZCIsImEiOiJjbTQ2ZzJudmEwdGN1MnZwa3J5MWNmMjk4In0.u-3Ducr0OwlE-QsLYJmCiA`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        this.map.flyTo({ center: [lng, lat], zoom: 14 });
      } else {
        console.error('Ubicación no encontrada');
      }
    } catch (error) {
      console.error('Error en la búsqueda de ubicación:', error);
    }
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

  // Registrar coordenadas seleccionadas
  registerCoordinates() {
    console.log('Coordenadas registradas:', {
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }

  // Enviar datos del ave
  async submitBirdForm() {
    if (!this.isFormValid()) {
      console.error('Formulario inválido');
      return;
    }

    try {
      // Subir la imagen al bucket de Supabase
      const { data, error } = await this.supabaseService.uploadImage(this.imageFile);
      if (error) {
        console.error('Error al subir la imagen:', error);
        return;
      }

      // Crear el objeto con los datos del ave
      const birdData = {
        name: this.birdName,
        scientific_name: this.scientificName || null,
        description: this.description || null,
        colors: this.colors.join(','), // Convierte el arreglo a una cadena separada por comas
        photo_url: data?.path, // Usamos 'path' para obtener la ruta de la imagen
        latitude: this.latitude,
        longitude: this.longitude,
      };

      // Insertar los datos del ave en la base de datos
      const { error: insertError } = await this.supabaseService.insertBirdData(birdData);
      if (insertError) {
        console.error('Error al insertar los datos del ave:', insertError);
      } else {
        console.log('Ave agregada correctamente');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  }
}
