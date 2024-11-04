import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticaService } from 'src/app/authentica.service';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/storageS.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(public route : Router, public formBuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthenticaService, public toastController:ToastController, private storageService: StorageService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email :['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}")
      ]]

    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'top'
    });
    toast.present();
  }
  

  get errorControl(){
    return this.loginForm?.controls;
  }

  async login (){
      const loading = await this.loadingCtrl.create()
      await loading.present()

      if(this.loginForm?.valid){
        try{
          const userCredential = await this.authService.loginUser(
            this.loginForm.value.email, 
            this.loginForm.value.password
          )

        if(userCredential?.user){
          const userClone = {
            uid: userCredential.user.email,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName || 'Usuario',
          }

          await this.storageService.set('user', userClone)
          await this.storageService.set('isSessionActive', true);

          this.route.navigate(['/landing'])

        }else{
          this.presentToast('Credenciales incorrectas o faltantes.');
        }
      } catch (error) {
        console.log(error);
        this.presentToast('Correo o contraseña incorrectos.');
      }
    } else {
      this.presentToast('Formulario inválido, Por favor, llene los campos correctamente.');
    }
    loading.dismiss();
  }
}