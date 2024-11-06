import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from 'src/app/user-profile.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/storageS.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { ProfileUseCase } from 'src/app/use-cases/profile.usecase';


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
    private toastController: ToastController,
    private profileUseCase: ProfileUseCase
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      displayName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
    })
    
    this.loadUserProfile()
  }

  async loadUserProfile() {
    const result = await this.profileUseCase.loadUserProfile();
    if (result.success && result.data) {
      this.userProfile = result.data;
      this.profileForm.patchValue(this.userProfile);
    } else {
      this.presentToast(result.message || 'Error al cargar el perfil de usuario.');
    }
  }

  async updateUserProfile() {
    const { displayName, email } = this.profileForm.value;
    const result = await this.profileUseCase.updateUserProfile(displayName, email);
    this.presentToast(result.message);
  }

  async deleteUserProfile() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
      const result = await this.profileUseCase.deleteUserProfile();
      this.presentToast(result.message);
      if (result.success) {
        this.router.navigate(['/landing']);
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
