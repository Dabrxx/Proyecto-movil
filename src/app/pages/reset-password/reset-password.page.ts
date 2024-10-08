import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticaService } from 'src/app/authentica.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email:any
  constructor(public route:Router, public authService:AuthenticaService) { }

  ngOnInit() {
  }

  async resetPassword(){
    this.authService.resetPassword(this.email).then(()=>{
      console.log('reset link sent')
      this.route.navigate(['/login'])
    }
    ).catch((error) =>{
      console.log(error);
    })
  }
}
