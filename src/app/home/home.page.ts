import { Component,OnInit } from '@angular/core';
import { AuthenticaService } from '../authentica.service';
import { Router } from '@angular/router';
import { StorageService } from '../storageS.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string;

  constructor(public route:Router ,public authService:AuthenticaService, private storageService: StorageService) {}

  async ngOnInit() {
    const storedUser = await this.storageService.get('user')

    if (storedUser) {
      this.userName = storedUser.displayName || 'Usuario';
    } else {
      const user = await this.authService.getProfile();
      if(user) {
        this.userName = user.displayName || 'Usuario';

        await this.storageService.set('user', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email
        })
      }
    }
  }

  async logout(){
    await this.authService.signOut()
    await this.storageService.clear()
    this.route.navigate(['/login'])
  }

}
