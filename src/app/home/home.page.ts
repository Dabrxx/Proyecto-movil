import { Component } from '@angular/core';
import { AuthenticaService } from '../authentica.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user:any
  constructor(public router:Router,public authService:AuthenticaService) {
    this.user = authService.getProfile()
  }

  async logout(){
    this.authService.signOut().then(()=>{
      this.router.navigate(['/landing'])
    }).catch((error)=>{
      console.log(error);
    })
  }
}
