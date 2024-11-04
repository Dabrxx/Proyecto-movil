import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from 'src/app/user-profile.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/storageS.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup
  userProfile: any

  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private router: Router,
    private storageService: StorageService,
    private ngFireAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      displayName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      // para agregar otros campos
    })
    
    this.loadUserProfile()
  }

  async loadUserProfile() {
    try{
      this.userProfile = await this.userProfileService.getUserProfile()
      if (this.userProfile) {
        this.profileForm.patchValue(this.userProfile)
      }
    } catch(error) {
      console.error('Error al cargar el perfil de usuario: ', error)
    }
  }

  async updateUserProfile() {
    try{
      const updateData = this.profileForm.value
      const response = await this.userProfileService.updateUserProfile(updateData)
      console.log(response.message)
      alert(response.message)
    } catch (error) {
      console.error('Error al actualizar el perfil: ', error)
    }
  }

  async deletedUserProfile() {
    if(confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')){
      try {
        const response = await this.userProfileService.deleteUserProfile()
        console.log(response.message)
        alert(response.message)

        await this.storageService.clear();
        await this.ngFireAuth.signOut()
        this.router.navigate(['/landing'])
      } catch(error){
        console.error('Error al eliminar el perfil: ',error)
      }
    }
  }


}
