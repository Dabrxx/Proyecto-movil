import { Component, OnInit } from '@angular/core';
import { SpeciesService } from '../../services/species.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
})
export class CatalogoPage implements OnInit {
  birds: any[] = [];

  constructor(private speciesService: SpeciesService, private router: Router) {}

  ngOnInit() {
    this.speciesService.getBirdData().subscribe((response: any) => {
      this.birds = response.results.map((bird: any) => ({
        id: bird.id,
        photo: bird.default_photo?.medium_url || 'No disponible',
        commonName: bird.preferred_common_name || 'No disponible',
        scientificName: bird.name || 'No disponible',
      }));
    });
  }

  viewBirdDetails(bird: any) {
    this.router.navigate(['/species-details', bird.id]);
  }
}