import { Component,OnInit } from '@angular/core';
import { AuthenticaService } from '../authentica.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string;

  constructor(public route:Router ,public authService:AuthenticaService) {}

  async ngOnInit() {
    // Obtener el perfil del usuario
    const user = await this.authService.getProfile();
    if (user) {
      this.userName = user.displayName || 'Usuario';  // Mostrar "Usuario" si displayName está vacío
    }
  }

  async logout(){
    this.authService.signOut().then(()=>{
      this.route.navigate(['/login'])
    })
  }

}
