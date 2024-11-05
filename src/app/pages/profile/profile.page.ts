import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from 'src/app/user-profile.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/storageS.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';


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
    private ngFireAuth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      displayName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
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
      this.presentToast('Error al cargar el perfil de usuario.')
    }
  }

  async updateUserProfile() {
    try {
       const emailInput = this.profileForm.get('email')?.value;
       const user = await this.ngFireAuth.currentUser;
 
       if (user && emailInput === user.email) {
          const updateData = { displayName: this.profileForm.value.displayName };
          const response = await this.userProfileService.updateUserProfile(updateData);
          console.log(response.message);
          alert(response.message);
       } else {
         this.presentToast('El correo ingresado no coincide con el correo de autenticación.');
       }
    } catch (error) {
       console.error('Error al actualizar el perfil: ', error);
       this.presentToast('Error al actualizar el perfil.')
    }
 }

  async deletedUserProfile() {
    if(confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')){
      try {
        const response = await this.userProfileService.deleteUserProfile()
        console.log(response.message)
        this.presentToast(response.message)

        await this.storageService.clear();
        await this.ngFireAuth.signOut()
        this.router.navigate(['/landing'])
      } catch(error){
        console.error('Error al eliminar el perfil: ',error)
        this.presentToast('Error al eliminar el perfil.')
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'top'
    });
    toast.present();
  }


}
