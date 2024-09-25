import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importar el Router para la navegación

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private router: Router) { } // Inyectar el Router en el constructor

  ngOnInit() {
  }

  // Función para navegar a la página de Login
  goToLogin() {
    this.router.navigate(['/login']); // Navegar a la página de login
  }
}