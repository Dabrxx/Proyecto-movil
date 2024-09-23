import { Component } from '@angular/core';
import { AuthenticaService } from '../authentica.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public route:Router ,public authService:AuthenticaService) {}

  async logout(){
    this.authService.signOut().then(()=>{
      this.route.navigate(['/login'])
    })
  }

}
